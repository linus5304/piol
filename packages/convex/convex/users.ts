import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';

// ============================================================================
// Internal mutations for Clerk webhook
// ============================================================================

export const createUserFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(v.literal('renter'), v.literal('landlord')),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (existingUser) {
      console.log(`User with clerkId ${args.clerkId} already exists`);
      return existingUser._id;
    }

    const userId = await ctx.db.insert('users', {
      clerkId: args.clerkId,
      email: args.email,
      phone: args.phone,
      role: args.role,
      firstName: args.firstName,
      lastName: args.lastName,
      profileImageUrl: args.profileImageUrl,
      languagePreference: 'fr',
      emailVerified: true, // Clerk handles email verification
      phoneVerified: false,
      idVerified: false,
      isActive: true,
      onboardingCompleted: false,
      lastLogin: Date.now(),
    });

    console.log(`Created user ${userId} for clerkId ${args.clerkId}`);
    return userId;
  },
});

export const updateUserFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (!user) {
      console.log(`User with clerkId ${args.clerkId} not found for update`);
      return null;
    }

    await ctx.db.patch(user._id, {
      ...(args.email && { email: args.email }),
      ...(args.firstName !== undefined && { firstName: args.firstName }),
      ...(args.lastName !== undefined && { lastName: args.lastName }),
      ...(args.profileImageUrl !== undefined && { profileImageUrl: args.profileImageUrl }),
      ...(args.phone !== undefined && { phone: args.phone }),
    });

    console.log(`Updated user ${user._id} from Clerk`);
    return user._id;
  },
});

export const deleteUserByClerkId = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (!user) {
      console.log(`User with clerkId ${args.clerkId} not found for deletion`);
      return;
    }

    // Soft delete - mark as inactive
    await ctx.db.patch(user._id, { isActive: false });
    console.log(`Deactivated user ${user._id}`);
  },
});

// ============================================================================
// Public queries
// ============================================================================

// Get current user profile from Clerk token
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Clerk subject is the user ID
    const clerkId = identity.subject;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .unique();

    return user;
  },
});

// Get user by ID (public profile)
export const getUserById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.isActive) {
      return null;
    }

    // Return public profile info (exclude sensitive data)
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      idVerified: user.idVerified,
      _creationTime: user._creationTime,
    };
  },
});

// ============================================================================
// Mutations requiring authentication
// ============================================================================

// Ensure current user exists (fallback for webhook race condition)
export const ensureCurrentUser = mutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(v.literal('renter'), v.literal('landlord')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const clerkId = identity.subject;

    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .unique();

    if (existingUser) {
      // Update last login
      await ctx.db.patch(existingUser._id, { lastLogin: Date.now() });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert('users', {
      clerkId,
      email: args.email,
      phone: args.phone,
      role: args.role,
      firstName: args.firstName,
      lastName: args.lastName,
      profileImageUrl: args.profileImageUrl,
      languagePreference: 'fr',
      emailVerified: true,
      phoneVerified: false,
      idVerified: false,
      isActive: true,
      onboardingCompleted: false,
      lastLogin: Date.now(),
    });

    console.log(`Created user ${userId} via ensureCurrentUser`);
    return userId;
  },
});

// Auto-create user from JWT claims (simpler fallback)
// Uses identity claims from Clerk JWT - no args needed
export const getOrCreateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const clerkId = identity.subject;

    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .unique();

    if (existingUser) {
      return existingUser;
    }

    // Extract info from JWT claims
    // Clerk identity contains: subject, email, given_name, family_name, picture, etc.
    const email = identity.email ?? `${clerkId}@placeholder.local`;
    const firstName = identity.givenName ?? identity.name?.split(' ')[0];
    const lastName = identity.familyName ?? identity.name?.split(' ').slice(1).join(' ');
    const profileImageUrl = identity.pictureUrl;

    // Create new user with default role (renter)
    const userId = await ctx.db.insert('users', {
      clerkId,
      email,
      phone: undefined,
      role: 'renter', // Default role
      firstName,
      lastName,
      profileImageUrl,
      languagePreference: 'fr',
      emailVerified: !!identity.emailVerified,
      phoneVerified: false,
      idVerified: false,
      isActive: true,
      onboardingCompleted: false,
      lastLogin: Date.now(),
    });

    console.log(`Auto-created user ${userId} from JWT claims`);

    const newUser = await ctx.db.get(userId);
    return newUser;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
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
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.patch(user._id, {
      ...(args.firstName !== undefined && { firstName: args.firstName }),
      ...(args.lastName !== undefined && { lastName: args.lastName }),
      ...(args.phone !== undefined && { phone: args.phone }),
      ...(args.languagePreference !== undefined && { languagePreference: args.languagePreference }),
      ...(args.profileImageId !== undefined && { profileImageId: args.profileImageId }),
    });

    return user._id;
  },
});

