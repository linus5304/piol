"use node";

import { v } from 'convex/values';
import { action } from '../_generated/server';

// Main payment processing action that routes to appropriate provider
export const processPayment = action({
  args: {
    transactionId: v.id('transactions'),
    amount: v.number(),
    currency: v.optional(v.string()),
    phoneNumber: v.string(),
    paymentMethod: v.union(v.literal('mtn_momo'), v.literal('orange_money')),
    returnUrl: v.optional(v.string()), // For Orange Money web payments
    cancelUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.runQuery(
      { name: 'transactions:getTransaction' },
      {
        id: args.transactionId,
      }
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Update transaction to processing status
    await ctx.runMutation(
      { name: 'transactions:updateTransactionStatus' },
      {
        id: args.transactionId,
        paymentStatus: 'processing',
      }
    );

    try {
      if (args.paymentMethod === 'mtn_momo') {
        // MTN MoMo - Direct USSD prompt
        const result = await ctx.runAction(
          { name: 'actions/mtnMomo:requestPayment' },
          {
            amount: args.amount,
            currency: args.currency,
            phoneNumber: args.phoneNumber,
            transactionId: args.transactionId,
            payerMessage: `Piol - Paiement pour ${transaction.transactionReference}`,
          }
        );

        return {
          success: true,
          method: 'mtn_momo',
          referenceId: result.referenceId,
          message: result.message,
          requiresRedirect: false,
        };
      }

      if (args.paymentMethod === 'orange_money') {
        if (!args.returnUrl || !args.cancelUrl) {
          throw new Error('Return URL and Cancel URL required for Orange Money');
        }

        // Orange Money - Web payment redirect
        const result = await ctx.runAction(
          { name: 'actions/orangeMoney:initializeWebPayment' },
          {
            amount: args.amount,
            currency: args.currency,
            transactionId: args.transactionId,
            returnUrl: args.returnUrl,
            cancelUrl: args.cancelUrl,
            notifyUrl: `${process.env.CONVEX_URL}/api/webhooks/orange-money`,
          }
        );

        return {
          success: true,
          method: 'orange_money',
          paymentUrl: result.paymentUrl,
          payToken: result.payToken,
          orderId: result.orderId,
          requiresRedirect: true,
        };
      }

      throw new Error('Invalid payment method');
    } catch (error) {
      // Revert transaction status on failure
      await ctx.runMutation(
        { name: 'transactions:updateTransactionStatus' },
        {
          id: args.transactionId,
          paymentStatus: 'failed',
        }
      );

      throw error;
    }
  },
});

// Poll payment status and update transaction
export const checkAndUpdatePaymentStatus = action({
  args: {
    transactionId: v.id('transactions'),
    paymentMethod: v.union(v.literal('mtn_momo'), v.literal('orange_money')),
    referenceId: v.string(),
    orderId: v.optional(v.string()), // For Orange Money
  },
  handler: async (ctx, args) => {
    let status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
    let financialTransactionId: string | undefined;

    if (args.paymentMethod === 'mtn_momo') {
      const result = await ctx.runAction(
        { name: 'actions/mtnMomo:checkPaymentStatus' },
        {
          referenceId: args.referenceId,
        }
      );
      status = result.status;
      financialTransactionId = result.financialTransactionId;
    } else {
      const result = await ctx.runAction(
        { name: 'actions/orangeMoney:checkPaymentStatus' },
        {
          payToken: args.referenceId,
          orderId: args.orderId!,
        }
      );
      status =
        result.status === 'SUCCESS'
          ? 'SUCCESSFUL'
          : result.status === 'PENDING'
            ? 'PENDING'
            : 'FAILED';
      financialTransactionId = result.transactionId;
    }

    // Map status and update transaction
    const paymentStatus =
      status === 'SUCCESSFUL' ? 'completed' : status === 'PENDING' ? 'processing' : 'failed';

    await ctx.runMutation(
      { name: 'transactions:updateTransactionStatus' },
      {
        id: args.transactionId,
        paymentStatus,
        completedAt: status === 'SUCCESSFUL' ? Date.now() : undefined,
      }
    );

    // If successful, handle post-payment actions
    if (status === 'SUCCESSFUL') {
      const transaction = await ctx.runQuery(
        { name: 'transactions:getTransaction' },
        {
          id: args.transactionId,
        }
      );

      if (transaction) {
        // Create notification for landlord
        await ctx.runMutation(
          { name: 'notifications:createNotification' },
          {
            userId: transaction.landlordId,
            notificationType: 'payment_received',
            title: 'Paiement reçu! 💰',
            message: `Vous avez reçu un paiement de ${transaction.amount} FCFA.`,
            data: {
              transactionId: args.transactionId,
              amount: transaction.amount,
              financialTransactionId,
            },
          }
        );

        // Create notification for renter
        await ctx.runMutation(
          { name: 'notifications:createNotification' },
          {
            userId: transaction.renterId,
            notificationType: 'payment_confirmed',
            title: 'Paiement confirmé! ✅',
            message: `Votre paiement de ${transaction.amount} FCFA a été confirmé.`,
            data: {
              transactionId: args.transactionId,
              amount: transaction.amount,
            },
          }
        );
      }
    }

    return {
      status,
      paymentStatus,
      financialTransactionId,
    };
  },
});

// Release escrow funds to landlord
export const releaseEscrow = action({
  args: {
    transactionId: v.id('transactions'),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.runQuery(
      { name: 'transactions:getTransaction' },
      {
        id: args.transactionId,
      }
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.escrowStatus !== 'held') {
      throw new Error('Funds are not in escrow');
    }

    // Get landlord phone number
    const landlord = await ctx.runQuery(
      { name: 'users:getUser' },
      {
        id: transaction.landlordId,
      }
    );

    if (!landlord) {
      throw new Error('Landlord not found');
    }

    // Deduct platform commission (e.g., 5%)
    const commissionRate = 0.05;
    const commission = Math.round(transaction.amount * commissionRate);
    const disbursementAmount = transaction.amount - commission;

    // Disburse funds via MTN MoMo (default)
    const result = await ctx.runAction(
      { name: 'actions/mtnMomo:disburseFunds' },
      {
        amount: disbursementAmount,
        phoneNumber: landlord.phone,
        transactionId: args.transactionId,
        payeeNote: `Piol - Versement loyer (ref: ${transaction.transactionReference})`,
      }
    );

    // Update escrow status
    await ctx.runMutation(
      { name: 'transactions:updateTransactionStatus' },
      {
        id: args.transactionId,
        escrowStatus: 'released',
      }
    );

    // Create commission transaction record
    await ctx.runMutation(
      { name: 'transactions:createTransaction' },
      {
        propertyId: transaction.propertyId,
        renterId: transaction.renterId,
        landlordId: transaction.landlordId,
        transactionType: 'commission',
        amount: commission,
        paymentMethod: 'mtn_momo',
        transactionReference: `COM-${transaction.transactionReference}`,
      }
    );

    return {
      success: true,
      disbursedAmount: disbursementAmount,
      commission,
      referenceId: result.referenceId,
    };
  },
});
