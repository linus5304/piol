import { v } from 'convex/values';
import { internal } from './_generated/api';
import { mutation, query } from './_generated/server';
import {
  getCurrentUser as getAuthUser,
  getCurrentUserOrNull as getAuthUserOrNull,
} from './utils/auth';
import { assertAdmin, hasRole } from './utils/authorization';

// ============================================================================
// Mutations
// ============================================================================

// Submit a landlord application (renter only)
export const submitLandlordApplication = mutation({
  args: {
    cniPhotoFront: v.id('_storage'),
    cniPhotoBack: v.id('_storage'),
    motivationText: v.string(),
  },
  returns: v.id('landlordApplications'),
  handler: async (ctx, args) => {
    const { user } = await getAuthUser(ctx);

    // Only renters can apply
    if (user.role !== 'renter') {
      throw new Error('Only renters can submit a landlord application');
    }

    // Check for existing pending application
    const existingPending = await ctx.db
      .query('landlordApplications')
      .withIndex('by_userId_and_status', (q) => q.eq('userId', user._id).eq('status', 'pending'))
      .first();

    if (existingPending) {
      throw new Error('You already have a pending application');
    }

    // Validate motivation text length
    if (args.motivationText.trim().length < 20) {
      throw new Error('Motivation text must be at least 20 characters');
    }

    if (args.motivationText.trim().length > 2000) {
      throw new Error('Motivation text must be at most 2000 characters');
    }

    const applicationId = await ctx.db.insert('landlordApplications', {
      userId: user._id,
      status: 'pending',
      cniPhotoFront: args.cniPhotoFront,
      cniPhotoBack: args.cniPhotoBack,
      motivationText: args.motivationText.trim(),
    });

    // Notify all admins
    const admins = await ctx.db
      .query('users')
      .withIndex('by_role', (q) => q.eq('role', 'admin'))
      .collect();

    for (const admin of admins) {
      await ctx.scheduler.runAfter(0, internal.notifications.createNotification, {
        userId: admin._id,
        notificationType: 'landlord_application',
        title: 'New landlord application',
        message: `${user.firstName || 'A user'} ${user.lastName || ''} has submitted a landlord application`,
        data: { applicationId },
        actionUrl: `/dashboard/admin/applications/${applicationId}`,
      });
    }

    return applicationId;
  },
});

// Review a landlord application (admin only)
export const reviewLandlordApplication = mutation({
  args: {
    applicationId: v.id('landlordApplications'),
    decision: v.union(v.literal('approved'), v.literal('rejected')),
    rejectionReason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { user: admin } = await getAuthUser(ctx);
    assertAdmin(admin.role);

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    if (application.status !== 'pending') {
      throw new Error('Application has already been reviewed');
    }

    if (args.decision === 'rejected' && !args.rejectionReason?.trim()) {
      throw new Error('Rejection reason is required');
    }

    // Update application
    await ctx.db.patch(args.applicationId, {
      status: args.decision,
      rejectionReason: args.decision === 'rejected' ? args.rejectionReason?.trim() : undefined,
      reviewedBy: admin._id,
      reviewedAt: Date.now(),
    });

    // If approved, update user role to landlord
    if (args.decision === 'approved') {
      await ctx.db.patch(application.userId, { role: 'landlord' });
    }

    // Notify applicant
    const notificationTitle =
      args.decision === 'approved' ? 'Application approved!' : 'Application not approved';
    const notificationMessage =
      args.decision === 'approved'
        ? 'Your landlord application has been approved. You can now list properties!'
        : `Your landlord application was not approved. Reason: ${args.rejectionReason}`;

    await ctx.scheduler.runAfter(0, internal.notifications.createNotification, {
      userId: application.userId,
      notificationType: 'landlord_application_reviewed',
      title: notificationTitle,
      message: notificationMessage,
      data: { applicationId: args.applicationId, decision: args.decision },
      actionUrl: '/dashboard/settings',
    });

    return null;
  },
});

// ============================================================================
// Queries
// ============================================================================

