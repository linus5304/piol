'use node';
// @ts-nocheck - Uses deprecated { name: '...' } syntax, needs migration to api/internal references

import { v } from 'convex/values';
import { action } from '../_generated/server';

// Orange Money API Configuration
const ORANGE_MONEY_BASE_URL =
  process.env.ORANGE_MONEY_ENVIRONMENT === 'production'
    ? 'https://api.orange.com'
    : 'https://api.orange.com/orange-money-webpay/cm/v1';

interface OrangeMoneyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface OrangeMoneyPaymentRequest {
  merchant_key: string;
  currency: string;
  order_id: string;
  amount: number;
  return_url: string;
  cancel_url: string;
  notif_url: string;
  lang: string;
  reference: string;
}

interface OrangeMoneyPaymentResponse {
  status: number;
  message: string;
  payment_url?: string;
  pay_token?: string;
  notif_token?: string;
}

// Get OAuth token for Orange Money API
async function getOrangeToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.ORANGE_MONEY_CLIENT_ID}:${process.env.ORANGE_MONEY_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://api.orange.com/oauth/v3/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Orange token: ${response.statusText}`);
  }

  const data: OrangeMoneyTokenResponse = await response.json();
  return data.access_token;
}

// Initialize web payment (returns payment URL for redirect)
export const initializeWebPayment = action({
  args: {
    amount: v.number(),
    currency: v.optional(v.string()),
    transactionId: v.id('transactions'),
    returnUrl: v.string(),
    cancelUrl: v.string(),
    notifyUrl: v.string(),
    language: v.optional(v.union(v.literal('fr'), v.literal('en'))),
  },
  handler: async (ctx, args) => {
    const token = await getOrangeToken();
    const orderId = `PIOL-${Date.now()}-${args.transactionId}`;

    const merchantKey = process.env.ORANGE_MONEY_MERCHANT_KEY;
    if (!merchantKey) {
      throw new Error('ORANGE_MONEY_MERCHANT_KEY not configured');
    }

    const payload: OrangeMoneyPaymentRequest = {
      merchant_key: merchantKey,
      currency: args.currency ?? 'XAF',
      order_id: orderId,
      amount: args.amount,
      return_url: args.returnUrl,
      cancel_url: args.cancelUrl,
      notif_url: args.notifyUrl,
      lang: args.language ?? 'fr',
      reference: args.transactionId,
    };

    const response = await fetch(`${ORANGE_MONEY_BASE_URL}/webpayment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Orange Money payment init failed: ${error}`);
    }

    const data: OrangeMoneyPaymentResponse = await response.json();

    if (data.status !== 201) {
      throw new Error(`Payment initialization failed: ${data.message}`);
    }

    // Store payment token for later verification
    await ctx.runMutation(
      { name: 'transactions:updateMoMoReference' },
      {
        transactionId: args.transactionId,
        mobileMoneyReference: data.pay_token!,
      }
    );

    return {
      success: true,
      paymentUrl: data.payment_url,
      payToken: data.pay_token,
      orderId,
    };
  },
});

// Check payment status using pay_token
export const checkPaymentStatus = action({
  args: {
    payToken: v.string(),
    orderId: v.string(),
  },
  handler: async (ctx, args) => {
    const token = await getOrangeToken();

    const response = await fetch(`${ORANGE_MONEY_BASE_URL}/webpayment/${args.orderId}/status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check payment status: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      status: data.status,
      transactionId: data.txnid,
      message: data.message,
    };
  },
});

// Handle payment notification (webhook)
export const handlePaymentNotification = action({
  args: {
    notifToken: v.string(),
    status: v.string(),
    orderId: v.string(),
    txnId: v.optional(v.string()),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verify the notification token
    // In production, you should verify this against stored tokens

    // Find transaction by order ID
    const transactionId = args.orderId.split('-').pop();

    if (!transactionId) {
      throw new Error('Invalid order ID format');
    }

    // Update transaction status based on payment result
    const paymentStatus = args.status === 'SUCCESS' ? 'completed' : 'failed';

    await ctx.runMutation(
      { name: 'transactions:updateTransactionStatus' },
      {
        id: transactionId as any,
        paymentStatus,
        completedAt: args.status === 'SUCCESS' ? Date.now() : undefined,
      }
    );

    // If payment successful, notify landlord and potentially release escrow
    if (args.status === 'SUCCESS') {
      // Create notification for landlord
      const transaction = await ctx.runQuery(
        { name: 'transactions:getTransaction' },
        {
          id: transactionId as any,
        }
      );

      if (transaction) {
        await ctx.runMutation(
          { name: 'notifications:createNotification' },
          {
            userId: transaction.landlordId,
            notificationType: 'payment_received',
            title: 'Paiement reçu',
            message: `Un paiement de ${args.amount ?? 0} FCFA a été reçu.`,
            data: { transactionId, amount: args.amount },
          }
        );
      }
    }

    return {
      success: true,
      processed: true,
    };
  },
});
