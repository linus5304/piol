import type { MutationCtx } from '../_generated/server';
import usersData from './data/users.json';

export async function seedUsers(ctx: MutationCtx) {
  const seededUsers = [];

  for (const userData of usersData) {
    // First, try to find existing user by email (real users synced from Clerk)
    const existingByEmail = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', userData.email))
      .unique();

    if (existingByEmail) {
      // Use existing real user - update role to landlord if needed for seed
      if (userData.role === 'landlord' && existingByEmail.role !== 'landlord') {
        await ctx.db.patch(existingByEmail._id, { role: 'landlord' as const });
        console.log(`  ✓ Updated ${userData.firstName} to landlord role`);
      }
      seededUsers.push({ id: existingByEmail._id, ...existingByEmail, role: userData.role });
      console.log(
        `  ○ Using existing user: ${existingByEmail.firstName} ${existingByEmail.lastName} (${userData.email})`
      );
      continue;
    }

    // For test users with clerkId, check if already seeded
    if ((userData as any).clerkId) {
      const existingByClerkId = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', (userData as any).clerkId))
        .unique();

      if (existingByClerkId) {
        seededUsers.push({ id: existingByClerkId._id, ...userData });
        console.log(`  ○ User exists: ${userData.firstName} ${userData.lastName}`);
        continue;
      }

      // Create test user (these won't be usable for auth, but good for display)
      const userId = await ctx.db.insert('users', {
        ...userData,
        lastLogin: Date.now(),
      } as any);
      seededUsers.push({ id: userId, ...userData });
      console.log(`  ✓ Created test user: ${userData.firstName} ${userData.lastName}`);
    } else {
      // User without clerkId and not found by email - skip
      console.log(
        `  ⚠ Skipped ${userData.firstName} ${userData.lastName} - no clerkId and email not found`
      );
    }
  }

  return seededUsers;
}

export async function clearUsers(ctx: MutationCtx) {
  // Only delete test seed users (those with clerkId starting with "user_seed_")
  // Never delete real users synced from Clerk
  const testClerkIds = usersData
    .filter((u) => (u as any).clerkId?.startsWith('user_seed_'))
    .map((u) => (u as any).clerkId);

  if (testClerkIds.length === 0) {
    console.log('  ○ No test users to clear');
    return;
  }

  const seedUsers = await ctx.db
    .query('users')
    .filter((q) => q.or(...testClerkIds.map((id) => q.eq(q.field('clerkId'), id))))
    .collect();

  for (const user of seedUsers) {
    await ctx.db.delete(user._id);
  }

  console.log(`  ✓ Cleared ${seedUsers.length} test seed users (real users preserved)`);
}
