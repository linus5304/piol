---
paths:
  - "packages/convex/**/*.ts"
---

# Convex Backend Rules

- NEVER use `.filter()` on query builders. Define an index in `schema.ts` and use `.withIndex()`. JS `Array.filter()` after `.collect()` is fine.
- ALWAYS include `returns:` validators on all Convex functions. Use `v.null()` for void returns.
- NEVER omit auth checks. Use `getCurrentUser(ctx)` from `convex/utils/auth.ts` (throws if unauthed). For optional auth: `getCurrentUserOrNull(ctx)`.
- Authorization helpers live in `convex/utils/authorization.ts`: `assertOwner`, `assertRole`, `assertLandlordOrAdmin`, `assertAdmin`, `assertAdminOrVerifier`.
- Use `internalQuery`/`internalMutation`/`internalAction` for functions not exposed to the client.
- Index naming: `by_field1_and_field2` matching the indexed fields.
- Always paginate queries (max 100 items).
- Every table needs indexes for all query paths — no table scans.
