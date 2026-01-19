import type { MutationCtx } from '../_generated/server';
import reviewsData from './data/reviews.json';

type ReviewData = (typeof reviewsData)[number];

export async function seedReviews(
  ctx: MutationCtx,
  seededProperties: Array<{ id: any; index: number }>,
  seededUsers: Array<{ id: any; role: string }>
) {
  const renters = seededUsers.filter((u) => u.role === 'renter');
  const seededReviews = [];

  for (const reviewData of reviewsData) {
    const property = seededProperties.find((p) => p.index === reviewData.propertyIndex);
    const reviewer = renters[reviewData.reviewerIndex % renters.length];

    if (!property || !reviewer) {
      console.log('  ○ Skipping review: property or reviewer not found');
      continue;
    }

    // Check if review already exists
    const existingReview = await ctx.db
      .query('reviews')
      .withIndex('by_property', (q) => q.eq('propertyId', property.id))
      .filter((q) => q.eq(q.field('reviewerId'), reviewer.id))
      .unique();

    if (!existingReview) {
      // Get the property's landlord for revieweeId
      const propertyDoc = await ctx.db.get(property.id);
      if (!propertyDoc) continue;

      const reviewId = await ctx.db.insert('reviews', {
        propertyId: property.id,
        reviewerId: reviewer.id,
        revieweeId: propertyDoc.landlordId,
        reviewType: 'property_review',
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      seededReviews.push({ id: reviewId, ...reviewData });
      console.log(`  ✓ Created review for property ${reviewData.propertyIndex}`);
    } else {
      seededReviews.push({ id: existingReview._id, ...reviewData });
      console.log(`  ○ Review exists for property ${reviewData.propertyIndex}`);
    }
  }

  return seededReviews;
}

export async function clearReviews(ctx: MutationCtx) {
  // Get all reviews that match our seed data patterns
  const allReviews = await ctx.db.query('reviews').collect();

  // Filter to reviews that have seed-like comments (French positive reviews)
  const seedReviews = allReviews.filter((r) => reviewsData.some((rd) => rd.comment === r.comment));

  for (const review of seedReviews) {
    await ctx.db.delete(review._id);
  }

  console.log(`  ✓ Cleared ${seedReviews.length} seed reviews`);
}
