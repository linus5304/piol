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

describe('messages', () => {
  describe('sendMessage', () => {
    it('should create a new message', async () => {
      const t = createTestContext();

      const senderId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_sender',
          email: 'sender@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const recipientId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_recipient',
          email: 'recipient@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const conversationId = `${senderId}_${recipientId}`;

      const messageId = await t.run(async (ctx) => {
        return await ctx.db.insert('messages', {
          conversationId,
          senderId,
          recipientId,
          messageText: 'Bonjour, je suis intéressé par votre appartement.',
          isRead: false,
        });
      });

      expect(messageId).toBeDefined();

      const message = await t.run(async (ctx) => {
        return await ctx.db.get(messageId);
      });

      expect(message?.messageText).toBe('Bonjour, je suis intéressé par votre appartement.');
      expect(message?.isRead).toBe(false);
    });
  });

  describe('getMessages', () => {
    it('should return messages for a conversation', async () => {
      const t = createTestContext();

      const user1Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_user1',
          email: 'user1@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const user2Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_user2',
          email: 'user2@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const conversationId = `conv_${user1Id}_${user2Id}`;

      await t.run(async (ctx) => {
        await ctx.db.insert('messages', {
          conversationId,
          senderId: user1Id,
          recipientId: user2Id,
          messageText: 'Message 1',
          isRead: false,
        });
        await ctx.db.insert('messages', {
          conversationId,
          senderId: user2Id,
          recipientId: user1Id,
          messageText: 'Message 2',
          isRead: false,
        });
        await ctx.db.insert('messages', {
          conversationId,
          senderId: user1Id,
          recipientId: user2Id,
          messageText: 'Message 3',
          isRead: false,
        });
      });

      const messages = await t.run(async (ctx) => {
        return await ctx.db
          .query('messages')
          .withIndex('by_conversation', (q) => q.eq('conversationId', conversationId))
          .collect();
      });

      expect(messages.length).toBe(3);
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark messages as read', async () => {
      const t = createTestContext();

      const senderId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_sender_read',
          email: 'sender_read@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const recipientId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_recipient_read',
          email: 'recipient_read@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const conversationId = `conv_read_${senderId}_${recipientId}`;

      const messageId = await t.run(async (ctx) => {
        return await ctx.db.insert('messages', {
          conversationId,
          senderId,
          recipientId,
          messageText: 'Unread message',
          isRead: false,
        });
      });

      // Mark as read
      await t.withIdentity({ subject: 'clerk_recipient_read' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user) throw new Error('User not found');

        const messages = await ctx.db
          .query('messages')
          .withIndex('by_conversation', (q) => q.eq('conversationId', conversationId))
          .filter((q) =>
            q.and(q.eq(q.field('recipientId'), user._id), q.eq(q.field('isRead'), false))
          )
          .collect();

        for (const msg of messages) {
          await ctx.db.patch(msg._id, { isRead: true });
        }
      });

      const message = await t.run(async (ctx) => {
        return await ctx.db.get(messageId);
      });

      expect(message?.isRead).toBe(true);
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of unread messages', async () => {
      const t = createTestContext();

      const senderId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_sender_count',
          email: 'sender_count@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const recipientId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_recipient_count',
          email: 'recipient_count@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const conversationId = `conv_count_${senderId}_${recipientId}`;

      await t.run(async (ctx) => {
        await ctx.db.insert('messages', {
          conversationId,
          senderId,
          recipientId,
          messageText: 'Unread 1',
          isRead: false,
        });
        await ctx.db.insert('messages', {
          conversationId,
          senderId,
          recipientId,
          messageText: 'Unread 2',
          isRead: false,
        });
        await ctx.db.insert('messages', {
          conversationId,
          senderId,
          recipientId,
          messageText: 'Read message',
          isRead: true,
        });
      });

      const unreadCount = await t
        .withIdentity({ subject: 'clerk_recipient_count' })
        .run(async (ctx) => {
          const identity = await ctx.auth.getUserIdentity();
          if (!identity) return 0;

          const user = await ctx.db
            .query('users')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
            .unique();

          if (!user) return 0;

          const unread = await ctx.db
            .query('messages')
            .withIndex('by_recipient', (q) => q.eq('recipientId', user._id))
            .filter((q) => q.eq(q.field('isRead'), false))
            .collect();

          return unread.length;
        });

      expect(unreadCount).toBe(2);
    });
  });
});
