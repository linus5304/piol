import { convexTest } from 'convex-test';
import { describe, expect, it } from 'vitest';
import schema from '../schema';

const modules = {
  '../_generated/api.ts': async () => ({ api: {}, internal: {} }),
  '../_generated/server.ts': async () => ({}),
  '../_generated/dataModel.ts': async () => ({}),
};

function createTestContext() {
  return convexTest(schema, modules);
}

const baseUser = {
  languagePreference: 'fr' as const,
  emailVerified: true,
  phoneVerified: false,
  idVerified: false,
  isActive: true,
  onboardingCompleted: true,
  lastLogin: Date.now(),
};

describe('transactions', () => {
  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const t = createTestContext();

      const renterId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_renter',
          email: 'renter@example.com',
          role: 'renter',
          phone: '237699111111',
          ...baseUser,
        });
      });

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord',
          email: 'landlord@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Test Property',
          propertyType: 'studio',
          rentAmount: 50000,
          currency: 'XAF',
          cautionMonths: 2,
          upfrontMonths: 6,
          city: 'Yaoundé',
          status: 'active',
          verificationStatus: 'approved',
        });
      });

      const transactionId = await t.run(async (ctx) => {
        return await ctx.db.insert('transactions', {
          propertyId,
          renterId,
          landlordId,
          transactionType: 'rent_payment',
          amount: 50000,
          currency: 'XAF',
          paymentMethod: 'mtn_momo',
          paymentStatus: 'pending',
          transactionReference: 'TXN-123456',
          payerPhone: '237699111111',
        });
      });

      expect(transactionId).toBeDefined();

      const transaction = await t.run(async (ctx) => {
        return await ctx.db.get(transactionId);
      });

      expect(transaction?.amount).toBe(50000);
      expect(transaction?.paymentStatus).toBe('pending');
      expect(transaction?.paymentMethod).toBe('mtn_momo');
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update transaction status to completed', async () => {
      const t = createTestContext();

      const renterId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_renter_status',
          email: 'renter_status@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_status',
          email: 'landlord_status@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Status Test Property',
          propertyType: 'studio',
          rentAmount: 50000,
          currency: 'XAF',
          cautionMonths: 2,
          upfrontMonths: 6,
          city: 'Yaoundé',
          status: 'active',
          verificationStatus: 'approved',
        });
      });

      const transactionId = await t.run(async (ctx) => {
        return await ctx.db.insert('transactions', {
          propertyId,
          renterId,
          landlordId,
          transactionType: 'rent_payment',
          amount: 50000,
          currency: 'XAF',
          paymentMethod: 'mtn_momo',
          paymentStatus: 'processing',
          transactionReference: 'TXN-STATUS-123',
        });
      });

      // Update status to completed
      await t.run(async (ctx) => {
        await ctx.db.patch(transactionId, {
          paymentStatus: 'completed',
          escrowStatus: 'held',
          completedAt: Date.now(),
          mobileMoneyReference: 'MOMO-REF-123',
        });
      });

      const transaction = await t.run(async (ctx) => {
        return await ctx.db.get(transactionId);
      });

      expect(transaction?.paymentStatus).toBe('completed');
      expect(transaction?.escrowStatus).toBe('held');
      expect(transaction?.completedAt).toBeDefined();
    });
  });

  describe('getMyTransactions', () => {
    it('should return transactions for renter', async () => {
      const t = createTestContext();

      const renterId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_renter_my',
          email: 'renter_my@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_my',
          email: 'landlord_my@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'My Transactions Property',
          propertyType: 'studio',
          rentAmount: 50000,
          currency: 'XAF',
          cautionMonths: 2,
          upfrontMonths: 6,
          city: 'Yaoundé',
          status: 'active',
          verificationStatus: 'approved',
        });
      });

      await t.run(async (ctx) => {
        await ctx.db.insert('transactions', {
          propertyId,
          renterId,
          landlordId,
          transactionType: 'rent_payment',
          amount: 50000,
          currency: 'XAF',
          paymentMethod: 'mtn_momo',
          paymentStatus: 'completed',
          transactionReference: 'TXN-MY-1',
        });
        await ctx.db.insert('transactions', {
          propertyId,
          renterId,
          landlordId,
          transactionType: 'deposit',
          amount: 100000,
          currency: 'XAF',
          paymentMethod: 'orange_money',
          paymentStatus: 'pending',
          transactionReference: 'TXN-MY-2',
        });
      });

      const transactions = await t.withIdentity({ subject: 'clerk_renter_my' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user) return [];

        return await ctx.db
          .query('transactions')
          .withIndex('by_renter', (q) => q.eq('renterId', user._id))
          .collect();
      });

      expect(transactions.length).toBe(2);
    });
  });

  describe('releaseEscrow', () => {
    it('should release escrow and update status', async () => {
      const t = createTestContext();

      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_admin_escrow',
          email: 'admin_escrow@example.com',
          role: 'admin',
          ...baseUser,
        });
      });

      const renterId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_renter_escrow',
          email: 'renter_escrow@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_escrow',
          email: 'landlord_escrow@example.com',
          role: 'landlord',
          phone: '237699222222',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Escrow Test Property',
          propertyType: 'studio',
          rentAmount: 50000,
          currency: 'XAF',
          cautionMonths: 2,
          upfrontMonths: 6,
          city: 'Yaoundé',
          status: 'active',
          verificationStatus: 'approved',
        });
      });

      const transactionId = await t.run(async (ctx) => {
        return await ctx.db.insert('transactions', {
          propertyId,
          renterId,
          landlordId,
          transactionType: 'rent_payment',
          amount: 50000,
          currency: 'XAF',
          paymentMethod: 'mtn_momo',
          paymentStatus: 'completed',
          escrowStatus: 'held',
          transactionReference: 'TXN-ESCROW-1',
        });
      });

      // Release escrow as admin
      await t.withIdentity({ subject: 'clerk_admin_escrow' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user || user.role !== 'admin') {
          throw new Error('Unauthorized');
        }

        const transaction = await ctx.db.get(transactionId);
        if (!transaction || transaction.escrowStatus !== 'held') {
          throw new Error('Invalid transaction state');
        }

        await ctx.db.patch(transactionId, {
          escrowStatus: 'released',
        });
      });

      const transaction = await t.run(async (ctx) => {
        return await ctx.db.get(transactionId);
      });

      expect(transaction?.escrowStatus).toBe('released');
    });
  });

  describe('Database indexes', () => {
    it('should query by transaction reference', async () => {
      const t = createTestContext();

      const renterId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_renter_ref',
          email: 'renter_ref@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_ref',
          email: 'landlord_ref@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Ref Test Property',
          propertyType: 'studio',
          rentAmount: 50000,
          currency: 'XAF',
          cautionMonths: 2,
          upfrontMonths: 6,
          city: 'Yaoundé',
          status: 'active',
          verificationStatus: 'approved',
        });
      });

      await t.run(async (ctx) => {
        await ctx.db.insert('transactions', {
          propertyId,
          renterId,
          landlordId,
          transactionType: 'rent_payment',
          amount: 50000,
          currency: 'XAF',
          paymentMethod: 'mtn_momo',
          paymentStatus: 'pending',
          transactionReference: 'TXN-UNIQUE-REF-123',
        });
      });

      const transaction = await t.run(async (ctx) => {
        return await ctx.db
          .query('transactions')
          .withIndex('by_reference', (q) => q.eq('transactionReference', 'TXN-UNIQUE-REF-123'))
          .unique();
      });

      expect(transaction).not.toBeNull();
      expect(transaction?.transactionReference).toBe('TXN-UNIQUE-REF-123');
    });
  });
});
