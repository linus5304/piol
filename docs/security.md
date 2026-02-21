# Piol Security Architecture

Documents the security measures in place after the Phase 1-2 hardening (PR #52, #53).

---

## Authentication Flow

```
Browser -> Clerk (OAuth) -> JWT -> Convex (verify via auth.getUserIdentity())
                         -> Next.js proxy (clerkMiddleware)
```

1. **Clerk** handles sign-up/sign-in, issues JWTs with `convex` template
2. **Next.js proxy** (`apps/web/src/proxy.ts`) runs `clerkMiddleware` with `auth.protect()` on non-public routes, redirecting to `/sign-in`
3. **Convex backend** verifies JWTs via `ctx.auth.getUserIdentity()` and resolves users via `by_clerk_id` index

### Auth Utilities

- `getCurrentUser(ctx)` -- throws if unauthenticated or user not found
- `getCurrentUserOrNull(ctx)` -- returns null for unauthenticated (used in queries that return empty results)
- `assertOwner(resourceOwnerId, userId, userRole)` -- throws if not owner or admin
- `assertRole(userRole, allowedRoles)` -- throws if missing required role
- `hasRole(userRole, allowedRoles)` -- non-throwing boolean check
- `isOwnerOrAdmin(resourceOwnerId, userId, userRole)` -- non-throwing boolean check

## Route Protection

### Public Routes (no auth required)

- `/`, `/properties(.*)`, `/about`, `/contact`, `/help`, `/changelog`, `/terms`, `/privacy`
- `/sign-in(.*)`, `/sign-up(..*)`, `/api/webhooks(.*)`

### Protected Routes (Clerk auth required)

- `/dashboard/*` -- redirects to `/sign-in` if unauthenticated

### Security Headers (applied to all responses)

- `Content-Security-Policy` -- restrictive CSP (self + Clerk + Convex + Sentry + Vercel)
- `Strict-Transport-Security` -- HSTS with 2-year max-age, includeSubDomains, preload
- `X-Frame-Options: DENY` -- prevent clickjacking
- `X-Content-Type-Options: nosniff` -- prevent MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` -- camera/microphone disabled, geolocation self-only

## Backend Authorization

### Payment Functions

All payment actions use internal/public wrapper pattern:

| Public Action | Auth Check | Internal Action |
|---------------|------------|-----------------|
| `processPayment` | Must be the renter on the transaction | `internalProcessPayment` |
| `checkPaymentStatus` | Must be renter or landlord on the transaction | `internalCheckPaymentStatus` |
| `releaseEscrowFunds` | Must be admin | `internalReleaseEscrowFunds` |

- `updateTransactionStatus` -- `internalMutation` (not callable from client)
- `internalGetTransaction` -- `internalQuery` (not callable from client)
- `internalGetUserByClerkId` -- `internalQuery` (not callable from client)

### Mutation Authorization Summary

| Mutation | Who Can Call |
|----------|-------------|
| `createTransaction` | Any authenticated user (as renter) |
| `releaseEscrow` | Landlord on transaction or admin |
| `requestRefund` | Renter on transaction |
| `createProperty` | Landlord or admin role |
| `updateProperty` | Property owner or admin |
| `archiveProperty` | Property owner or admin |
| `submitForVerification` | Property owner (not admin) |
| `updatePropertyStatus` | Admin or verifier role |
| `sendMessage` | Any authenticated user |
| `createReview` | Authenticated user with completed transaction |
| `deleteFile` | File owner (property landlord) or admin |

## Webhook Verification

### Clerk Webhook (`/clerk-webhook`)

- **Svix signature verification** -- verifies `svix-id`, `svix-timestamp`, `svix-signature` headers against `CLERK_WEBHOOK_SECRET`
- Returns 401 if headers missing or signature invalid

### MTN MoMo Webhook (`/mtn-momo-webhook`)

- **Bearer token verification** -- checks `Authorization: Bearer <MTN_MOMO_WEBHOOK_SECRET>` header
- Graceful degradation: processes without verification if env var not set (for initial setup)

### Orange Money Webhook (`/orange-money-webhook`)

- **Bearer token verification** -- checks `Authorization: Bearer <ORANGE_MONEY_WEBHOOK_SECRET>` header
- Graceful degradation: processes without verification if env var not set

### Required Environment Variables

Set in Convex Dashboard > Settings > Environment Variables:

- `CLERK_WEBHOOK_SECRET` -- Clerk Svix webhook signing secret
- `MTN_MOMO_WEBHOOK_SECRET` -- shared secret for MTN callback auth
- `ORANGE_MONEY_WEBHOOK_SECRET` -- shared secret for Orange callback auth

## Input Validation

### Amounts

- Transaction `amount` must be > 0
- Property `rentAmount` must be > 0
- `cautionMonths` must be >= 0 (when provided)
- `upfrontMonths` must be >= 0 (when provided)
- Landlord ID must match property owner on transaction creation

### String Lengths

- Property title: max 200 characters
- Property description: max 5000 characters
- Message text: 1-2000 characters (non-empty)
- Review comment: max 1000 characters

### Phone Numbers

- Cameroon format: `237XXXXXXXXX` (12 digits) or `XXXXXXXXX` (9 digits)
- Validated on transaction creation

### Ratings

- Must be between 1 and 5
- Must be a whole number (`Number.isInteger`)

### Transaction References

- Generated using `crypto.randomUUID()` (not `Math.random()`)
- Format: `TXN-{timestamp_base36}-{uuid_8chars}`

## File Access Control

- `generateUploadUrl` -- requires authentication
- `getFileUrl` / `getFileUrls` -- public (Convex storage URLs are signed and time-limited)
- `deleteFile` -- requires authentication + ownership (property landlord or admin)

## TypeScript Strict Mode

- `packages/convex/tsconfig.json` has `strict: true` and `noImplicitAny: true`
- All Convex backend code compiles cleanly under strict mode

## Known Limitations

- Webhook bearer tokens are a fallback approach; MTN MoMo and Orange Money may support provider-specific HMAC signatures that should be adopted when documented
- No rate limiting on mutations (Convex doesn't have built-in rate limiting)
- No CSRF protection beyond Clerk's built-in protections
- `getFileUrl`/`getFileUrls` are public queries -- relies on Convex signed URL expiration
- `files.ts` `deleteFile` does a full table scan of properties to check ownership (acceptable at current scale)
