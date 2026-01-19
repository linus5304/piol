'use node';

import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { internalAction } from '../_generated/server';

// MTN MoMo API Configuration
const MTN_MOMO_BASE_URL =
  process.env.MTN_MOMO_ENVIRONMENT === 'production'
    ? 'https://proxy.momoapi.mtn.com'
    : 'https://sandbox.momodeveloper.mtn.com';

interface MoMoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface MoMoPaymentRequest {
  amount: string;
  currency: string;
  externalId: string;
  payer: {
    partyIdType: 'MSISDN';
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
}

interface MoMoPaymentStatus {
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  reason?: string;
  financialTransactionId?: string;
}

// Get OAuth token for MTN MoMo API
async function getMoMoToken(): Promise<string> {
  const apiUser = process.env.MTN_MOMO_API_USER;
  const apiKey = process.env.MTN_MOMO_API_KEY;
  const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY;

  if (!apiUser || !apiKey || !subscriptionKey) {
    throw new Error('MTN MoMo credentials not configured');
  }

  const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString('base64');

  const response = await fetch(`${MTN_MOMO_BASE_URL}/collection/token/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get MoMo token: ${response.statusText}`);
  }

  const data: MoMoTokenResponse = await response.json();
  return data.access_token;
}

// Request payment from user (Collection) - Internal action
export const requestPayment = internalAction({
  args: {
    amount: v.number(),
    currency: v.optional(v.string()),
    phoneNumber: v.string(), // Format: 237XXXXXXXXX
    transactionId: v.id('transactions'),
    payerMessage: v.optional(v.string()),
    payeeNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const token = await getMoMoToken();
    const referenceId = crypto.randomUUID();

    const payload: MoMoPaymentRequest = {
      amount: args.amount.toString(),
      currency: args.currency ?? 'XAF',
      externalId: args.transactionId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: args.phoneNumber,
      },
      payerMessage: args.payerMessage ?? 'Piol - Paiement de loyer',
      payeeNote: args.payeeNote ?? 'Paiement via Piol',
    };

    const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY!;

    const response = await fetch(`${MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT ?? 'sandbox',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok && response.status !== 202) {
      const error = await response.text();
      throw new Error(`Payment request failed: ${error}`);
    }

    // Update transaction with MoMo reference
    await ctx.runMutation(internal.transactions.updateMoMoReference, {
      transactionId: args.transactionId,
      mobileMoneyReference: referenceId,
    });

    return {
      success: true,
      referenceId,
      message: 'Payment request sent. User will receive a prompt on their phone.',
    };
  },
});

// Check payment status - Internal action
export const checkPaymentStatus = internalAction({
  args: {
    referenceId: v.string(),
  },
  handler: async (ctx, args) => {
    const token = await getMoMoToken();
    const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY!;

    const response = await fetch(
      `${MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay/${args.referenceId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT ?? 'sandbox',
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to check payment status: ${response.statusText}`);
    }

    const data: MoMoPaymentStatus = await response.json();

    return {
      status: data.status,
      reason: data.reason,
      financialTransactionId: data.financialTransactionId,
    };
  },
});

// Disburse payment to landlord - Internal action
export const disburseFunds = internalAction({
  args: {
    amount: v.number(),
    currency: v.optional(v.string()),
    phoneNumber: v.string(),
    transactionId: v.id('transactions'),
    payerMessage: v.optional(v.string()),
    payeeNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const token = await getMoMoToken();
    const referenceId = crypto.randomUUID();
    const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY!;

    const payload = {
      amount: args.amount.toString(),
      currency: args.currency ?? 'XAF',
      externalId: args.transactionId,
      payee: {
        partyIdType: 'MSISDN',
        partyId: args.phoneNumber,
      },
      payerMessage: args.payerMessage ?? 'Piol - Versement de loyer',
      payeeNote: args.payeeNote ?? 'Versement depuis Piol',
    };

    // Note: Disbursement uses a different API endpoint and may require separate credentials
    const response = await fetch(`${MTN_MOMO_BASE_URL}/disbursement/v1_0/transfer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT ?? 'sandbox',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok && response.status !== 202) {
      const error = await response.text();
      throw new Error(`Disbursement failed: ${error}`);
    }

    return {
      success: true,
      referenceId,
      message: 'Funds disbursement initiated.',
    };
  },
});

// Validate phone number (check if account exists) - Internal action
export const validateAccount = internalAction({
  args: {
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const token = await getMoMoToken();
    const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY!;

    const response = await fetch(
      `${MTN_MOMO_BASE_URL}/collection/v1_0/accountholder/msisdn/${args.phoneNumber}/basicuserinfo`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT ?? 'sandbox',
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
      }
    );

    if (!response.ok) {
      return {
        valid: false,
        message: 'Account not found or inactive',
      };
    }

    const data = await response.json();

    return {
      valid: true,
      name: data.name,
    };
  },
});
