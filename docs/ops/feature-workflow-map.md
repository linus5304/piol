# Feature Inventory and Workflow Map

## Status Legend
- Implemented: fully usable in current web experience.
- Partial: implemented backend/API and some UI, but not complete end-to-end UX.
- Hidden/Not launched: code exists but feature intentionally not exposed as a production flow.

## Product Focus Policy (Growth-First)

- Primary goal: maximize trusted marketplace usage (search, verified listings, messaging, landlord verification).
- Payments remain in the codebase as staged infrastructure, but are not a primary user acquisition or activation flow.
- Landlord verification is the main trust gate; renter entry should remain low-friction.

Monetization sequencing: see `./growth-first-monetization-roadmap.md`.

## Feature Inventory

| Area | Feature | Status | Notes |
|---|---|---|---|
| Auth | Sign up/sign in with Clerk | Implemented | Demo fallback exists when Clerk is not configured. |
| Auth | Onboarding role selection (renter/landlord) | Implemented | Stored in Clerk unsafe metadata. |
| Discovery | Browse properties list | Implemented | Search + city/category/price filters + map/grid views. |
| Discovery | Property detail page | Implemented | Includes save + landlord messaging entry point. |
| Renter | Save/unsave properties | Implemented | Dashboard saved list and detail toggles. |
| Messaging | Conversations + threads | Implemented | Read/unread + property-context conversation support. |
| Landlord | Create/edit/list/archive properties | Implemented | Draft + submit for verification + activation after approval. |
| Verification | Verifier dashboard and approve/reject flow | Implemented | Role-gated with checklist workflow. |
| Admin | User management + role/status changes | Implemented | Admin-only routes and actions. |
| Payments | Transaction history and stats display | Implemented (de-emphasized) | Read-side UX present in dashboard, but not promoted in primary navigation during growth-first phase. |
| Payments | End-to-end renter checkout action | Partial / Staged Off | Convex payment actions exist; staged rollout keeps initiation UX gated in wave 1. |
| Reviews | Reviews APIs | Hidden/Not launched | Backend exists; no dedicated production UI flow yet. |
| Notifications | Notification APIs | Partial | Backend exists; no full user-facing notification center flow. |

## Canonical User Workflows

## Guest
1. Land on home page.
2. Browse `/properties` and open property detail.
3. Attempt protected action (save/message/dashboard) -> authenticate.

## Renter
1. Sign up/sign in and complete onboarding as renter.
2. Search/filter listings and open detail pages.
3. Save favorites and manage from `/dashboard/saved`.
4. Start property-context conversation with landlord.
5. Optional: review transaction history in `/dashboard/payments` (not a primary flow).

## Landlord
1. Sign up/sign in and complete onboarding as landlord.
2. Create property as draft in `/dashboard/properties/new`.
3. Edit property and submit for verification.
4. After approval, activate listing and manage lifecycle.
5. Handle renter inquiries in messages.

## Verifier
1. Sign in with verifier/admin role.
2. Open `/dashboard/verify` and claim pending verification.
3. Complete checklist, approve/reject with notes.
4. Confirm property status transition and landlord notification.

## Admin
1. Sign in as admin and access `/dashboard/admin`.
2. Review high-level stats and pending verification queue.
3. Manage users (role/status) in `/dashboard/admin/users`.
4. Monitor transactions and verification throughput.

## Wave Policy
- Wave 1 (current): core marketplace workflows are primary; payment initiation UX is staged off and payments are de-emphasized in primary UX.
- Wave 2: payment initiation actions enabled after production-like callback validation.
