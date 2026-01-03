import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get current user profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    return user;
  },
});

// Get user by ID
export const getUserById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    // Return public profile info (exclude sensitive data)
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profileImageId: user.profileImageId,
      idVerified: user.idVerified,
      _creationTime: user._creationTime,
    };
  },
});

// Create or update user profile
export const upsertUser = mutation({
  args: {
    email: v.string(),
    phone: v.string(),
    role: v.union(
      v.literal('renter'),
      v.literal('landlord'),
      v.literal('admin'),
      v.literal('verifier')
    ),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    languagePreference: v.optional(v.union(v.literal('fr'), v.literal('en'))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Check if user exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        firstName: args.firstName,
        lastName: args.lastName,
        languagePreference: args.languagePreference ?? existingUser.languagePreference,
        lastLogin: Date.now(),
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert('users', {
      email: args.email,
      phone: args.phone,
      role: args.role,
      firstName: args.firstName,
      lastName: args.lastName,
      languagePreference: args.languagePreference ?? 'fr',
      emailVerified: false,
      phoneVerified: false,
      idVerified: false,
      isActive: true,
      tokenIdentifier: identity.tokenIdentifier,
      lastLogin: Date.now(),
    });

    return userId;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    languagePreference: v.optional(v.union(v.literal('fr'), v.literal('en'))),
    profileImageId: v.optional(v.id('_storage')),
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

    await ctx.db.patch(user._id, {
      ...(args.firstName !== undefined && { firstName: args.firstName }),
      ...(args.lastName !== undefined && { lastName: args.lastName }),
      ...(args.languagePreference !== undefined && { languagePreference: args.languagePreference }),
      ...(args.profileImageId !== undefined && { profileImageId: args.profileImageId }),
    });

    return user._id;
  },
});

// Update user role (admin only)
export const updateUserRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(
      v.literal('renter'),
      v.literal('landlord'),
      v.literal('admin'),
      v.literal('verifier')
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Check if current user is admin
    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    await ctx.db.patch(args.userId, { role: args.role });
    return args.userId;
  },
});

// Verify user ID (admin/verifier only)
export const verifyUserId = mutation({
  args: {
    userId: v.id('users'),
    verified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Check if current user is admin or verifier
    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'verifier')) {
      throw new Error('Unauthorized: Admin or verifier access required');
    }

    await ctx.db.patch(args.userId, { idVerified: args.verified });
    return args.userId;
  },
});

// Get users by role (admin only)
export const getUsersByRole = query({
  args: {
    role: v.union(
      v.literal('renter'),
      v.literal('landlord'),
      v.literal('admin'),
      v.literal('verifier')
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!currentUser || currentUser.role !== 'admin') {
      return [];
    }

    const users = await ctx.db
      .query('users')
      .withIndex('by_role', (q) => q.eq('role', args.role))
      .collect();

    // Return without sensitive data
    return users.map((user) => ({
      _id: user._id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      idVerified: user.idVerified,
      _creationTime: user._creationTime,
    }));
  },
});
