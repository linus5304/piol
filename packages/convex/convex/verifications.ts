import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUser, getCurrentUserOrNull } from './utils/auth';
import { assertAdminOrVerifier, hasRole, isOwnerOrAdmin } from './utils/authorization';

// Get pending verifications (for verifiers)
export const getPendingVerifications = query({
  args: {
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = await getCurrentUserOrNull(ctx);
    if (!result || !hasRole(result.user.role, ['admin', 'verifier'])) {
      return [];
    }

    // Get properties pending verification
    let properties = await ctx.db
      .query('properties')
      .withIndex('by_status', (q) => q.eq('status', 'pending_verification'))
      .collect();

    // Filter by city if provided
    if (args.city) {
      properties = properties.filter((p) => p.city === args.city);
    }

    // Get landlord info
    const propertiesWithDetails = await Promise.all(
      properties.map(async (property) => {
        const landlord = await ctx.db.get(property.landlordId);

        // Check if there's an existing verification
        const existingVerification = await ctx.db
          .query('verifications')
          .withIndex('by_property', (q) => q.eq('propertyId', property._id))
          .first();

        return {
          ...property,
          landlord: landlord
            ? {
                _id: landlord._id,
                firstName: landlord.firstName,
                lastName: landlord.lastName,
                phone: landlord.phone,
              }
            : null,
          existingVerification: existingVerification
            ? {
                _id: existingVerification._id,
                status: existingVerification.status,
                verificationType: existingVerification.verificationType,
              }
            : null,
        };
      })
    );

    return propertiesWithDetails;
  },
});

// Get my assigned verifications (for verifiers)
export const getMyVerifications = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('in_progress'),
        v.literal('approved'),
        v.literal('rejected')
      )
    ),
  },
  handler: async (ctx, args) => {
    const result = await getCurrentUserOrNull(ctx);
    if (!result || !hasRole(result.user.role, ['admin', 'verifier'])) {
      return [];
    }

    const { user } = result;
    let verifications = await ctx.db
      .query('verifications')
      .withIndex('by_verifier', (q) => q.eq('verifierId', user._id))
      .collect();

    if (args.status) {
      verifications = verifications.filter((v) => v.status === args.status);
    }

    // Get property and landlord details
    const verificationsWithDetails = await Promise.all(
      verifications.map(async (verification) => {
        const property = await ctx.db.get(verification.propertyId);
        const landlord = property ? await ctx.db.get(property.landlordId) : null;

        return {
          ...verification,
          property: property
            ? {
                _id: property._id,
                title: property.title,
                city: property.city,
                neighborhood: property.neighborhood,
                addressLine1: property.addressLine1,
              }
            : null,
          landlord: landlord
            ? {
                _id: landlord._id,
                firstName: landlord.firstName,
                lastName: landlord.lastName,
                phone: landlord.phone,
              }
            : null,
        };
      })
    );

    return verificationsWithDetails.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Get verification by ID
export const getVerification = query({
  args: { verificationId: v.id('verifications') },
  handler: async (ctx, args) => {
    const result = await getCurrentUserOrNull(ctx);
    if (!result) {
      return null;
    }

    const { user } = result;

    const verification = await ctx.db.get(args.verificationId);
    if (!verification) {
      return null;
    }

    // Check authorization
    const property = await ctx.db.get(verification.propertyId);
    if (!property) {
      return null;
    }

    const isAuthorized =
      hasRole(user.role, ['admin', 'verifier']) || property.landlordId === user._id;

    if (!isAuthorized) {
      return null;
    }

    const landlord = await ctx.db.get(property.landlordId);

    return {
      ...verification,
      property: {
        _id: property._id,
        title: property.title,
        city: property.city,
        neighborhood: property.neighborhood,
        addressLine1: property.addressLine1,
        addressLine2: property.addressLine2,
        location: property.location,
        images: property.images,
      },
      landlord: landlord
        ? {
            _id: landlord._id,
            firstName: landlord.firstName,
            lastName: landlord.lastName,
            phone: landlord.phone,
            email: landlord.email,
          }
        : null,
    };
  },
});

// Assign verification to self (verifier claims a property)
export const claimVerification = mutation({
  args: {
    propertyId: v.id('properties'),
    verificationType: v.union(
      v.literal('property_visit'),
      v.literal('ownership_document'),
      v.literal('id_verification')
    ),
  },
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    assertAdminOrVerifier(user.role);

    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    if (property.status !== 'pending_verification') {
      throw new Error('Property is not pending verification');
    }

    // Check if verification already exists
    const existingVerification = await ctx.db
      .query('verifications')
      .withIndex('by_property', (q) => q.eq('propertyId', args.propertyId))
      .filter((q) =>
        q.and(
          q.eq(q.field('verificationType'), args.verificationType),
          q.neq(q.field('status'), 'rejected')
        )
      )
      .first();

    if (existingVerification) {
      throw new Error('Verification already assigned for this property');
    }

    const verificationId = await ctx.db.insert('verifications', {
      propertyId: args.propertyId,
      verifierId: user._id,
      verificationType: args.verificationType,
      status: 'in_progress',
    });

    // Notify landlord
    await ctx.db.insert('notifications', {
      userId: property.landlordId,
      notificationType: 'verification_started',
      title: 'Verification Started',
      message: `Verification for "${property.title}" has been assigned to a verifier`,
      data: { verificationId, propertyId: args.propertyId },
      isRead: false,
    });

    return verificationId;
  },
});

