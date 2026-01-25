---
name: convex-backend
description: Convex backend development patterns. Use for mutations, queries, schema changes.
---

# Convex Backend Patterns

## Schema Changes
Edit `packages/convex/convex/schema.ts`. Every table needs:
- Indexes for all query paths (no table scans)
- Validators using Convex's `v` namespace

## Queries
```typescript
export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query('tableName');
    if (args.status) {
      q = q.withIndex('by_status', q => q.eq('status', args.status));
    }
    return await q.take(100); // Always paginate
  },
});
```

## Mutations
```typescript
export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    // 1. Auth check FIRST
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    // 2. Get user
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    // 3. Insert
    return await ctx.db.insert('tableName', { ...args, userId: user._id });
  },
});
```

## Verification
```bash
cd packages/convex && bunx vitest run           # Run tests
cd packages/convex && bunx convex dev --once    # Verify schema
```

## Checklist
- [ ] Indexes for all query paths
- [ ] Auth check first in mutations
- [ ] Pagination (max 100 items)
- [ ] Tests in `__tests__/`
