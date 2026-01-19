# Agent Progress Log

Session history for AI agents working on Piol. Append new entries at the top.

---

## Session: 2026-01-19 21:30

**Focus**: prod-1 - Sentry error tracking
**Outcome**: completed

### Done
- Added prod-1 through prod-5 features to `agent/features.json` (production readiness tracking)
- Wired `withSentryConfig` in `next.config.ts`:
  - Source map upload support (SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT)
  - Hide source maps from client bundles
  - Silent mode for CI
- Updated `.env.example` with SENTRY_ORG and SENTRY_PROJECT vars
- Verified build passes with Sentry integration

### Blockers
- None

### Decisions
- Sentry enabled only when DSN is set (graceful degradation)
- Source maps uploaded only when auth token present
- Trace sample rate: 10% in prod, 100% in dev

### Files Changed
- `apps/web/next.config.ts` - Added withSentryConfig wrapper
- `.env.example` - Added SENTRY_ORG, SENTRY_PROJECT
- `agent/features.json` - Added prod-1 through prod-5 features
- `agent/scratchpad.md` - Updated current context

### Next
- prod-2: Vercel Analytics (@vercel/analytics, @vercel/speed-insights)

---

## Session: 2026-01-19 19:30

**Focus**: mvp-6 - User can save properties
**Outcome**: completed

### Done
- Committed leftover schema change from mvp-5 (placeholderImages field)
- Created new branch `feat/mvp-6-save-properties` for this feature
- Added `getSavedPropertyIds` query to Convex for efficient bulk checking
- Updated `PropertyCard` component:
  - Added optional `isSaved` and `onToggleSave` props
  - Supports both controlled (props) and uncontrolled (local state) modes
  - handleSave calls callback when provided
- Wired `/properties` page:
  - Fetches saved IDs using `getSavedPropertyIds` query
  - Creates Set for O(1) lookup
  - Passes `isSaved` and `onToggleSave` to each PropertyCard
  - Both grid and horizontal views support saving
- Wired `/dashboard/saved` page:
  - Replaced mock data with `getSavedProperties` query
  - Added loading skeletons
  - Empty state when no saves
  - Real-time updates when toggling saves

### Blockers
- None

### Decisions
- One query for all saved IDs (efficient) instead of N queries for N cards
- PropertyCard uses controlled/uncontrolled pattern for flexibility
- Type annotations added to fix implicit any errors

### Files Changed
- `packages/convex/convex/savedProperties.ts` - Added getSavedPropertyIds query
- `apps/web/src/components/property-card.tsx` - Added isSaved/onToggleSave props
- `apps/web/src/app/properties/page.tsx` - Wired save functionality
- `apps/web/src/app/dashboard/saved/page.tsx` - Wired to real Convex data

### Tests
- Convex tests: 42/42 passed
- Pre-existing test issues remain (not MVP-6 scope)

### Next
- MVP COMPLETE! All 7 features done
- Create PRs for mvp-5 and mvp-6 branches
- Post-MVP: payments, property verification, map view

---

## Session: 2026-01-19 18:00

**Focus**: mvp-5 - User can message landlord
**Outcome**: completed

### Done
- Cleaned up uncommitted `next-env.d.ts` auto-generated change
- Created new feature branch `feat/mvp-5-messaging` from main
- Added contact dialog to property detail page (`/properties/[id]`):
  - Dialog opens on "Contacter le propriétaire" button click
  - Shows property preview in dialog
  - Sends message via `sendMessage` mutation
  - Redirects to `/dashboard/messages` after send
  - Works on both desktop and mobile layouts
- Wired messages list page (`/dashboard/messages`) to Convex:
  - Uses `getConversations` query
  - Shows other user info, property title, last message, unread count
  - Loading skeleton and empty state
  - Search filter for conversations
- Wired conversation detail page (`/dashboard/messages/[id]`) to Convex:
  - Uses `getMessages` query for message history
  - Uses `sendMessage` mutation for new messages
  - Uses `markMessagesAsRead` mutation (auto-marks on view)
  - Auto-scroll to bottom on new messages
  - Real-time updates via Convex reactive queries
- Created `Textarea` UI component

### Blockers
- None

### Decisions
- Contact button opens dialog (compose message inline) rather than direct redirect
- After sending first message, redirect to messages list (simpler than finding conversation ID client-side)
- Messages marked as read when conversation view loads (useEffect)
- Property ID extracted from conversation ID string for "View Property" link

### Files Changed
- `apps/web/src/app/properties/[id]/page.tsx` - Added contact dialog + imports
- `apps/web/src/app/dashboard/messages/page.tsx` - Wired to getConversations
- `apps/web/src/app/dashboard/messages/[id]/page.tsx` - Wired to getMessages + sendMessage
- `apps/web/src/components/ui/textarea.tsx` - New component

### Tests
- Convex tests: 42/42 passed (including messages tests)
- Web tests: 5/8 passed (3 failures are pre-existing PropertyCard i18n issues)
- Mobile tests: failing (pre-existing Jest ESM config issue)

### Next
- mvp-6: Wire save/favorite button to savedProperties table
- Fix pre-existing PropertyCard test issues (i18n mocking)

---

## Session: 2026-01-19 16:00

**Focus**: mvp-3 - Property detail page at /properties/[id]
**Outcome**: completed

### Done
- Cleaned up uncommitted files from previous session (next-env.d.ts formatting, env backup file)
- Pushed mvp-2 branch to origin (PR creation failed due to gh auth - needs manual PR)
- Updated `getProperty` Convex query to resolve image URLs from storage IDs
- Query now returns `imageUrls` array with resolved URLs sorted by order
- Landlord profile image URL also resolved in query
- Rewrote property detail page to use Convex:
  - Replaced mock data with `useQuery(api.properties.getProperty)`
  - Added loading skeleton component
  - Added not-found state when property doesn't exist
  - Handled Next.js 16 params Promise with `use()` hook
