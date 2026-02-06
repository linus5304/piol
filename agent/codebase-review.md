# Piol Codebase Review

## The Idea

Piol is a **Cameroon housing marketplace** solving a real, painful problem: renting in Cameroon is opaque, cash-based, and trust-deficient. Renters can't verify listings are real before paying. Landlords can't screen tenants. There's no escrow, no digital paper trail, and no accountability.

Piol digitizes this entire workflow: **browse verified properties, pay via mobile money (MTN MoMo / Orange Money), message landlords, and track everything.**

---

## Where There IS Value

### 1. Trust & Verification Layer (HIGH VALUE)
The verification system (property visits, document checks, verifier roles) is the **core differentiator**. In a market where fake listings and scams are common, a "verified" badge backed by real inspections creates immediate trust. The 4-role model (renter, landlord, admin, verifier) enables a scalable verification workforce.

### 2. Mobile Money Escrow (HIGH VALUE)
The escrow system (hold -> release/refund) with MTN MoMo and Orange Money integration addresses the biggest pain point: renters paying large sums (6 months upfront + 2 months caution is standard in Cameroon) with zero protection. The 5% platform commission is a clear monetization path.

### 3. Bilingual Support (MEDIUM-HIGH VALUE)
French/English i18n is essential for Cameroon (officially bilingual country). This is table stakes but done well - every string is translated.

### 4. Backend Completeness (HIGH VALUE)
The Convex backend is **production-ready**. All core features (users, properties, messaging, payments, reviews, notifications, saved properties, verification) have full CRUD, proper auth checks, comprehensive indexes, and test coverage (~50+ tests). This is not a prototype - it's deployable infrastructure.

### 5. Real-time Messaging (MEDIUM VALUE)
Landlord-renter communication via Convex subscriptions enables real-time chat. Eliminates the need for WhatsApp exchanges and keeps interactions within the platform (important for dispute resolution).

---

## Where Value is WEAK or MISSING

### 1. Mobile App (PAUSED - VALUE LEAK)
The Expo app is a shell with TypeScript errors. In Cameroon, **mobile-first is everything** - most users access the internet via phones. The web app is responsive, but a native app with push notifications would dramatically increase engagement. This is the biggest gap.

### 2. Tenant Screening (SCHEMA ONLY)
The `tenantScreenings` table exists with fields (employment, income, rental history, references) but **zero functions are implemented**. This is a valuable feature for landlords that's been designed but never built.

### 3. Payment Integration (SANDBOX ONLY)
MTN MoMo and Orange Money actions are coded but need production API credentials. Until real payments flow, the marketplace can't generate revenue. This is the critical path to monetization.

### 4. Map Experience (INCOMPLETE)
Leaflet integration exists but property coordinates are sparse. For a housing marketplace, the map-based search is a primary discovery method. Without rich location data, the map view is underutilized.

### 5. Visit Scheduling (STUB)
Buttons exist for scheduling property visits but no backend logic. In-person visits are essential for Cameroon rentals - digitizing this scheduling would reduce friction significantly.

### 6. Analytics & Insights (MINIMAL)
Basic admin stats exist but there's no landlord analytics (views, inquiries per listing), no renter behavior tracking, and no market insights (average rents by neighborhood). This data would be valuable for both sides.

---

## Project Structure (Categorized)

```
piol/
├── CORE APPLICATION
│   ├── apps/web/                          # Next.js 16 web app (ACTIVE)
│   │   ├── src/app/                       # Routes & pages
│   │   │   ├── (public)/                  # Landing, about, contact, terms, privacy
│   │   │   ├── properties/                # Browse & detail pages
│   │   │   ├── dashboard/                 # Role-based dashboards
│   │   │   │   ├── properties/            # Landlord property management
│   │   │   │   ├── messages/              # Messaging interface
│   │   │   │   ├── payments/              # Payment history
│   │   │   │   ├── saved/                 # Renter favorites
│   │   │   │   ├── settings/              # User settings
│   │   │   │   ├── verify/                # Verifier portal
│   │   │   │   └── admin/                 # Admin panel
│   │   │   └── (auth)/                    # Sign-in, sign-up (Clerk)
│   │   ├── src/components/                # React components
│   │   │   ├── properties/                # PropertyCard, PropertyMap, gallery
│   │   │   ├── messaging/                 # ConversationList, MessageThread, Composer
│   │   │   ├── dashboard/                 # Stats, tables, navigation
│   │   │   └── ui/                        # shadcn/ui components (~40 components)
│   │   ├── src/hooks/                     # usePermissions, useCurrentUser, useMobile
│   │   ├── src/i18n/                      # French/English translations
│   │   └── src/lib/                       # Utilities, permissions, env config
│   │
│   └── apps/mobile/                       # Expo React Native app (PAUSED)
│       └── src/                           # Shell with auth, tabs, basic screens
│
├── BACKEND & DATA
│   └── packages/convex/                   # Convex serverless backend
│       ├── convex/
│       │   ├── schema.ts                  # 11 tables, source of truth
│       │   ├── users.ts                   # User CRUD, auth, roles, admin
│       │   ├── properties.ts              # Listings CRUD, search, filters, verification
│       │   ├── transactions.ts            # Payments, escrow, refunds
│       │   ├── messages.ts                # Real-time messaging
│       │   ├── verifications.ts           # Property verification workflow
│       │   ├── reviews.ts                 # Rating system
│       │   ├── notifications.ts           # System notifications
│       │   ├── savedProperties.ts         # Favorites
│       │   ├── files.ts                   # Image upload/storage
│       │   ├── http.ts                    # Webhooks (Clerk, MoMo, Orange)
│       │   ├── actions/payments.ts        # Payment router
│       │   ├── actions/mtnMomo.ts         # MTN MoMo API integration
│       │   ├── actions/orangeMoney.ts     # Orange Money API integration
│       │   └── utils/                     # Auth, authorization, data helpers
│       ├── __tests__/                     # 4 test suites (~50+ tests)
│       └── seed/                          # Database seeding
│
├── SHARED PACKAGES
│   ├── packages/ui/                       # Shared UI primitives
│   ├── packages/types/                    # Cross-workspace types
│   ├── packages/config/                   # Tailwind preset, TS configs
│   └── packages/env/                      # Environment variable handling
│
├── DEVOPS & AUTOMATION
│   ├── .github/workflows/                 # CI/CD pipelines
│   │   ├── web-ci.yml                     # Lint, test, e2e, build, deploy
│   │   ├── convex-deploy.yml              # Typecheck, test, deploy
│   │   ├── claude-pr-assistant.yml        # AI code review on PRs
│   │   └── security-review.yml           # Automated security scanning
│   ├── scripts/compound/                  # Nightly autonomous dev loop
│   └── scripts/vercel-build.mjs           # Custom Vercel build
│
└── AGENT & PLANNING
    └── agent/
        ├── spec.md                        # Current feature spec
        ├── implementation_plan.md         # Task checklist
        ├── progress.md                    # 69 session logs
        └── prompt.md                      # Agent instructions
```

