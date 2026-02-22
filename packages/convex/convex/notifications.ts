import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';

// Get user's notifications (paginated)
export const getNotifications = query({
  args: {
    paginationOpts: paginationOptsValidator,
    unreadOnly: v.optional(v.boolean()),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { page: [], isDone: true, continueCursor: '' };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return { page: [], isDone: true, continueCursor: '' };
    }

    const query = args.unreadOnly
      ? ctx.db
          .query('notifications')
          .withIndex('by_user_unread', (q) => q.eq('userId', user._id).eq('isRead', false))
      : ctx.db.query('notifications').withIndex('by_user', (q) => q.eq('userId', user._id));

    return await query.order('desc').paginate(args.paginationOpts);
  },
});

// Get unread notification count
export const getUnreadNotificationCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
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
  returns: v.id('notifications'),
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
  returns: v.number(),
  handler: async (ctx) => {
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
  returns: v.id('notifications'),
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

// Create notification (internal use only)
export const createNotification = internalMutation({
  args: {
    userId: v.id('users'),
    notificationType: v.string(),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    actionUrl: v.optional(v.string()),
  },
  returns: v.id('notifications'),
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
