# Piol Authentication System

## Overview

Piol uses **Clerk** for authentication with **Convex** as the backend database. The system supports multiple user roles with different permissions.

## User Types

### 1. Renter (`renter`)
- **Purpose**: Browse and rent properties
- **Capabilities**:
  - Browse all verified properties
  - Save/favorite properties
  - Contact landlords via messaging
  - Make rental payments (MTN MoMo, Orange Money)
  - View payment history
  - Manage profile settings

### 2. Landlord (`landlord`)
- **Purpose**: List and manage rental properties
- **Capabilities**:
  - All renter capabilities
  - Create and manage property listings
  - Upload property images and documents
  - Submit properties for verification
  - Receive rental payments
  - View tenant inquiries and messages
  - Dashboard with property analytics

### 3. Verifier (`verifier`)
- **Purpose**: Verify properties and landlord documents
- **Capabilities**:
  - Access verification queue
  - Review property documents
  - Approve/reject property listings
  - Verify landlord identity documents
  - Add verification notes

### 4. Admin (`admin`)
- **Purpose**: Full system administration
- **Capabilities**:
  - All verifier capabilities
  - User management
  - Platform settings
  - View all transactions
  - Analytics dashboard
  - Content moderation

---

## Environment Variables Required

Create a `.env.local` file in the **root** and `apps/web/` directory:

```bash
# Clerk Authentication (Required for auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/onboarding

# Convex Backend (Required for data)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-deployment

# Optional: Sentry for error tracking
SENTRY_AUTH_TOKEN=your_sentry_token
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

---

## Authentication Flow

### Sign Up Flow

```
┌─────────────────┐
│   Landing Page  │
│  (Choose Role)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    /sign-up     │
│  ?role=renter   │
│  or ?role=      │
│    landlord     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Clerk Sign Up  │
│  (Email/OAuth)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Clerk Webhook   │
│ → Creates user  │
│   in Convex DB  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   /dashboard/   │
│   onboarding    │
│ (Profile Setup) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   /dashboard    │
│  (Home Screen)  │
└─────────────────┘
```

### Sign In Flow

```
┌─────────────────┐
│    /sign-in     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Clerk Sign In  │
│  (Email/OAuth)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Convex DB │
│  for user data  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌─────────┐
│Existing│ │   New   │
│  User  │ │  User   │
└───┬────┘ └────┬────┘
    │           │
    ▼           ▼
┌────────┐ ┌─────────┐
│/dashbd │ │/onboard │
└────────┘ └─────────┘
```

---

## Setting Up Clerk

### 1. Create Clerk Application

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose authentication methods:
   - ✅ Email (recommended)
   - ✅ Phone (for Cameroon market)
   - ✅ Google OAuth
   - ✅ Facebook OAuth (popular in Cameroon)

### 2. Configure Webhooks

In Clerk Dashboard → Webhooks:

1. Add endpoint: `https://your-convex-url.convex.site/clerk-webhook`
2. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`

### 3. Get API Keys

From Clerk Dashboard → API Keys:
- Copy `Publishable Key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Copy `Secret Key` → `CLERK_SECRET_KEY`

---

## Setting Up Convex

### 1. Initialize Convex

```bash
bunx convex dev
```

### 2. Set Clerk Webhook Secret

```bash
bunx convex env set CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

### 3. Deploy Functions

```bash
bunx convex deploy
```

---

## Database Schema (Convex)

### Users Table

```typescript
users: defineTable({
  clerkId: v.string(),           // Clerk user ID
  email: v.string(),             // User email
  phone: v.optional(v.string()), // Phone number (237...)
  role: v.union(
    v.literal('renter'),
    v.literal('landlord'),
    v.literal('admin'),
    v.literal('verifier')
  ),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  languagePreference: v.union(v.literal('fr'), v.literal('en')),
  emailVerified: v.boolean(),
  phoneVerified: v.boolean(),
  idVerified: v.boolean(),       // ID document verified
  profileImageUrl: v.optional(v.string()),
  lastLogin: v.optional(v.number()),
  isActive: v.boolean(),
  onboardingCompleted: v.optional(v.boolean()),
})
```

---

## Testing Authentication

### Manual Testing Checklist

#### Without Clerk Configured (Demo Mode)

- [x] `/` - Landing page loads
- [x] `/properties` - Property listing loads
- [x] `/properties/[id]` - Property detail loads
- [x] `/sign-up` - Shows demo message
- [x] `/sign-in` - Shows demo message
- [x] `/dashboard` - Accessible (mock data)

#### With Clerk Configured

1. **Sign Up as Renter**
   ```
   URL: /sign-up?role=renter
   Expected: Clerk sign-up form, redirect to onboarding
   ```

2. **Sign Up as Landlord**
   ```
   URL: /sign-up?role=landlord
   Expected: Clerk sign-up form, redirect to onboarding
   ```

3. **Sign In**
   ```
   URL: /sign-in
   Expected: Clerk sign-in form, redirect to dashboard
   ```

4. **Protected Routes**
   ```
   /dashboard/* - Requires auth
   /dashboard/properties/new - Requires landlord role
   ```

---

## Webhook Handler (Convex)

The webhook handler in `packages/convex/http.ts` processes Clerk events:

```typescript
// packages/convex/http.ts
import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';

const http = httpRouter();

// Clerk webhook endpoint
http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Verify webhook signature
    // Process user.created, user.updated, user.deleted
    // Sync user data to Convex
  }),
});

export default http;
```

---

## Quick Start Commands

```bash
# 1. Install dependencies
bun install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your keys

# 3. Start Convex (in separate terminal)
bun run dev:convex

# 4. Start web app
bun run dev

# 5. Open browser
open http://localhost:3000
```

---

## Troubleshooting

### "useSession can only be used within ClerkProvider"

This error occurs when Clerk hooks are used outside the provider. Solutions:
1. Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
2. Use safe hooks from `@/hooks/use-safe-auth`

### "Clerk not configured - running in demo mode"

This is expected when Clerk keys aren't set. Add your Clerk keys to `.env.local`.

### Webhook not syncing users

1. Check webhook URL is correct in Clerk dashboard
2. Verify `CLERK_WEBHOOK_SECRET` is set in Convex
3. Check Convex logs: `bunx convex logs`
