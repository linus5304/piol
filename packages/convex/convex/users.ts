import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';
import {
  getCurrentUser as getAuthUser,
  getCurrentUserOrNull as getAuthUserOrNull,
} from './utils/auth';
import { assertAdmin, assertAdminOrVerifier, hasRole } from './utils/authorization';

// ============================================================================
// Reusable return type validators
// ============================================================================

const roleValidator = v.union(
  v.literal('renter'),
  v.literal('landlord'),
  v.literal('admin'),
  v.literal('verifier')
);

const fullUserValidator = v.object({
  _id: v.id('users'),
  _creationTime: v.number(),
  clerkId: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  role: roleValidator,
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  languagePreference: v.union(v.literal('fr'), v.literal('en')),
  emailVerified: v.boolean(),
  phoneVerified: v.boolean(),
  idVerified: v.boolean(),
  profileImageUrl: v.optional(v.string()),
  profileImageId: v.optional(v.id('_storage')),
  lastLogin: v.optional(v.number()),
  isActive: v.boolean(),
  onboardingCompleted: v.optional(v.boolean()),
});

const publicProfileValidator = v.object({
  _id: v.id('users'),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  role: roleValidator,
  profileImageUrl: v.optional(v.string()),
  idVerified: v.boolean(),
  _creationTime: v.number(),
});

const publicUserWithEmailValidator = v.object({
  _id: v.id('users'),
  email: v.string(),
  phone: v.optional(v.string()),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  role: roleValidator,
  isActive: v.boolean(),
  idVerified: v.boolean(),
  _creationTime: v.number(),
});

const listUserValidator = v.object({
  _id: v.id('users'),
  email: v.string(),
  phone: v.optional(v.string()),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  role: roleValidator,
  isActive: v.boolean(),
  idVerified: v.boolean(),
  profileImageUrl: v.optional(v.string()),
  _creationTime: v.number(),
});

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
  returns: v.id('users'),
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
    role: v.optional(v.union(v.literal('renter'), v.literal('landlord'))),
  },
  returns: v.union(v.null(), v.id('users')),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (!user) {
      console.log(`User with clerkId ${args.clerkId} not found for update`);
      return null;
    }

    const canUpdateRole = Boolean(
      args.role && (user.role === 'renter' || user.role === 'landlord')
    );

    await ctx.db.patch(user._id, {
      ...(args.email && { email: args.email }),
      ...(args.firstName !== undefined && { firstName: args.firstName }),
      ...(args.lastName !== undefined && { lastName: args.lastName }),
      ...(args.profileImageUrl !== undefined && { profileImageUrl: args.profileImageUrl }),
      ...(args.phone !== undefined && { phone: args.phone }),
      ...(canUpdateRole && { role: args.role }),
    });

    console.log(`Updated user ${user._id} from Clerk`);
    return user._id;
  },
});

export const deleteUserByClerkId = internalMutation({
  args: {
    clerkId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (!user) {
      console.log(`User with clerkId ${args.clerkId} not found for deletion`);
      return null;
    }

    // Soft delete - mark as inactive
    await ctx.db.patch(user._id, { isActive: false });
    console.log(`Deactivated user ${user._id}`);
    return null;
  },
});

// ============================================================================
// Public queries
// ============================================================================

