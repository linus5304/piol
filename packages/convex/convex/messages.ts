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

    // Get all messages where user is sender or recipient
    const sentMessages = await ctx.db
      .query('messages')
      .withIndex('by_sender', (q) => q.eq('senderId', user._id))
      .collect();

    const receivedMessages = await ctx.db
      .query('messages')
      .withIndex('by_recipient', (q) => q.eq('recipientId', user._id))
      .collect();

    // Get unique conversation IDs
    const allMessages = [...sentMessages, ...receivedMessages];
    const conversationIds = [...new Set(allMessages.map((m) => m.conversationId))];

    // Build conversation summaries
    const conversations = await Promise.all(
      conversationIds.map(async (conversationId) => {
        const conversationMessages = allMessages
          .filter((m) => m.conversationId === conversationId)
          .sort((a, b) => b._creationTime - a._creationTime);

        const lastMessage = conversationMessages[0];
        const unreadCount = conversationMessages.filter(
          (m) => m.recipientId === user._id && !m.isRead
        ).length;

        // Get other participant
        const otherUserId =
          lastMessage.senderId === user._id ? lastMessage.recipientId : lastMessage.senderId;
        const otherUser = await ctx.db.get(otherUserId);

        // Get property if exists
        const property = lastMessage.propertyId ? await ctx.db.get(lastMessage.propertyId) : null;

        // Convert profile image storage ID to URL
        const otherUserImageUrl = otherUser?.profileImageId
          ? await ctx.storage.getUrl(otherUser.profileImageId)
          : null;

        return {
          conversationId,
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
            text: lastMessage.messageText,
            timestamp: lastMessage._creationTime,
            isFromMe: lastMessage.senderId === user._id,
          },
          unreadCount,
        };
      })
    );

    // Sort by last message time
    return conversations.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
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
