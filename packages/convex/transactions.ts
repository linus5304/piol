import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Generate unique transaction reference
function generateTransactionReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN-${timestamp}-${random}`.toUpperCase();
}

// Get user's transactions
export const getMyTransactions = query({
  args: {
    role: v.optional(v.union(v.literal('renter'), v.literal('landlord'))),
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('processing'),
        v.literal('completed'),
        v.literal('failed'),
        v.literal('refunded')
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    const limit = args.limit ?? 50;

    // Get transactions based on role
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let transactions: any[];
    if (args.role === 'landlord' || (!args.role && user.role === 'landlord')) {
      transactions = await ctx.db
        .query('transactions')
        .withIndex('by_landlord', (q) => q.eq('landlordId', user._id))
        .collect();
    } else {
      transactions = await ctx.db
        .query('transactions')
        .withIndex('by_renter', (q) => q.eq('renterId', user._id))
        .collect();
    }

    // Filter by status if provided
    if (args.status) {
      transactions = transactions.filter((t) => t.paymentStatus === args.status);
    }

    // Sort by creation time (newest first)
    transactions.sort((a, b) => b._creationTime - a._creationTime);

    // Limit results
    transactions = transactions.slice(0, limit);

    // Enrich with property info
    const enrichedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const property = (await ctx.db.get(transaction.propertyId)) as any;
        const otherUserId =
          user.role === 'landlord' ? transaction.renterId : transaction.landlordId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const otherUser = (await ctx.db.get(otherUserId)) as any;

        return {
          ...transaction,
          property: property
            ? {
                _id: property._id,
                title: property.title,
                city: property.city,
              }
            : null,
          otherParty: otherUser
            ? {
                _id: otherUser._id,
                firstName: otherUser.firstName,
                lastName: otherUser.lastName,
              }
            : null,
        };
      })
    );

    return enrichedTransactions;
  },
});

// Get transaction by ID
export const getTransaction = query({
  args: { transactionId: v.id('transactions') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      return null;
    }

    // Check authorization
    if (
      transaction.renterId !== user._id &&
      transaction.landlordId !== user._id &&
      user.role !== 'admin'
    ) {
      return null;
    }

    const property = await ctx.db.get(transaction.propertyId);
    const renter = await ctx.db.get(transaction.renterId);
    const landlord = await ctx.db.get(transaction.landlordId);

    return {
      ...transaction,
      property: property
        ? {
            _id: property._id,
            title: property.title,
            city: property.city,
            neighborhood: property.neighborhood,
          }
        : null,
      renter: renter
        ? {
            _id: renter._id,
            firstName: renter.firstName,
            lastName: renter.lastName,
            phone: renter.phone,
          }
        : null,
      landlord: landlord
        ? {
            _id: landlord._id,
            firstName: landlord.firstName,
            lastName: landlord.lastName,
            phone: landlord.phone,
          }
        : null,
    };
  },
});

// Get transaction by reference (for payment callbacks)
export const getTransactionByReference = query({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    const transaction = await ctx.db
      .query('transactions')
      .withIndex('by_reference', (q) => q.eq('transactionReference', args.reference))
      .unique();

    return transaction;
  },
});

// Create a new transaction (initiate payment)
export const createTransaction = mutation({
  args: {
    propertyId: v.id('properties'),
    landlordId: v.id('users'),
    transactionType: v.union(
      v.literal('rent_payment'),
      v.literal('deposit'),
      v.literal('commission')
    ),
    amount: v.number(),
    paymentMethod: v.union(
      v.literal('mtn_momo'),
      v.literal('orange_money'),
      v.literal('bank_transfer'),
      v.literal('cash')
    ),
    payerPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    // Verify property exists
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // Generate unique reference
    const transactionReference = generateTransactionReference();

    const transactionId = await ctx.db.insert('transactions', {
      propertyId: args.propertyId,
      renterId: user._id,
      landlordId: args.landlordId,
      transactionType: args.transactionType,
      amount: args.amount,
      currency: 'XAF',
      paymentMethod: args.paymentMethod,
      paymentStatus: 'pending',
      transactionReference,
      payerPhone: args.payerPhone ?? user.phone,
    });

    return {
      transactionId,
      transactionReference,
    };
  },
});

// Update transaction status (internal use, called by payment actions)
export const updateTransactionStatus = mutation({
  args: {
    transactionId: v.id('transactions'),
    paymentStatus: v.union(
      v.literal('pending'),
      v.literal('processing'),
      v.literal('completed'),
      v.literal('failed'),
      v.literal('refunded')
    ),
    mobileMoneyReference: v.optional(v.string()),
    externalId: v.optional(v.string()),
    callbackReceived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const updates: Record<string, unknown> = {
      paymentStatus: args.paymentStatus,
    };

    if (args.mobileMoneyReference) {
      updates.mobileMoneyReference = args.mobileMoneyReference;
    }
    if (args.externalId) {
      updates.externalId = args.externalId;
    }
    if (args.callbackReceived !== undefined) {
      updates.callbackReceived = args.callbackReceived;
    }

    if (args.paymentStatus === 'completed') {
      updates.completedAt = Date.now();
      updates.escrowStatus = 'held';
    }

    await ctx.db.patch(args.transactionId, updates);

    // Create notification for relevant parties
    if (args.paymentStatus === 'completed') {
      // Notify landlord
      await ctx.db.insert('notifications', {
        userId: transaction.landlordId,
        notificationType: 'payment_received',
        title: 'Payment Received',
        message: `Payment of ${transaction.amount} XAF has been received`,
        data: { transactionId: args.transactionId },
        isRead: false,
      });
    } else if (args.paymentStatus === 'failed') {
      // Notify renter
      await ctx.db.insert('notifications', {
        userId: transaction.renterId,
        notificationType: 'payment_failed',
        title: 'Payment Failed',
        message: 'Your payment could not be processed. Please try again.',
        data: { transactionId: args.transactionId },
        isRead: false,
      });
    }

    return args.transactionId;
  },
});

// Release escrow (admin/landlord confirms move-in)
export const releaseEscrow = mutation({
  args: {
    transactionId: v.id('transactions'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Check authorization (landlord or admin can release)
    if (transaction.landlordId !== user._id && user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    if (transaction.escrowStatus !== 'held') {
      throw new Error('Escrow is not in held status');
    }

    await ctx.db.patch(args.transactionId, {
      escrowStatus: 'released',
    });

    // Notify renter
    await ctx.db.insert('notifications', {
      userId: transaction.renterId,
      notificationType: 'escrow_released',
      title: 'Escrow Released',
      message: 'The landlord has confirmed your move-in. Funds have been released.',
      data: { transactionId: args.transactionId },
      isRead: false,
    });

    return args.transactionId;
  },
});

// Request refund
export const requestRefund = mutation({
  args: {
    transactionId: v.id('transactions'),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Only renter can request refund
    if (transaction.renterId !== user._id) {
      throw new Error('Unauthorized');
    }

    if (transaction.escrowStatus !== 'held') {
      throw new Error('Cannot request refund - escrow is not held');
    }

    // Create notification for admin
    const admins = await ctx.db
      .query('users')
      .withIndex('by_role', (q) => q.eq('role', 'admin'))
      .collect();

    await Promise.all(
      admins.map((admin) =>
        ctx.db.insert('notifications', {
          userId: admin._id,
          notificationType: 'refund_request',
          title: 'Refund Request',
          message: `Refund request for transaction ${transaction.transactionReference}`,
          data: { transactionId: args.transactionId, reason: args.reason },
          isRead: false,
        })
      )
    );

    return args.transactionId;
  },
});

// Get transaction statistics (admin only)
export const getTransactionStats = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user || user.role !== 'admin') {
      return null;
    }

    const allTransactions = await ctx.db.query('transactions').collect();

    // Filter by date if provided
    let transactions = allTransactions;
    if (args.startDate) {
      transactions = transactions.filter((t) => t._creationTime >= args.startDate!);
    }
    if (args.endDate) {
      transactions = transactions.filter((t) => t._creationTime <= args.endDate!);
    }

    const completed = transactions.filter((t) => t.paymentStatus === 'completed');
    const totalVolume = completed.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTransactions: transactions.length,
      completedTransactions: completed.length,
      pendingTransactions: transactions.filter((t) => t.paymentStatus === 'pending').length,
      failedTransactions: transactions.filter((t) => t.paymentStatus === 'failed').length,
      totalVolume,
      averageTransaction: completed.length > 0 ? totalVolume / completed.length : 0,
      byPaymentMethod: {
        mtn_momo: completed.filter((t) => t.paymentMethod === 'mtn_momo').length,
        orange_money: completed.filter((t) => t.paymentMethod === 'orange_money').length,
        bank_transfer: completed.filter((t) => t.paymentMethod === 'bank_transfer').length,
        cash: completed.filter((t) => t.paymentMethod === 'cash').length,
      },
    };
  },
});
