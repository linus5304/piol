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
