import type { MutationCtx, QueryCtx } from '../_generated/server';

/**
 * Get the current authenticated user from the context.
 * Throws if not authenticated or user not found.
 *
 * @example
 * const { identity, user } = await getCurrentUser(ctx);
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
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

  return { identity, user };
}

/**
 * Get the current authenticated user from the context, returning null if not found.
 * Use this for queries that should return empty results for unauthenticated users.
 *
 * @example
 * const result = await getCurrentUserOrNull(ctx);
 * if (!result) return [];
 * const { user } = result;
 */
export async function getCurrentUserOrNull(ctx: QueryCtx | MutationCtx) {
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

  return { identity, user };
}

/**
 * Require authentication for a query, returning a default value if not authenticated.
 * Useful for queries that should return a specific default for unauthenticated users.
 *
 * @example
 * const user = await requireAuthOrDefault(ctx, null);
 * if (!user) return null;
 */
export async function requireAuthOrDefault<T>(
  ctx: QueryCtx | MutationCtx,
  defaultValue: T
): Promise<
  | {
      identity: NonNullable<Awaited<ReturnType<typeof ctx.auth.getUserIdentity>>>;
      user: NonNullable<Awaited<ReturnType<typeof getCurrentUserOrNull>>>['user'];
    }
  | T
> {
  const result = await getCurrentUserOrNull(ctx);
  if (!result) {
    return defaultValue;
  }
  return result;
}