// Update verification (add notes, photos, documents)
export const updateVerification = mutation({
  args: {
    verificationId: v.id('verifications'),
    notes: v.optional(v.string()),
    visitDate: v.optional(v.number()),
    documents: v.optional(
      v.array(
        v.object({
          type: v.string(),
          storageId: v.id('_storage'),
          verified: v.boolean(),
        })
      )
    ),
    visitPhotos: v.optional(
      v.array(
        v.object({
          storageId: v.id('_storage'),
          timestamp: v.number(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    assertAdminOrVerifier(user.role);

    const verification = await ctx.db.get(args.verificationId);
    if (!verification) {
      throw new Error('Verification not found');
    }

    // Only assigned verifier or admin can update
    if (!isOwnerOrAdmin(verification.verifierId, user._id, user.role)) {
      throw new Error('Unauthorized: Not assigned to this verification');
    }

    const updates: Record<string, unknown> = {};

    if (args.notes !== undefined) updates.notes = args.notes;
    if (args.visitDate !== undefined) updates.visitDate = args.visitDate;

    if (args.documents) {
      const existingDocs = verification.documents ?? [];
      updates.documents = [...existingDocs, ...args.documents];
    }

    if (args.visitPhotos) {
      const existingPhotos = verification.visitPhotos ?? [];
      updates.visitPhotos = [...existingPhotos, ...args.visitPhotos];
    }

    await ctx.db.patch(args.verificationId, updates);
    return args.verificationId;
  },
});

// Complete verification (approve or reject)
export const completeVerification = mutation({
  args: {
    verificationId: v.id('verifications'),
    status: v.union(v.literal('approved'), v.literal('rejected')),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await getCurrentUser(ctx);
    assertAdminOrVerifier(user.role);

    const verification = await ctx.db.get(args.verificationId);
    if (!verification) {
      throw new Error('Verification not found');
    }

    if (!isOwnerOrAdmin(verification.verifierId, user._id, user.role)) {
      throw new Error('Unauthorized: Not assigned to this verification');
    }

    // Update verification
    await ctx.db.patch(args.verificationId, {
      status: args.status,
      notes: args.notes ?? verification.notes,
      completedAt: Date.now(),
    });

    // Update property status
    const property = await ctx.db.get(verification.propertyId);
    if (property) {
      if (args.status === 'approved') {
        await ctx.db.patch(verification.propertyId, {
          status: 'verified',
          verificationStatus: 'approved',
          verifiedAt: Date.now(),
          verifierId: user._id,
        });

        // Notify landlord
        await ctx.db.insert('notifications', {
          userId: property.landlordId,
          notificationType: 'verification_approved',
          title: 'Property Verified!',
          message: `Your property "${property.title}" has been verified and is now active`,
          data: { propertyId: property._id },
          isRead: false,
        });
      } else {
        await ctx.db.patch(verification.propertyId, {
          status: 'draft',
          verificationStatus: 'rejected',
        });

        // Notify landlord
        await ctx.db.insert('notifications', {
          userId: property.landlordId,
          notificationType: 'verification_rejected',
          title: 'Verification Rejected',
          message: `Your property "${property.title}" verification was rejected. Please review and resubmit.`,
          data: { propertyId: property._id, reason: args.notes },
          isRead: false,
        });
      }
    }

    return args.verificationId;
  },
});

// Get verification stats (admin only)
export const getVerificationStats = query({
  args: {},
  handler: async (ctx) => {
    const result = await getCurrentUserOrNull(ctx);
    if (!result || !hasRole(result.user.role, ['admin'])) {
      return null;
    }

    const verifications = await ctx.db.query('verifications').collect();
    const properties = await ctx.db.query('properties').collect();

    return {
      totalVerifications: verifications.length,
      pending: verifications.filter((v) => v.status === 'pending').length,
      inProgress: verifications.filter((v) => v.status === 'in_progress').length,
      approved: verifications.filter((v) => v.status === 'approved').length,
      rejected: verifications.filter((v) => v.status === 'rejected').length,
      propertiesPendingVerification: properties.filter((p) => p.status === 'pending_verification')
        .length,
      verifiedProperties: properties.filter((p) => p.status === 'verified').length,
      activeProperties: properties.filter((p) => p.status === 'active').length,
    };
  },
});
