import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get user's notifications
export const getNotifications = query({
  args: {
    limit: v.optional(v.number()),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      return [];
    }

    const limit = args.limit ?? 50;

    let notifications: Awaited<ReturnType<typeof ctx.db.query>>[] = [];
    if (args.unreadOnly) {
      notifications = await ctx.db
        .query('notifications')
        .withIndex('by_user_unread', (q) => q.eq('userId', user._id).eq('isRead', false))
        .collect();
    } else {
      notifications = await ctx.db
        .query('notifications')
        .withIndex('by_user', (q) => q.eq('userId', user._id))
        .collect();
    }

    // Sort by creation time (newest first) and limit
    return notifications.sort((a, b) => b._creationTime - a._creationTime).slice(0, limit);
  },
});

// Get unread notification count
export const getUnreadNotificationCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      return 0;
    }

    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_unread', (q) => q.eq('userId', user._id).eq('isRead', false))
      .collect();

    return unreadNotifications.length;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== user._id) {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.notificationId, { isRead: true });
    return args.notificationId;
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_unread', (q) => q.eq('userId', user._id).eq('isRead', false))
      .collect();

    await Promise.all(unreadNotifications.map((n) => ctx.db.patch(n._id, { isRead: true })));

    return unreadNotifications.length;
  },
});

// Delete notification
export const deleteNotification = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== user._id) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.notificationId);
    return args.notificationId;
  },
});

// Create notification (internal use)
export const createNotification = mutation({
  args: {
    userId: v.id('users'),
    notificationType: v.string(),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    actionUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // This is typically called internally by other functions
    // Could add admin check if exposing publicly

    const notificationId = await ctx.db.insert('notifications', {
      userId: args.userId,
      notificationType: args.notificationType,
      title: args.title,
      message: args.message,
      data: args.data,
      actionUrl: args.actionUrl,
      isRead: false,
    });

    return notificationId;
  },
});
