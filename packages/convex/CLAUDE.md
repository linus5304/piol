# Convex Backend

Schema: `convex/schema.ts` | Auth: `convex/utils/auth.ts` | Authorization: `convex/utils/authorization.ts`

@../../docs/database-schema.md
@../../docs/api.md

## Key Files
- `properties.ts` — largest module (31KB), property CRUD + search
- `users.ts` — user management (24KB)
- `transactions.ts` — payment/transaction logic (18KB)
- `actions/payments.ts` — Orange Money, MTN MoMo integration

## Testing
```bash
cd packages/convex && bunx vitest run
```

## Schema Validation
```bash
cd packages/convex && bunx convex dev --once
```
