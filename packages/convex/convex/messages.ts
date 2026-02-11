import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUser, getCurrentUserOrNull } from './utils/auth';

// Get all conversations for current user
export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const result = await getCurrentUserOrNull(ctx);
    if (!result) {
      return [];
    }

    const { user } = result;

    // Use the conversations table which stores lastMessagePreview and lastMessageAt.
    // Filter to conversations that include the current user.
    const allConversations = await ctx.db
      .query('conversations')
      .withIndex('by_last_message')
      .order('desc')
      .collect();

    const userConversations = allConversations.filter((c) => c.participantIds.includes(user._id));

    // Deduplicate DB lookups for users and properties
    const userIds = new Set<string>();
    const propertyIds = new Set<string>();
    for (const c of userConversations) {
      const otherId = c.participantIds.find((id) => id !== user._id);
      if (otherId) userIds.add(otherId.toString());
      if (c.propertyId) propertyIds.add(c.propertyId.toString());
    }

    // Batch-fetch users and properties (1 read per unique ID, not per conversation)
    const userCache = new Map();
    for (const uid of userIds) {
      const u = await ctx.db.get(uid as any);
      if (u) userCache.set(uid, u);
    }
    const propertyCache = new Map();
    for (const pid of propertyIds) {
      const p = await ctx.db.get(pid as any);
      if (p) propertyCache.set(pid, p);
    }

    // Build conversation summaries
    const conversations = await Promise.all(
      userConversations.map(async (conversation) => {
        const otherUserId = conversation.participantIds.find((id) => id !== user._id);
        const otherUser = otherUserId ? (userCache.get(otherUserId.toString()) ?? null) : null;

        const property = conversation.propertyId
          ? (propertyCache.get(conversation.propertyId.toString()) ?? null)
          : null;

        // Resolve profile image URL
        const otherUserImageUrl = otherUser?.profileImageId
          ? await ctx.storage.getUrl(otherUser.profileImageId)
          : null;

        // Get unread count for this conversation using the conversationId string
        // Derive the conversationId string from participants + property
        const sortedIds = [user._id, otherUserId].sort();
        const conversationIdStr = conversation.propertyId
          ? `${sortedIds[0]}_${sortedIds[1]}_${conversation.propertyId}`
          : `${sortedIds[0]}_${sortedIds[1]}`;

        const unreadMessages = await ctx.db
          .query('messages')
          .withIndex('by_conversation', (q) => q.eq('conversationId', conversationIdStr))
          .filter((q) =>
            q.and(q.eq(q.field('recipientId'), user._id), q.eq(q.field('isRead'), false))
          )
          .collect();

        // Get the last message sender to determine isFromMe
        const lastMessage = await ctx.db
          .query('messages')
          .withIndex('by_conversation', (q) => q.eq('conversationId', conversationIdStr))
          .order('desc')
          .first();

        return {
          conversationId: conversationIdStr,
          otherUser: otherUser
            ? {
                _id: otherUser._id,
                firstName: otherUser.firstName,
                lastName: otherUser.lastName,
                imageUrl: otherUserImageUrl,
              }
            : null,
          property: property
            ? {
                _id: property._id,
                title: property.title,
              }
            : null,
          lastMessage: {
            text: conversation.lastMessagePreview ?? lastMessage?.messageText ?? '',
            timestamp: conversation.lastMessageAt,
            isFromMe: lastMessage ? lastMessage.senderId === user._id : false,
          },
          unreadCount: unreadMessages.length,
        };
      })
    );

    return conversations;
  },
});

// Get messages in a conversation
export const getMessages = query({
  args: {
    conversationId: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = await getCurrentUserOrNull(ctx);
    if (!result) {
      return { messages: [], nextCursor: null };
    }

    const { user } = result;
    const limit = args.limit ?? 50;

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversation', (q) => q.eq('conversationId', args.conversationId))
      .collect();

    // Verify user is part of this conversation
    const isParticipant = messages.some(
      (m) => m.senderId === user._id || m.recipientId === user._id
    );

    if (!isParticipant) {
      return { messages: [], nextCursor: null };
    }

    // Sort by creation time (oldest first for chat display)
    const sortedMessages = messages.sort((a, b) => a._creationTime - b._creationTime);

    // Pagination (from end)
    const startIndex = args.cursor
      ? Number.parseInt(args.cursor, 10)
      : Math.max(0, sortedMessages.length - limit);
    const paginatedMessages = sortedMessages.slice(startIndex, startIndex + limit);

    // Mark messages as read
    const unreadMessages = paginatedMessages.filter((m) => m.recipientId === user._id && !m.isRead);

    // Note: In a real app, you'd batch update these
    // For now, we'll return them and mark read separately

    return {
      messages: paginatedMessages.map((m) => ({
        ...m,
        isFromMe: m.senderId === user._id,
      })),
      nextCursor: startIndex > 0 ? String(Math.max(0, startIndex - limit)) : null,
      hasMore: startIndex > 0,
    };
  },
});

// Send a message
export const sendMessage = mutation({
  args: {
    recipientId: v.id('users'),
    propertyId: v.optional(v.id('properties')),
    messageText: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);

    // Generate conversation ID (sorted user IDs for consistency)
    const sortedIds = [user._id, args.recipientId].sort();
    const conversationId = args.propertyId
      ? `${sortedIds[0]}_${sortedIds[1]}_${args.propertyId}`
      : `${sortedIds[0]}_${sortedIds[1]}`;

    const messageId = await ctx.db.insert('messages', {
      conversationId,
      senderId: user._id,
      recipientId: args.recipientId,
      propertyId: args.propertyId,
      messageText: args.messageText,
      isRead: false,
    });

    // Upsert conversation record for efficient listing
    const existingConversation = await ctx.db
      .query('conversations')
      .withIndex('by_participants', (q) => q.eq('participantIds', sortedIds as any))
      .filter((q) =>
        args.propertyId
          ? q.eq(q.field('propertyId'), args.propertyId)
          : q.eq(q.field('propertyId'), undefined)
      )
      .first();

    if (existingConversation) {
      await ctx.db.patch(existingConversation._id, {
        lastMessageAt: Date.now(),
        lastMessagePreview: args.messageText.slice(0, 100),
      });
    } else {
      await ctx.db.insert('conversations', {
        participantIds: sortedIds as any,
        propertyId: args.propertyId,
        lastMessageAt: Date.now(),
        lastMessagePreview: args.messageText.slice(0, 100),
      });
    }

    // Create notification for recipient
    await ctx.db.insert('notifications', {
      userId: args.recipientId,
      notificationType: 'new_message',
      title: 'New Message',
      message: `${user.firstName ?? 'Someone'} sent you a message`,
      data: { messageId, conversationId },
      isRead: false,
    });

    return messageId;
  },
});

// Mark messages as read
export const markMessagesAsRead = mutation({
  args: {
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversation', (q) => q.eq('conversationId', args.conversationId))
      .collect();

    // Mark unread messages as read
    const unreadMessages = messages.filter((m) => m.recipientId === user._id && !m.isRead);

    await Promise.all(unreadMessages.map((m) => ctx.db.patch(m._id, { isRead: true })));

    return unreadMessages.length;
  },
});

// Get unread message count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const result = await getCurrentUserOrNull(ctx);
    if (!result) {
      return 0;
    }

    const unreadMessages = await ctx.db
      .query('messages')
      .withIndex('by_recipient', (q) => q.eq('recipientId', result.user._id))
      .filter((q) => q.eq(q.field('isRead'), false))
      .collect();

    return unreadMessages.length;
  },
});