// Get current user's latest landlord application
export const getMyLandlordApplication = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id('landlordApplications'),
      _creationTime: v.number(),
      userId: v.id('users'),
      status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
      cniPhotoFront: v.id('_storage'),
      cniPhotoBack: v.id('_storage'),
      motivationText: v.string(),
      rejectionReason: v.optional(v.string()),
      reviewedBy: v.optional(v.id('users')),
      reviewedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx) => {
    const result = await getAuthUserOrNull(ctx);
    if (!result) return null;

    return await ctx.db
      .query('landlordApplications')
      .withIndex('by_userId', (q) => q.eq('userId', result.user._id))
      .order('desc')
      .first();
  },
});

// Get all pending applications (admin only)
export const getPendingApplications = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('landlordApplications'),
      _creationTime: v.number(),
      userId: v.id('users'),
      status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
      motivationText: v.string(),
      user: v.union(
        v.null(),
        v.object({
          _id: v.id('users'),
          firstName: v.optional(v.string()),
          lastName: v.optional(v.string()),
          email: v.string(),
          profileImageUrl: v.optional(v.string()),
          _creationTime: v.number(),
        })
      ),
    })
  ),
  handler: async (ctx) => {
    const result = await getAuthUserOrNull(ctx);
    if (!result || !hasRole(result.user.role, ['admin'])) {
      return [];
    }

    const applications = await ctx.db
      .query('landlordApplications')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .order('desc')
      .collect();

    return await Promise.all(
      applications.map(async (app) => {
        const appUser = await ctx.db.get(app.userId);
        return {
          _id: app._id,
          _creationTime: app._creationTime,
          userId: app.userId,
          status: app.status,
          motivationText: app.motivationText,
          user: appUser
            ? {
                _id: appUser._id,
                firstName: appUser.firstName,
                lastName: appUser.lastName,
                email: appUser.email,
                profileImageUrl: appUser.profileImageUrl,
                _creationTime: appUser._creationTime,
              }
            : null,
        };
      })
    );
  },
});

// Get single application detail (admin only)
export const getLandlordApplication = query({
  args: { applicationId: v.id('landlordApplications') },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id('landlordApplications'),
      _creationTime: v.number(),
      userId: v.id('users'),
      status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
      cniPhotoFront: v.id('_storage'),
      cniPhotoBack: v.id('_storage'),
      motivationText: v.string(),
      rejectionReason: v.optional(v.string()),
      reviewedBy: v.optional(v.id('users')),
      reviewedAt: v.optional(v.number()),
      user: v.union(
        v.null(),
        v.object({
          _id: v.id('users'),
          firstName: v.optional(v.string()),
          lastName: v.optional(v.string()),
          email: v.string(),
          profileImageUrl: v.optional(v.string()),
          _creationTime: v.number(),
        })
      ),
      reviewer: v.union(
        v.null(),
        v.object({
          _id: v.id('users'),
          firstName: v.optional(v.string()),
          lastName: v.optional(v.string()),
        })
      ),
    })
  ),
  handler: async (ctx, args) => {
    const result = await getAuthUserOrNull(ctx);
    if (!result || !hasRole(result.user.role, ['admin'])) {
      return null;
    }

    const application = await ctx.db.get(args.applicationId);
    if (!application) return null;

    const appUser = await ctx.db.get(application.userId);
    const reviewer = application.reviewedBy ? await ctx.db.get(application.reviewedBy) : null;

    return {
      ...application,
      user: appUser
        ? {
            _id: appUser._id,
            firstName: appUser.firstName,
            lastName: appUser.lastName,
            email: appUser.email,
            profileImageUrl: appUser.profileImageUrl,
            _creationTime: appUser._creationTime,
          }
        : null,
      reviewer: reviewer
        ? {
            _id: reviewer._id,
            firstName: reviewer.firstName,
            lastName: reviewer.lastName,
          }
        : null,
    };
  },
});

// Get count of pending applications (admin only, for sidebar badge)
export const getPendingApplicationsCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const result = await getAuthUserOrNull(ctx);
    if (!result || !hasRole(result.user.role, ['admin'])) {
      return 0;
    }

    const pending = await ctx.db
      .query('landlordApplications')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect();

    return pending.length;
  },
});
