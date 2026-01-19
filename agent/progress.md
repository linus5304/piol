# Agent Progress Log

Session history for AI agents working on Piol. Append new entries at the top.

---

## Session: 2026-01-19 11:00

**Focus**: mvp-1 - Redirect to dashboard after auth
**Outcome**: completed

### Done
- Created `apps/web/src/middleware.ts` using Clerk v6 `clerkMiddleware`
- Protected `/dashboard(.*)` routes — unauthenticated users redirect to `/sign-in`
- Implemented demo mode bypass (when Clerk not configured)
- Verified redirect props already set correctly in SignIn/SignUp components

### Blockers
- None

### Decisions
- Used `createRouteMatcher` pattern for cleaner route matching
- Demo mode checks env var directly in middleware (can't use client-side helpers)
- Public routes include `/properties` so users can browse without auth

### Next
- mvp-2: Wire properties page to Convex (replace mock data with useQuery)
- Check `packages/convex/properties.ts` for available queries
- Check if seed data exists for testing

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
