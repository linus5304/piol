"use node";

import { v } from 'convex/values';
import { action } from '../_generated/server';

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
  const credentials = Buffer.from(
    `${process.env.MTN_MOMO_API_USER}:${process.env.MTN_MOMO_API_KEY}`
  ).toString('base64');

  const response = await fetch(`${MTN_MOMO_BASE_URL}/collection/token/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get MoMo token: ${response.statusText}`);
  }

  const data: MoMoTokenResponse = await response.json();
  return data.access_token;
}

// Request payment from user (Collection)
export const requestPayment = action({
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

    const response = await fetch(`${MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT ?? 'sandbox',
        'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok && response.status !== 202) {
      const error = await response.text();
      throw new Error(`Payment request failed: ${error}`);
    }

    // Update transaction with MoMo reference
    await ctx.runMutation(
      { name: 'transactions:updateMoMoReference' },
      {
        transactionId: args.transactionId,
        mobileMoneyReference: referenceId,
      }
    );

    return {
      success: true,
      referenceId,
      message: 'Payment request sent. User will receive a prompt on their phone.',
    };
  },
});

// Check payment status
export const checkPaymentStatus = action({
  args: {
    referenceId: v.string(),
  },
  handler: async (ctx, args) => {
    const token = await getMoMoToken();

    const response = await fetch(
      `${MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay/${args.referenceId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT ?? 'sandbox',
          'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
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

// Disburse payment to landlord
export const disburseFunds = action({
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
        'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
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

// Validate phone number (check if account exists)
export const validateAccount = action({
  args: {
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const token = await getMoMoToken();

    const response = await fetch(
      `${MTN_MOMO_BASE_URL}/collection/v1_0/accountholder/msisdn/${args.phoneNumber}/basicuserinfo`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT ?? 'sandbox',
          'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
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