- All acceptance criteria met:
  - Route loads property from Convex ✓
  - Property images display (from storage or placeholder) ✓
  - Amenities list renders ✓
  - Landlord info shows ✓
  - Contact/message button present ✓

### Blockers
- `gh pr create` failed due to auth mismatch (logged in as `linustruesignal`, repo owned by `linus5304`)
- Needs manual PR creation at https://github.com/linus5304/piol/pull/new/feat/mvp-2-properties-convex

### Decisions
- Image URLs resolved in Convex query (single query vs multiple) for better performance
- Placeholder images shown when property has no uploaded images
- Save/heart button is local state only (will wire to Convex in mvp-6)
- Contact button present but not wired to messaging (will wire in mvp-5)

### Files Changed
- `packages/convex/convex/properties.ts` - Enhanced getProperty to resolve image URLs
- `apps/web/src/app/properties/[id]/page.tsx` - Complete rewrite with Convex integration

### Next
- Create PR for mvp-2/mvp-3 work (needs gh auth fix or manual creation)
- mvp-4: Wire property creation form to Convex mutations

---

## Session: 2026-01-19 14:00

**Focus**: Clean up uncommitted mvp-2 work and apply specs
**Outcome**: completed

### Done
- Stashed uncommitted mvp-2 work from `docs/v0-ui-prompts` branch
- Created proper feature branch `feat/mvp-2-properties-convex` from main
- Applied stash and committed properly:
  - Feature code: properties page wired to Convex
  - Convex restructure: moved functions to `packages/convex/convex/`
  - Specs: applied and archived `add-monorepo-constraints` proposal
- Applied monorepo-conventions spec to `openspec/specs/`
- Archived the change proposal to `openspec/changes/archive/`

### Blockers
- None

### Decisions
- Convex files now live at `packages/convex/convex/` per Convex CLI requirements
- Package exports updated to point to new paths
- Spec documents the canonical structure to prevent future confusion

### Files Changed
- All mvp-2 files (see previous session)
- `openspec/specs/monorepo-conventions/spec.md` - Applied spec
- `openspec/changes/archive/2026-01-19-add-monorepo-constraints/` - Archived proposal

### Next
- Push branch and create PR for mvp-2
- Start mvp-3: property detail page

---

## Session: 2026-01-19 12:30

**Focus**: mvp-2 - Browse properties at /properties
**Outcome**: completed

### Done
- Removed 115 lines of mock property data from properties page
- Added `@repo/convex` as workspace dependency to web app
- Wired `useQuery(api.properties.listProperties)` for browsing with filters
- Wired `useQuery(api.properties.searchProperties)` when search query >= 2 chars
- Implemented filter mapping:
  - City filter → Convex `city` arg (indexed query)
  - Property type → Convex `propertyType` (apartment category filtered client-side to include 1br-4br)
  - Price range → `minPrice`/`maxPrice` args
  - Sort → mapped UI format (price-asc) to Convex format (price_asc)
- Added loading skeleton components while data fetches
- Fixed PropertyCard type to accept `landlord: ... | null` from Convex

### Blockers
- None

### Decisions
- Search triggers at 2+ characters to avoid spamming Convex with single-char queries
- "Apartment" category includes 1br, 2br, 3br, 4br types (filtered client-side since Convex filters by exact type)
- Used `'skip'` pattern to conditionally skip queries based on state

### Files Changed
- `apps/web/src/app/properties/page.tsx` - Main refactor
- `apps/web/src/components/property-card.tsx` - Type fix for null landlord
- `apps/web/package.json` - Added @repo/convex dependency

### Next
- mvp-3: Wire property detail page `/properties/[id]` to Convex `getProperty` query
- Add real images support (currently uses placeholder images)

---

## Session: 2026-01-19 11:00

**Focus**: mvp-1 - Redirect to dashboard after auth
**Outcome**: completed (was already implemented)

### Done
- Verified mvp-1 was already complete via existing `proxy.ts`
- Initially created `middleware.ts` (wrong — Next.js 16 uses `proxy.ts`)
- Consulted Next.js 16 docs and Clerk docs to understand the convention change
- Deleted redundant `middleware.ts`
- Confirmed `proxy.ts` correctly uses `clerkMiddleware` + `auth.protect()`

### Blockers
- None

### Decisions
- Next.js 16 renamed `middleware.ts` → `proxy.ts` and export `middleware` → `proxy`
- Clerk docs now reference `proxy.ts` for Next.js 16+
- Existing `proxy.ts` already handles all acceptance criteria correctly

### Key Learning
- Always check existing codebase before creating new files
- Next.js 16 breaking change: middleware → proxy convention

### Next
- mvp-2: Wire properties page to Convex (replace mock data with useQuery)
- Test with agent-browser to verify auth flow works

---

## Session: 2026-01-19 10:00

**Focus**: Initial harness setup
**Outcome**: completed

### Done
- Created agent harness structure
- Populated features.json with MVP backlog
- Documented current state of each feature

### Blockers
- None

### Decisions
- Using Option A (manual loop): Human starts each session, agent works on one feature
- Tests will be added incrementally; for now using acceptance criteria descriptions
- MVP-2 (properties page) has UI but uses mock data—first real feature to tackle

### Next
- Start with mvp-1 (auth redirect) or mvp-2 (properties Convex integration)
- mvp-2 is higher impact since UI already exists
