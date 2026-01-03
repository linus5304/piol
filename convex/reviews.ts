import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get reviews for a property
export const getPropertyReviews = query({
  args: {
    propertyId: v.id('properties'),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query('reviews')
      .withIndex('by_property', (q) => q.eq('propertyId', args.propertyId))
      .collect();

    // Get reviewer info
    const reviewsWithDetails = await Promise.all(
      reviews.map(async (review) => {
        const reviewer = await ctx.db.get(review.reviewerId);
        return {
          ...review,
          reviewer: reviewer
            ? {
                _id: reviewer._id,
                firstName: reviewer.firstName,
                lastName: reviewer.lastName,
                profileImageId: reviewer.profileImageId,
              }
            : null,
        };
      })
    );

    return reviewsWithDetails.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Get reviews for a user (landlord or tenant)
export const getUserReviews = query({
  args: {
    userId: v.id('users'),
    reviewType: v.optional(
      v.union(
        v.literal('landlord_review'),
        v.literal('tenant_review'),
        v.literal('property_review')
      )
    ),
  },
  handler: async (ctx, args) => {
    let reviews = await ctx.db
      .query('reviews')
      .withIndex('by_reviewee', (q) => q.eq('revieweeId', args.userId))
      .collect();

    if (args.reviewType) {
      reviews = reviews.filter((r) => r.reviewType === args.reviewType);
    }

    // Get reviewer info and property info
    const reviewsWithDetails = await Promise.all(
      reviews.map(async (review) => {
        const reviewer = await ctx.db.get(review.reviewerId);
        const property = await ctx.db.get(review.propertyId);

        return {
          ...review,
          reviewer: reviewer
            ? {
                _id: reviewer._id,
                firstName: reviewer.firstName,
                lastName: reviewer.lastName,
                profileImageId: reviewer.profileImageId,
              }
            : null,
          property: property
            ? {
                _id: property._id,
                title: property.title,
              }
            : null,
        };
      })
    );

    return reviewsWithDetails.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Get average rating for a user
export const getUserRating = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query('reviews')
      .withIndex('by_reviewee', (q) => q.eq('revieweeId', args.userId))
      .collect();

    if (reviews.length === 0) {
      return { averageRating: null, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
    };
  },
});

// Create a review
export const createReview = mutation({
  args: {
    propertyId: v.id('properties'),
    revieweeId: v.id('users'),
    reviewType: v.union(
      v.literal('landlord_review'),
      v.literal('tenant_review'),
      v.literal('property_review')
    ),
    rating: v.number(),
    comment: v.optional(v.string()),
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

    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if property exists
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // Check if user has completed a transaction for this property
    const transactions = await ctx.db
      .query('transactions')
      .withIndex('by_property', (q) => q.eq('propertyId', args.propertyId))
      .filter((q) =>
        q.and(
          q.eq(q.field('paymentStatus'), 'completed'),
          q.or(q.eq(q.field('renterId'), user._id), q.eq(q.field('landlordId'), user._id))
        )
      )
      .first();

    if (!transactions && user.role !== 'admin') {
      throw new Error('You can only review properties you have rented or owned');
    }

    // Check if already reviewed
    const existingReview = await ctx.db
      .query('reviews')
      .withIndex('by_property', (q) => q.eq('propertyId', args.propertyId))
      .filter((q) =>
        q.and(q.eq(q.field('reviewerId'), user._id), q.eq(q.field('reviewType'), args.reviewType))
      )
      .first();

    if (existingReview) {
      throw new Error('You have already submitted a review of this type');
    }

    const reviewId = await ctx.db.insert('reviews', {
      propertyId: args.propertyId,
      reviewerId: user._id,
      revieweeId: args.revieweeId,
      reviewType: args.reviewType,
      rating: args.rating,
      comment: args.comment,
    });

    // Notify the reviewee
    await ctx.db.insert('notifications', {
      userId: args.revieweeId,
      notificationType: 'new_review',
      title: 'New Review',
      message: `${user.firstName ?? 'Someone'} left you a ${args.rating}-star review`,
      data: { reviewId, propertyId: args.propertyId },
      isRead: false,
    });

    return reviewId;
  },
});

// Update a review
export const updateReview = mutation({
  args: {
    reviewId: v.id('reviews'),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
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

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.reviewerId !== user._id && user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    // Validate rating if provided
    if (args.rating !== undefined && (args.rating < 1 || args.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const updates: Record<string, unknown> = {};
    if (args.rating !== undefined) updates.rating = args.rating;
    if (args.comment !== undefined) updates.comment = args.comment;

    await ctx.db.patch(args.reviewId, updates);
    return args.reviewId;
  },
});

// Delete a review
export const deleteReview = mutation({
  args: { reviewId: v.id('reviews') },
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

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.reviewerId !== user._id && user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.reviewId);
    return args.reviewId;
  },
});
