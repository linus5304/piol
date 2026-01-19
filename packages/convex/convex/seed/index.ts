import { type MutationCtx, internalMutation } from '../_generated/server';
import { clearProperties, seedProperties } from './properties';
import { clearReviews, seedReviews } from './reviews';
import { clearUsers, seedUsers } from './users';

/**
 * Seeds the database with realistic Cameroon housing data.
 * Run with: npx convex run seed/index:seed
 */
export const seed = internalMutation({
  handler: async (ctx: MutationCtx) => {
    console.log('🌱 Starting database seed...\n');

    console.log('📦 Seeding users...');
    const seededUsers = await seedUsers(ctx);
    console.log(`\n✅ Seeded ${seededUsers.length} users\n`);

    console.log('🏠 Seeding properties...');
    const seededProperties = await seedProperties(ctx, seededUsers);
    console.log(`\n✅ Seeded ${seededProperties.length} properties\n`);

    console.log('⭐ Seeding reviews...');
    const seededReviews = await seedReviews(ctx, seededProperties, seededUsers);
    console.log(`\n✅ Seeded ${seededReviews.length} reviews\n`);

    console.log('🎉 Database seeded successfully!');

    return {
      users: seededUsers.length,
      properties: seededProperties.length,
      reviews: seededReviews.length,
    };
  },
});

/**
 * Resets the database by clearing seed data and re-seeding.
 * Run with: npx convex run seed/index:reset
 */
export const reset = internalMutation({
  handler: async (ctx: MutationCtx) => {
    console.log('🧹 Resetting database...\n');

    console.log('🗑️ Clearing reviews...');
    await clearReviews(ctx);

    console.log('🗑️ Clearing properties...');
    await clearProperties(ctx);

    console.log('🗑️ Clearing users...');
    await clearUsers(ctx);

    console.log('\n✅ Database cleared\n');

    console.log('🌱 Re-seeding...\n');

    const seededUsers = await seedUsers(ctx);
    const seededProperties = await seedProperties(ctx, seededUsers);
    const seededReviews = await seedReviews(ctx, seededProperties, seededUsers);

    console.log('🎉 Database reset complete!');

    return {
      users: seededUsers.length,
      properties: seededProperties.length,
      reviews: seededReviews.length,
    };
  },
});

/**
 * Clears all seed data without re-seeding.
 * Run with: npx convex run seed/index:clear
 */
export const clear = internalMutation({
  handler: async (ctx: MutationCtx) => {
    console.log('🧹 Clearing seed data...\n');

    await clearReviews(ctx);
    await clearProperties(ctx);
    await clearUsers(ctx);

    console.log('✅ Seed data cleared!');
  },
});
