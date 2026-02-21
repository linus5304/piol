'use node';

import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { action, internalAction } from '../_generated/server';

// Internal: Main payment processing action that routes to appropriate provider
export const internalProcessPayment = internalAction({
  args: {
    transactionId: v.id('transactions'),
    amount: v.number(),
    currency: v.optional(v.string()),
    phoneNumber: v.string(),
    paymentMethod: v.union(v.literal('mtn_momo'), v.literal('orange_money')),
    returnUrl: v.optional(v.string()), // For Orange Money web payments
    cancelUrl: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    method: string;
    referenceId?: string;
    message?: string;
    paymentUrl?: string;
    payToken?: string;
    orderId?: string;
    requiresRedirect: boolean;
  }> => {
    const transaction = await ctx.runQuery(internal.transactions.internalGetTransaction, {
      transactionId: args.transactionId,
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Update transaction to processing status
    await ctx.runMutation(internal.transactions.internalUpdateStatus, {
      transactionId: args.transactionId,
      paymentStatus: 'processing',
    });

    try {
      if (args.paymentMethod === 'mtn_momo') {
        // MTN MoMo - Direct USSD prompt
        const result = await ctx.runAction(internal.actions.mtnMomo.requestPayment, {
          amount: args.amount,
          currency: args.currency,
          phoneNumber: args.phoneNumber,
          transactionId: args.transactionId,
          payerMessage: `Piol - Paiement réf: ${transaction.transactionReference}`,
        });

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
        const result = await ctx.runAction(internal.actions.orangeMoney.initializeWebPayment, {
          amount: args.amount,
          currency: args.currency,
          transactionId: args.transactionId,
          returnUrl: args.returnUrl,
          cancelUrl: args.cancelUrl,
          notifyUrl: `${process.env.CONVEX_SITE_URL}/orange-money-webhook`,
        });

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
      await ctx.runMutation(internal.transactions.internalUpdateStatus, {
        transactionId: args.transactionId,
        paymentStatus: 'failed',
      });

      throw error;
    }
  },
});

// Public: Authorized wrapper for processPayment
export const processPayment = action({
  args: {
    transactionId: v.id('transactions'),
    amount: v.number(),
    currency: v.optional(v.string()),
    phoneNumber: v.string(),
    paymentMethod: v.union(v.literal('mtn_momo'), v.literal('orange_money')),
    returnUrl: v.optional(v.string()),
    cancelUrl: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    method: string;
    referenceId?: string;
    message?: string;
    paymentUrl?: string;
    payToken?: string;
    orderId?: string;
    requiresRedirect: boolean;
  }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.runQuery(internal.transactions.internalGetUserByClerkId, {
      clerkId: identity.subject,
    });
    if (!user) {
      throw new Error('User not found');
    }

    const transaction = await ctx.runQuery(internal.transactions.internalGetTransaction, {
      transactionId: args.transactionId,
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Verify the authenticated user is the renter on the transaction
    if (user._id !== transaction.renterId) {
      throw new Error('Unauthorized: only the renter can process payment');
    }

    return await ctx.runAction(internal.actions.payments.internalProcessPayment, { ...args });
  },
});

// Internal: Poll payment status and update transaction
export const internalCheckPaymentStatus = internalAction({
  args: {
    transactionId: v.id('transactions'),
    paymentMethod: v.union(v.literal('mtn_momo'), v.literal('orange_money')),
    referenceId: v.string(),
    orderId: v.optional(v.string()), // For Orange Money
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
    paymentStatus: string;
    financialTransactionId: string | undefined;
  }> => {
    let status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
    let financialTransactionId: string | undefined;

    if (args.paymentMethod === 'mtn_momo') {
      const result = await ctx.runAction(internal.actions.mtnMomo.checkPaymentStatus, {
        referenceId: args.referenceId,
      });
      status = result.status;
      financialTransactionId = result.financialTransactionId;
    } else {
      const result = await ctx.runAction(internal.actions.orangeMoney.checkPaymentStatus, {
        payToken: args.referenceId,
        orderId: args.orderId!,
      });
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

    await ctx.runMutation(internal.transactions.internalUpdateStatus, {
      transactionId: args.transactionId,
      paymentStatus,
      externalId: financialTransactionId,
      callbackReceived: true,
    });

    return {
      status,
      paymentStatus,
      financialTransactionId,
    };
  },
});

// Public: Authorized wrapper for checkPaymentStatus
export const checkPaymentStatus = action({
  args: {
    transactionId: v.id('transactions'),
    paymentMethod: v.union(v.literal('mtn_momo'), v.literal('orange_money')),
    referenceId: v.string(),
    orderId: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
    paymentStatus: string;
    financialTransactionId: string | undefined;
  }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.runQuery(internal.transactions.internalGetUserByClerkId, {
      clerkId: identity.subject,
    });
    if (!user) {
      throw new Error('User not found');
    }

    const transaction = await ctx.runQuery(internal.transactions.internalGetTransaction, {
      transactionId: args.transactionId,
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Verify the authenticated user is either the renter or landlord
    if (user._id !== transaction.renterId && user._id !== transaction.landlordId) {
      throw new Error('Unauthorized: only transaction parties can check status');
    }

    return await ctx.runAction(internal.actions.payments.internalCheckPaymentStatus, { ...args });
  },
});

// Internal: Release escrow funds to landlord
export const internalReleaseEscrowFunds = internalAction({
  args: {
    transactionId: v.id('transactions'),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    disbursedAmount: number;
    commission: number;
    referenceId: string;
  }> => {
    const transaction = await ctx.runQuery(internal.transactions.internalGetTransaction, {
      transactionId: args.transactionId,
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.escrowStatus !== 'held') {
      throw new Error('Funds are not in escrow');
    }

    if (!transaction.landlord?.phone) {
      throw new Error('Landlord phone number not found');
    }

    // Deduct platform commission (5%)
    const commissionRate = 0.05;
    const commission = Math.round(transaction.amount * commissionRate);
    const disbursementAmount = transaction.amount - commission;

    // Disburse funds via MTN MoMo
    const result = await ctx.runAction(internal.actions.mtnMomo.disburseFunds, {
      amount: disbursementAmount,
      phoneNumber: transaction.landlord.phone,
      transactionId: args.transactionId,
      payeeNote: `Piol - Versement loyer (réf: ${transaction.transactionReference})`,
    });

    // Update escrow status
    await ctx.runMutation(internal.transactions.internalUpdateStatus, {
      transactionId: args.transactionId,
      paymentStatus: 'completed',
      escrowStatus: 'released',
    });

    return {
      success: true,
      disbursedAmount: disbursementAmount,
      commission,
      referenceId: result.referenceId,
    };
  },
});

// Public: Authorized wrapper for releaseEscrowFunds (admin only)
export const releaseEscrowFunds = action({
  args: {
    transactionId: v.id('transactions'),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    disbursedAmount: number;
    commission: number;
    referenceId: string;
  }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.runQuery(internal.transactions.internalGetUserByClerkId, {
      clerkId: identity.subject,
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Verify user has admin role
    if (user.role !== 'admin') {
      throw new Error('Unauthorized: only admins can release escrow funds');
    }

    return await ctx.runAction(internal.actions.payments.internalReleaseEscrowFunds, { ...args });
  },
});
