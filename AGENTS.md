# Piol — System Design & Agent Instructions

> Master guide for AI agents and developers working on the Cameroon Housing Marketplace

## Quick Links

| Document | Scope |
|----------|-------|
| [AGENTS.backend.md](./AGENTS.backend.md) | Convex backend, schema, auth, payments |
| [AGENTS.frontend.md](./AGENTS.frontend.md) | Next.js web app |
| [AGENTS.mobile.md](./AGENTS.mobile.md) | Expo/React Native mobile app |
| [.cursor/rules.md](./.cursor/rules.md) | Code style, CI/CD, git hygiene |

---

## 🤖 Agent Development Harness

> Based on [Ralph Wiggum technique](https://ghuntley.com/ralph/) and [Anthropic's long-running agent harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

### Session Workflow

**At session start:**
```bash
# 1. Run environment check & smoke test
./.agent/init.sh

# 2. Read progress from last session
cat .agent/progress.md

# 3. Check for blockers or decisions
cat .agent/scratchpad.md

# 4. Find next feature to work on
cat .agent/features.json | jq '[.features[] | select(.status == "failing")] | sort_by(.priority) | .[0]'
```

**During session:**
- Work on **ONE feature at a time**
- Test end-to-end before marking as passing
- Commit after each completed feature
- Update `scratchpad.md` with decisions/blockers

**At session end:**
```bash
# 1. Update features.json with status changes
# 2. Add entry to progress.md
# 3. Commit with descriptive message
# 4. Ensure code is in mergeable state
```

### Harness Files

| File | Purpose |
|------|---------|
| [.agent/features.json](./.agent/features.json) | 130+ granular features with pass/fail status |
| [.agent/progress.md](./.agent/progress.md) | Session handoff log — what was done, what's next |
| [.agent/scratchpad.md](./.agent/scratchpad.md) | Current context, blockers, decisions |
| [.agent/init.sh](./.agent/init.sh) | Environment check & smoke test script |

### Key Principles

1. **Incremental Progress** — One feature per focus, not everything at once
2. **Clean Handoffs** — Always leave code in mergeable state
3. **Track Explicitly** — Update features.json and progress.md
4. **Test Before Marking Done** — End-to-end verification, not just "code looks right"
5. **Commit Constantly** — Every feature = revertable checkpoint

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
├─────────────────────────────────┬───────────────────────────────────────────┤
│         apps/web                │              apps/mobile                   │
│      (Next.js 16)               │            (Expo Router)                   │
│  ┌───────────────────────┐      │      ┌───────────────────────┐            │
│  │   Server Components   │      │      │    React Native       │            │
│  │   Client Components   │      │      │    Native Modules     │            │
│  │   App Router          │      │      │    Tab Navigation     │            │
│  └───────────┬───────────┘      │      └───────────┬───────────┘            │
│              │                  │                  │                         │
│              └──────────────────┼──────────────────┘                         │
│                                 │                                            │
│                    ┌────────────┴────────────┐                               │
│                    │   Convex React Client   │                               │
│                    │   (Real-time Sync)      │                               │
│                    └────────────┬────────────┘                               │
└─────────────────────────────────┼───────────────────────────────────────────┘
                                  │
                                  │ WebSocket / HTTP
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────┐
│                         BACKEND (packages/convex)                            │
├─────────────────────────────────┼───────────────────────────────────────────┤
│                    ┌────────────┴────────────┐                               │
│                    │     Convex Runtime      │                               │
│                    │  (Serverless Functions) │                               │
│                    └────────────┬────────────┘                               │
│                                 │                                            │
│    ┌────────────────────────────┼────────────────────────────┐               │
│    │                            │                            │               │
│    ▼                            ▼                            ▼               │
│ ┌──────────┐             ┌──────────┐              ┌──────────────┐          │
│ │ Queries  │             │Mutations │              │   Actions    │          │
│ │ (Read)   │             │ (Write)  │              │ (External)   │          │
│ └────┬─────┘             └────┬─────┘              └──────┬───────┘          │
│      │                        │                          │                   │
│      └────────────────────────┴──────────────────────────┘                   │
│                               │                                              │
│                    ┌──────────┴──────────┐                                   │
│                    │   Convex Database   │                                   │
│                    │   (Document Store)  │                                   │
│                    └─────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP/Webhooks
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                     │
├─────────────────────────────────┼───────────────────────────────────────────┤
│    ┌────────────────────────────┼────────────────────────────┐               │
│    │                            │                            │               │
│    ▼                            ▼                            ▼               │
│ ┌──────────┐             ┌──────────────┐            ┌──────────────┐        │
│ │  Clerk   │             │   MTN MoMo   │            │ Orange Money │        │
│ │  (Auth)  │             │  (Payments)  │            │  (Payments)  │        │
│ └──────────┘             └──────────────┘            └──────────────┘        │
│                                                                              │
│ ┌──────────┐             ┌──────────────┐            ┌──────────────┐        │
│ │  Sentry  │             │ Convex Files │            │     CDN      │        │
│ │ (Errors) │             │  (Storage)   │            │   (Images)   │        │
│ └──────────┘             └──────────────┘            └──────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Property Listing Flow

```
Landlord creates listing
         │
         ▼
┌─────────────────┐
│  Draft Status   │  ← Can edit, add images
└────────┬────────┘
         │ Submit for verification
         ▼
┌─────────────────┐
│    Pending      │  ← Waiting for verifier
│  Verification   │
└────────┬────────┘
         │ Verifier approves
         ▼
┌─────────────────┐
│    Verified     │  ← Ready to publish
└────────┬────────┘
         │ Landlord activates
         ▼
┌─────────────────┐
│     Active      │  ← Visible to renters
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌────────┐
│Rented │ │Archived│
└───────┘ └────────┘
```

### 2. Payment Flow

```
Renter initiates payment
         │
         ▼
┌─────────────────┐
│    Pending      │  ← Transaction created
└────────┬────────┘
         │
         ├─────────────────────────────────────────┐
         │                                         │
         ▼                                         ▼
┌─────────────────┐                     ┌─────────────────┐
│    MTN MoMo     │                     │  Orange Money   │
│   USSD Prompt   │                     │   Web Redirect  │
└────────┬────────┘                     └────────┬────────┘
         │                                       │
         └───────────────┬───────────────────────┘
                         │ User confirms
                         ▼
              ┌─────────────────┐
              │   Processing    │  ← Waiting for callback
              └────────┬────────┘
                       │ Webhook received
                       ▼
              ┌─────────────────┐
              │    Completed    │  ← Funds in escrow
              │   (Escrow Held) │
              └────────┬────────┘
                       │ Admin releases (after move-in)
                       ▼
              ┌─────────────────┐
              │    Released     │  ← 95% to landlord
              │ (5% commission) │     5% platform fee
              └─────────────────┘
```

### 3. Messaging Flow

```
Renter views property
         │
         ▼
┌─────────────────┐
│ Contact Button  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     Conversation Created            │
│  ID: {renterId}_{landlordId}_{propId}│
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Send Message   │────▶│  Notification   │
│   (Mutation)    │     │    Created      │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Real-time Sync  │  ← Recipient sees instantly
│   (Convex)      │
└─────────────────┘
```

---

## Domain Model

### Core Entities

```
┌─────────────┐         ┌─────────────┐
│    Users    │         │  Properties │
├─────────────┤         ├─────────────┤
│ _id         │────┐    │ _id         │
│ clerkId     │    │    │ landlordId  │───┐
│ email       │    │    │ title       │   │
│ phone       │    │    │ description │   │
│ role        │    │    │ propertyType│   │
│ firstName   │    │    │ rentAmount  │   │
│ lastName    │    │    │ city        │   │
│ language    │    │    │ neighborhood│   │
│ idVerified  │    │    │ status      │   │
└─────────────┘    │    │ verification│   │
                   │    └─────────────┘   │
                   │           │          │
                   │           │          │
                   ▼           ▼          │
          ┌─────────────────────────┐     │
          │      Transactions       │     │
          ├─────────────────────────┤     │
          │ _id                     │     │
          │ propertyId ─────────────┼─────┘
          │ renterId ───────────────┼──┐
          │ landlordId ─────────────┼──┤
          │ amount                  │  │
          │ paymentMethod           │  │
          │ paymentStatus           │  │
          │ escrowStatus            │  │
          └─────────────────────────┘  │
                                       │
┌─────────────┐    ┌─────────────┐     │
│  Messages   │    │   Reviews   │     │
├─────────────┤    ├─────────────┤     │
│ senderId    │────│ reviewerId  │─────┤
│ recipientId │────│ revieweeId  │─────┘
│ propertyId  │    │ propertyId  │
│ messageText │    │ rating      │
│ isRead      │    │ comment     │
└─────────────┘    └─────────────┘
```

### Role Matrix

| Role | Description | Capabilities |
|------|-------------|--------------|
| `renter` | Property seekers | Browse, save, message, pay |
| `landlord` | Property owners | All renter + create listings |
| `verifier` | Platform staff | Verify properties, users |
| `admin` | Platform admin | Full system access |

---

## API Design Principles

### 1. Query Naming Convention

```typescript
// Singular: Get one item
getProperty({ propertyId })
getCurrentUser()
getUserById({ userId })

// Plural: Get list
listProperties({ city, limit, cursor })
getMyProperties()
getConversations()

// Search: Full-text
searchProperties({ query, city })

// Aggregates
getUnreadCount()
getFilterOptions({ city })
```

### 2. Mutation Naming Convention

```typescript
// Create
createProperty({ title, city, ... })
sendMessage({ recipientId, messageText })

// Update
updateProperty({ propertyId, ...fields })
updateProfile({ firstName, phone })
markMessagesAsRead({ conversationId })

// State transitions
submitForVerification({ propertyId })
updatePropertyStatus({ propertyId, status })

// Delete (prefer soft delete)
archiveProperty({ propertyId })
```

### 3. Action Naming Convention

```typescript
// External API calls
processPayment({ transactionId, amount, phoneNumber })
checkAndUpdatePaymentStatus({ transactionId })
releaseEscrow({ transactionId })
```

---

## Security Model

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Clerk   │────▶│ Convex   │
│          │     │  (Auth)  │     │ Backend  │
└──────────┘     └──────────┘     └──────────┘
                      │                 │
                      │ JWT Token       │
                      ▼                 │
              ┌──────────────┐          │
              │ ctx.auth.    │◀─────────┘
              │ getUserIdentity()
              └──────────────┘
                      │
                      ▼
              ┌──────────────┐
              │ Lookup user  │
              │ by clerkId   │
              └──────────────┘
                      │
                      ▼
              ┌──────────────┐
              │ Check role   │
              │ & authorize  │
              └──────────────┘
```

### Authorization Checks

```typescript
// Every protected endpoint MUST:
// 1. Verify authentication
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error('Not authenticated');

// 2. Get user from DB (not from token claims!)
const user = await ctx.db
  .query('users')
  .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
  .unique();
if (!user) throw new Error('User not found');

// 3. Check role if needed
if (user.role !== 'landlord' && user.role !== 'admin') {
  throw new Error('Unauthorized');
}

// 4. Check ownership if needed
if (property.landlordId !== user._id && user.role !== 'admin') {
  throw new Error('Cannot modify others\' properties');
}
```

---

## Monorepo Structure

```
piol/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── lib/         # Utilities
│   │   │   └── i18n/        # Translations
│   │   └── package.json
│   │
│   └── mobile/              # Expo/React Native app
│       ├── app/             # Expo Router screens
│       ├── components/      # RN components
│       ├── stores/          # Zustand stores
│       ├── hooks/           # Custom hooks
│       ├── lib/             # Utilities
│       ├── i18n/            # Translations
│       └── package.json
│
├── packages/
│   ├── convex/              # Backend (Convex)
│   │   ├── schema.ts        # Database schema
│   │   ├── *.ts             # Domain modules
│   │   ├── actions/         # External API calls
│   │   └── package.json
│   │
│   ├── ui/                  # Shared UI components
│   │   └── src/components/  # Button, Card, Input, etc.
│   │
│   ├── types/               # Shared TypeScript types
│   │
│   ├── config/              # Shared configs
│   │   ├── eslint/
│   │   ├── tailwind/
│   │   └── typescript/
│   │
│   └── env/                 # Environment validation
│
├── turbo.json               # Turborepo config
├── package.json             # Root package.json
└── biome.json               # Linting/formatting
```

---

## Development Workflow

### 1. Local Development

```bash
# Install dependencies
bun install

# Start all services
bun run dev

# Start specific apps
bun run dev --filter=@repo/web
bun run dev --filter=@repo/mobile
bun run dev:convex --filter=@repo/convex
```

### 2. Code Quality

```bash
# Format & lint
bun run format
bun run lint

# Type check
bun run typecheck

# Run tests
bun run test
```

### 3. Git Workflow

```
main ─────────────────────────────────────────────────▶
       │              │              │
       │ feat/add-x   │ fix/bug-y    │ chore/update-z
       ▼              ▼              ▼
    ───────        ───────        ───────
       │              │              │
       └──── PR ──────┴──── PR ──────┘
                      │
                      ▼
                   squash
                   merge
```

**Commit format:** `<scope>: <description>`

```
convex: add property search index
web: implement property filters
mobile: add pull-to-refresh
types: add Transaction interface
```

---

## Performance Considerations

### Database

- **Index everything you query.** No table scans.
- **Paginate all lists.** Max 100 items per request.
- **Batch related fetches.** Avoid N+1 queries.

### Frontend

- **Server Components by default.** Client only when interactive.
- **Skeleton loading states.** No layout shift.
- **Image optimization.** Next.js Image, expo-image.
- **Virtualize long lists.** FlashList on mobile.

### Mobile

- **60fps animations.** Use Reanimated for complex animations.
- **Minimize re-renders.** useCallback, useMemo where needed.
- **Offline-first mindset.** Zustand persist for critical state.

---

## Observability

### Logging

```typescript
// ✅ Structured logs
console.log(`[properties] Created property ${propertyId} for user ${userId}`);

// ❌ Avoid
console.log('Created property', property); // PII exposure risk
```

### Error Handling

```typescript
// Throw user-safe errors
throw new Error('Property not found');
throw new Error('Payment failed: insufficient funds');

// Never expose internals
// ❌ throw new Error(`DB error: ${internalError.message}`);
```

### Metrics to Track

- Property listing → verification → activation rate
- Payment success/failure rate by provider
- Message response time
- Search → contact → payment conversion

---

## Deployment

### Environments

| Environment | Purpose | Branch |
|-------------|---------|--------|
| Development | Local testing | - |
| Preview | PR preview deployments | feature/* |
| Production | Live application | main |

### CI/CD Pipeline

```
PR Created
    │
    ▼
┌─────────────────┐
│  Type Check     │
│  Lint           │
│  Unit Tests     │
│  Build          │
└────────┬────────┘
         │ All pass
         ▼
┌─────────────────┐
│ Preview Deploy  │
│ (Vercel/EAS)    │
└────────┬────────┘
         │ Review & Approve
         ▼
┌─────────────────┐
│  Merge to main  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Production      │
│ Deploy          │
└─────────────────┘
```

---

## When in Doubt

1. **Read the schema first.** `packages/convex/schema.ts` is the source of truth.
2. **Follow existing patterns.** Look at similar files before creating new ones.
3. **Keep it simple.** Don't over-engineer. Solve the problem at hand.
4. **Test the happy path + one error case.** Don't aim for 100% coverage.
5. **Ask about business logic.** Technical decisions should serve user needs.
