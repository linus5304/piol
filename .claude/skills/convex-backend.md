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

Use utility functions from `./utils/auth` and `./utils/authorization`:

```typescript
import { getCurrentUser } from './utils/auth';
import { assertOwner, assertLandlordOrAdmin } from './utils/authorization';

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    // 1. Get authenticated user (throws if not authenticated)
    const { user } = await getCurrentUser(ctx);

    // 2. Optional: Check role if needed
    assertLandlordOrAdmin(user.role);

    // 3. Insert
    return await ctx.db.insert('tableName', { ...args, userId: user._id });
  },
});
```

### Auth Utilities (`./utils/auth.ts`)
- `getCurrentUser(ctx)` - Returns `{ identity, user }`, throws if not authenticated
- `getCurrentUserOrNull(ctx)` - Returns `{ identity, user }` or null (for queries)

### Authorization Utilities (`./utils/authorization.ts`)
- `assertOwner(resourceOwnerId, userId, userRole)` - Throws if not owner/admin
- `assertRole(userRole, ['admin', 'verifier'])` - Throws if not one of roles
- `assertAdmin(userRole)` / `assertAdminOrVerifier(userRole)` / `assertLandlordOrAdmin(userRole)`
- `hasRole(userRole, ['admin'])` - Returns boolean (for queries)
- `isOwnerOrAdmin(ownerId, userId, userRole)` - Returns boolean

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