// Get current user profile from Clerk token
export const getCurrentUser = query({
  args: {},
  returns: v.union(v.null(), fullUserValidator),
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
  returns: v.union(v.null(), publicProfileValidator),
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
  returns: v.id('users'),
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
  returns: v.union(v.null(), fullUserValidator),
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

// Cameroon phone: +237 followed by 9 digits starting with 6 or 2
const CM_PHONE_RE = /^\+237[62]\d{8}$/;

// Update user profile
export const updateProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    languagePreference: v.optional(v.union(v.literal('fr'), v.literal('en'))),
    profileImageId: v.optional(v.id('_storage')),
    role: v.optional(v.union(v.literal('renter'), v.literal('landlord'))),
  },
  returns: v.id('users'),
  handler: async (ctx, args) => {
    const { user } = await getAuthUser(ctx);

    // Validate phone format if provided
    if (args.phone !== undefined && args.phone !== '' && !CM_PHONE_RE.test(args.phone)) {
      throw new Error(
        'Invalid Cameroon phone number. Expected format: +237 6XXXXXXXX or +237 2XXXXXXXX'
      );
    }

    // Validate name lengths
    if (args.firstName !== undefined && args.firstName.trim().length === 0) {
      throw new Error('First name is required');
    }
    if (args.lastName !== undefined && args.lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }

    // Block renter→landlord upgrade via profile — must go through application
    if (args.role === 'landlord' && user.role === 'renter') {
      throw new Error('To become a landlord, please submit a landlord application.');
    }

    await ctx.db.patch(user._id, {
      ...(args.firstName !== undefined && { firstName: args.firstName.trim() }),
      ...(args.lastName !== undefined && { lastName: args.lastName.trim() }),
      ...(args.phone !== undefined && { phone: args.phone || undefined }),
      ...(args.languagePreference !== undefined && { languagePreference: args.languagePreference }),
      ...(args.profileImageId !== undefined && { profileImageId: args.profileImageId }),
      ...(args.role !== undefined && { role: args.role }),
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
  returns: v.id('users'),
  handler: async (ctx, args) => {
    const { user } = await getAuthUser(ctx);

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
  returns: v.id('users'),
  handler: async (ctx, args) => {
    const { user: currentUser } = await getAuthUser(ctx);
    assertAdmin(currentUser.role);

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
  returns: v.id('users'),
  handler: async (ctx, args) => {
    const { user: currentUser } = await getAuthUser(ctx);
    assertAdminOrVerifier(currentUser.role);

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
  returns: v.array(publicUserWithEmailValidator),
  handler: async (ctx, args) => {
    const result = await getAuthUserOrNull(ctx);
    if (!result || !hasRole(result.user.role, ['admin'])) {
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

// List all users (admin only, paginated)
export const listUsers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    role: v.optional(roleValidator),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const result = await getAuthUserOrNull(ctx);
    if (!result || !hasRole(result.user.role, ['admin'])) {
      return { page: [], isDone: true, continueCursor: '' };
    }

    const query = args.role
      ? ctx.db
          .query('users')
          .withIndex('by_role', (q) => q.eq('role', args.role!))
          .order('desc')
      : ctx.db.query('users').order('desc');

    return await query.paginate(args.paginationOpts);
  },
});

// Get admin-specific stats
export const getAdminStats = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      totalUsers: v.number(),
      newUsersThisMonth: v.number(),
      totalProperties: v.number(),
      activeProperties: v.number(),
      pendingVerifications: v.number(),
      totalTransactions: v.number(),
      pendingApplications: v.number(),
    })
  ),
  handler: async (ctx) => {
    const result = await getAuthUserOrNull(ctx);
    if (!result || !hasRole(result.user.role, ['admin'])) {
      return null;
    }

    // Count users (scan is unavoidable, but only users table — admin-only query)
    const allUsers = await ctx.db.query('users').take(50000);
    const totalUsers = allUsers.length;

    // Count new users this month
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const newUsersThisMonth = allUsers.filter((u) => u._creationTime >= thirtyDaysAgo).length;

    // Count properties by status using index (avoid loading all properties)
    const activeProperties = (
      await ctx.db
        .query('properties')
        .withIndex('by_status', (q) => q.eq('status', 'active'))
        .collect()
    ).length;

    const pendingVerificationProperties = (
      await ctx.db
        .query('properties')
        .withIndex('by_status', (q) => q.eq('status', 'pending_verification'))
        .collect()
    ).length;

    const draftProperties = (
      await ctx.db
        .query('properties')
        .withIndex('by_status', (q) => q.eq('status', 'draft'))
        .collect()
    ).length;

    const rentedProperties = (
      await ctx.db
        .query('properties')
        .withIndex('by_status', (q) => q.eq('status', 'rented'))
        .collect()
    ).length;

    const archivedProperties = (
      await ctx.db
        .query('properties')
        .withIndex('by_status', (q) => q.eq('status', 'archived'))
        .collect()
    ).length;

    const verifiedProperties = (
      await ctx.db
        .query('properties')
        .withIndex('by_status', (q) => q.eq('status', 'verified'))
        .collect()
    ).length;

    const totalProperties =
      activeProperties +
      pendingVerificationProperties +
      draftProperties +
      rentedProperties +
      archivedProperties +
      verifiedProperties;

    // Count completed transactions using status index
    const completedTransactions = await ctx.db
      .query('transactions')
      .withIndex('by_status', (q) => q.eq('paymentStatus', 'completed'))
      .collect();

    const totalTransactions = completedTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Count pending landlord applications
    const pendingApplications = (
      await ctx.db
        .query('landlordApplications')
        .withIndex('by_status', (q) => q.eq('status', 'pending'))
        .collect()
    ).length;

    return {
      totalUsers,
      newUsersThisMonth,
      totalProperties,
      activeProperties,
      pendingVerifications: pendingVerificationProperties,
      totalTransactions,
      pendingApplications,
    };
  },
});

// Toggle user active status (admin only)
export const toggleUserStatus = mutation({
  args: {
    userId: v.id('users'),
    isActive: v.boolean(),
  },
  returns: v.id('users'),
  handler: async (ctx, args) => {
    const { user: currentUser } = await getAuthUser(ctx);
    assertAdmin(currentUser.role);

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
  returns: v.any(),
  handler: async (ctx) => {
    const result = await getAuthUserOrNull(ctx);
    if (!result) {
      return null;
    }

    const { user } = result;

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

      // Get unread messages (inquiries) using compound index
      const unreadMessages = (
        await ctx.db
          .query('messages')
          .withIndex('by_recipient_and_isRead', (q) =>
            q.eq('recipientId', user._id).eq('isRead', false)
          )
          .collect()
      ).length;

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

    const unreadMessages = (
      await ctx.db
        .query('messages')
        .withIndex('by_recipient_and_isRead', (q) =>
          q.eq('recipientId', user._id).eq('isRead', false)
        )
        .collect()
    ).length;

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
