---
name: convex-mutation
description: Generate Convex mutation with auth boilerplate. Use when creating new mutations.
user-invocable: true
---

# Generate Convex Mutation

When creating a new Convex mutation, use this template that leverages the auth and authorization utilities.

## Template

```typescript
import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { getCurrentUser } from './utils/auth';
import { assertOwner, assertRole, assertLandlordOrAdmin } from './utils/authorization';

export const yourMutation = mutation({
  args: {
    // Define your args using v validators
    resourceId: v.id('tableName'),
    field: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Get authenticated user
    const { user } = await getCurrentUser(ctx);

    // 2. (Optional) Check role if needed
    // assertLandlordOrAdmin(user.role);  // For landlord/admin only
    // assertRole(user.role, ['admin', 'verifier']);  // For specific roles

    // 3. Get resource and check ownership if needed
    const resource = await ctx.db.get(args.resourceId);
    if (!resource) {
      throw new Error('Resource not found');
    }

    // 4. (Optional) Check ownership
    // assertOwner(resource.ownerId, user._id, user.role);

    // 5. Perform the mutation
    await ctx.db.patch(args.resourceId, {
      field: args.field,
      updatedAt: Date.now(),
    });

    return args.resourceId;
  },
});
```

## Available Auth Utilities

### From `./utils/auth`
- `getCurrentUser(ctx)` - Get authenticated user, throws if not authenticated
- `getCurrentUserOrNull(ctx)` - Get user or null (for queries that allow unauthenticated)

### From `./utils/authorization`
- `assertOwner(ownerId, userId, role, options)` - Check resource ownership
- `assertRole(role, allowedRoles)` - Check user has one of allowed roles
- `assertAdmin(role)` - Admin only
- `assertAdminOrVerifier(role)` - Admin or verifier
- `assertLandlordOrAdmin(role)` - Landlord or admin

### From `./utils/data`
- `enrichPropertiesWithLandlord(properties, ctx)` - Add landlord info to properties
- `getLandlordInfo(landlordId, ctx)` - Get landlord display info
- `getBasicUserInfo(userId, ctx)` - Get basic user display info

## Checklist

- [ ] Uses `getCurrentUser(ctx)` for auth (not manual identity check)
- [ ] Has appropriate authorization check (role or ownership)
- [ ] Validates resource exists before operating on it
- [ ] Returns appropriate value (id or result)
- [ ] Has proper error messages