// Complete onboarding
export const completeOnboarding = mutation({
  args: {
    role: v.union(v.literal('renter'), v.literal('landlord')),
    phone: v.optional(v.string()),
    languagePreference: v.union(v.literal('fr'), v.literal('en')),
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

    await ctx.db.patch(user._id, {
      role: args.role,
      phone: args.phone,
      languagePreference: args.languagePreference,
      onboardingCompleted: true,
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

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    // Get the target user to check their current role
    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error('User not found');
    }

    // Prevent demoting admins (including self-demotion)
    if (targetUser.role === 'admin' && args.role !== 'admin') {
      throw new Error(
        'Cannot change admin role. Admins must be demoted through a different process.'
      );
    }

    // Prevent promoting to admin through this endpoint (require separate process)
    if (targetUser.role !== 'admin' && args.role === 'admin') {
      throw new Error(
        'Cannot promote to admin through this endpoint. Use the admin promotion process.'
      );
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

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
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
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== 'admin') {
      return [];
    }

    const users = await ctx.db
      .query('users')
      .withIndex('by_role', (q) => q.eq('role', args.role))
      .take(args.limit ?? 100);

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

// List all users (admin only)
export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== 'admin') {
      return [];
    }

    const users = await ctx.db
      .query('users')
      .order('desc')
      .take(args.limit ?? 100);

    // Return user data (some fields excluded for security)
    return users.map((user) => ({
      _id: user._id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      idVerified: user.idVerified,
      profileImageUrl: user.profileImageUrl,
      _creationTime: user._creationTime,
    }));
  },
});

// Get admin-specific stats
export const getAdminStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== 'admin') {
      return null;
    }

    // Count users
    const allUsers = await ctx.db.query('users').collect();
    const totalUsers = allUsers.length;

    // Count new users this month
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const newUsersThisMonth = allUsers.filter((u) => u._creationTime >= thirtyDaysAgo).length;

    // Count properties
    const allProperties = await ctx.db.query('properties').collect();
    const totalProperties = allProperties.length;
    const activeProperties = allProperties.filter((p) => p.status === 'active').length;
    const pendingVerifications = allProperties.filter(
      (p) => p.verificationStatus === 'pending'
    ).length;

    // Count transactions
    const allTransactions = await ctx.db.query('transactions').collect();
    const totalTransactions = allTransactions
      .filter((t) => t.paymentStatus === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalUsers,
      newUsersThisMonth,
      totalProperties,
      activeProperties,
      pendingVerifications,
      totalTransactions,
    };
  },
});

// Toggle user active status (admin only)
export const toggleUserStatus = mutation({
  args: {
    userId: v.id('users'),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    // Don't allow deactivating yourself
    if (args.userId === currentUser._id && !args.isActive) {
      throw new Error('Cannot deactivate your own account');
    }

    await ctx.db.patch(args.userId, { isActive: args.isActive });
    return args.userId;
  },
});

// Get dashboard stats for current user (role-specific)
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
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

    if (user.role === 'landlord') {
      // Landlord stats: properties, revenue, inquiries
      const properties = await ctx.db
        .query('properties')
        .withIndex('by_landlord', (q) => q.eq('landlordId', user._id))
        .collect();

      const activeProperties = properties.filter((p) => p.status === 'active').length;
      const draftProperties = properties.filter((p) => p.status === 'draft').length;
      const pendingVerification = properties.filter(
        (p) => p.status === 'pending_verification'
      ).length;

      // Get transactions for revenue
      const transactions = await ctx.db
        .query('transactions')
        .withIndex('by_landlord', (q) => q.eq('landlordId', user._id))
        .collect();

      const completedTransactions = transactions.filter((t) => t.paymentStatus === 'completed');
      const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
      const pendingPayments = transactions.filter(
        (t) => t.paymentStatus === 'pending' || t.paymentStatus === 'processing'
      ).length;

      // Get unread messages (inquiries)
      const messages = await ctx.db
        .query('messages')
        .withIndex('by_recipient', (q) => q.eq('recipientId', user._id))
        .collect();
      const unreadMessages = messages.filter((m) => !m.isRead).length;

      return {
        role: 'landlord' as const,
        totalProperties: properties.length,
        activeProperties,
        draftProperties,
        pendingVerification,
        totalRevenue,
        pendingPayments,
        unreadMessages,
        completedTransactions: completedTransactions.length,
      };
    }

    // Renter stats: favorites, messages, applications
    const savedProperties = await ctx.db
      .query('savedProperties')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_recipient', (q) => q.eq('recipientId', user._id))
      .collect();
    const unreadMessages = messages.filter((m) => !m.isRead).length;

    const transactions = await ctx.db
      .query('transactions')
      .withIndex('by_renter', (q) => q.eq('renterId', user._id))
      .collect();

    const totalSpent = transactions
      .filter((t) => t.paymentStatus === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      role: 'renter' as const,
      savedProperties: savedProperties.length,
      unreadMessages,
      totalTransactions: transactions.length,
      totalSpent,
    };
  },
});