---

## 5 User Stories That Show the Value

### User Story 1: "The Cautious Renter"
> **As a renter relocating to Douala**, I want to browse verified apartments with real photos, filter by neighborhood and price, and save my favorites — so I can shortlist options before visiting in person.

**What works today:** Full property search with city/type/price/amenity filters, full-text search, verified badge display, save/unsave functionality, property detail pages with image galleries, map view with price markers. All bilingual (FR/EN).

**The value:** Instead of driving around neighborhoods or trusting random Facebook posts, the renter gets a curated, verified catalog. The "verified" badge means someone physically visited the property.

---

### User Story 2: "The Landlord Listing a Property"
> **As a landlord in Yaoundé**, I want to list my 2-bedroom apartment with photos, set my rent and deposit terms, and submit it for verification — so verified renters can find and contact me.

**What works today:** 3-step property creation wizard (info -> pricing/amenities -> photos), image upload, draft saving, submit for verification workflow, landlord dashboard with property status tracking, incoming messages from interested renters.

**The value:** Landlords get a professional listing page without knowing anything about web design. The verification process builds trust and attracts more serious renters (fewer tire-kickers).

---

### User Story 3: "The Secure Payment"
> **As a renter ready to commit**, I want to pay my 6-month advance and 2-month caution via MTN MoMo, with funds held in escrow until the landlord hands over the keys — so I'm protected if something goes wrong.

**What works today:** Transaction creation, MTN MoMo and Orange Money API integration (sandbox), escrow state machine (held -> released/refunded), payment history with status tracking, refund request workflow, admin oversight.

**The value:** This is the killer feature. Currently, renters hand over millions of CFA francs in cash with zero protection. Escrow changes the power dynamic entirely. The 5% commission is how Piol makes money.

*Note: Needs production API credentials to go live.*

---

### User Story 4: "The Property Verifier"
> **As a Piol verifier**, I want to claim pending properties, schedule visits, upload photos from my inspection, and approve or reject listings — so only real, quality properties appear on the platform.

**What works today:** Verifier role with dedicated permissions, claim/assign verification workflow, document and photo upload, notes system, approve/reject with automatic status updates, landlord notifications on status change.

**The value:** This creates a **network effect moat**. The more verified properties Piol has, the more renters trust the platform. Competitors can't easily replicate a human verification network.

---

### User Story 5: "The Renter-Landlord Conversation"
> **As a renter interested in a property**, I want to message the landlord directly through the app, ask about availability and visit times, and keep all our communication in one place — so I have a record if any dispute arises.

**What works today:** Real-time messaging (Convex subscriptions), conversation list with unread counts, message thread with sent/received styling, read receipts, property context in conversations, notification on new messages.

**The value:** Keeping communication on-platform (vs WhatsApp) creates an audit trail for dispute resolution and keeps users engaged within Piol's ecosystem. It also enables future features like automated visit scheduling.

---

## Summary Assessment

| Dimension | Rating | Notes |
|-----------|--------|-------|
| **Backend** | 9/10 | Production-ready, well-tested, comprehensive |
| **Web Frontend** | 7/10 | Core flows work, some pages are stubs |
| **Mobile** | 2/10 | Shell only, paused, TypeScript errors |
| **Payments** | 6/10 | Logic complete, needs production credentials |
| **DevOps** | 8/10 | Full CI/CD, preview deploys, AI code review |
| **Documentation** | 7/10 | CLAUDE.md excellent, some docs outdated |
| **Market Fit** | 8/10 | Solves a real, painful problem in Cameroon |

**Bottom line:** Piol has a strong backend foundation and a functional web MVP. The highest-leverage next steps are: (1) get payment APIs live, (2) fill the remaining UI gaps (property editing, admin panel, visit scheduling), and (3) decide on mobile strategy. The verification + escrow combination is genuinely defensible in the Cameroon market.
