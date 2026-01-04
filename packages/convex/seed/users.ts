import type { MutationCtx } from '../_generated/server';
import usersData from './data/users.json';

export async function seedUsers(ctx: MutationCtx) {
  const seededUsers = [];

  for (const userData of usersData) {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', userData.clerkId))
      .unique();

    if (!existingUser) {
      const userId = await ctx.db.insert('users', {
        ...userData,
        lastLogin: Date.now(),
      } as any);
      seededUsers.push({ id: userId, ...userData });
      console.log(`  ✓ Created user: ${userData.firstName} ${userData.lastName}`);
    } else {
      seededUsers.push({ id: existingUser._id, ...userData });
      console.log(`  ○ User exists: ${userData.firstName} ${userData.lastName}`);
    }
  }

  return seededUsers;
}

export async function clearUsers(ctx: MutationCtx) {
  const seedUsers = await ctx.db
    .query('users')
    .filter((q) =>
      q.or(...usersData.map((u) => q.eq(q.field('clerkId'), u.clerkId)))
    )
    .collect();

  for (const user of seedUsers) {
    await ctx.db.delete(user._id);
  }

  console.log(`  ✓ Cleared ${seedUsers.length} seed users`);
}

