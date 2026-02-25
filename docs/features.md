# Piol Feature Inventory

Living document cataloging every feature, its status, and key files.

## Product Priority (Current)

Piol is currently operating in a **growth-first** mode:
- Prioritize renter and landlord adoption (discovery, trust, messaging, verification).
- Minimize user-facing friction and avoid payment-first UX.
- Keep payments/escrow infrastructure in place as monetization-ready backend capabilities, but do not treat them as the primary adoption loop.

See `docs/ops/growth-first-monetization-roadmap.md` for phased monetization strategy once usage grows.

---

## Core Features

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| Property Listings | Complete | `properties.ts`, `app/properties/page.tsx` | Search, filter by city/type/price/amenities, full-text search, pagination |
| Property Details | Complete | `properties.ts`, `app/properties/[id]/page.tsx` | Images, landlord info, reviews, amenities, GPS coordinates |
| Property Management | Complete | `properties.ts`, `app/dashboard/properties/` | Create draft, edit, upload images, submit for verification, toggle active |
| Authentication | Complete | `users.ts`, `http.ts`, `proxy.ts` | Clerk OAuth, webhooks (user.created/updated/deleted), onboarding flow |
| User Profiles | Complete | `users.ts`, `app/dashboard/settings/page.tsx` | Name, phone, language, profile image, ID verification flag |
| Saved Properties | Complete | `savedProperties.ts`, `app/dashboard/saved/page.tsx` | Save/unsave toggle, saved list with full property details |

## Messaging

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| Conversations | Complete | `messages.ts`, `app/dashboard/messages/page.tsx` | List with last message preview, unread count, other party info |
| Send Messages | Complete | `messages.ts` | Per-property conversations, max 2000 chars, creates notification |
| Read Receipts | Complete | `messages.ts` | Mark individual/all as read, unread count badge |

## Payments & Escrow

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| MTN MoMo | Complete (backend) | `actions/mtnMomo.ts`, `actions/payments.ts` | USSD prompt, status polling, disbursement. Auth-gated public wrappers |
| Orange Money | Complete (backend) | `actions/orangeMoney.ts`, `actions/payments.ts` | Web redirect payment, status polling, webhook callback |
| Escrow | Complete (backend) | `transactions.ts`, `actions/payments.ts` | Funds held until move-in confirmed. 5% commission on disbursement |
| Payment History | Partial (de-emphasized UX) | `transactions.ts`, `app/dashboard/payments/page.tsx` | Backend complete; UI shows transaction list but no payment initiation flow, and payments are not a primary navigation focus in growth-first mode |
| Webhook Verification | Complete | `http.ts` | Bearer token auth on MTN MoMo and Orange Money webhooks |

## Property Verification

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| Submit for Verification | Complete | `properties.ts` | Landlord submits draft -> pending_verification |
| Verification Workflow | Complete | `verifications.ts`, `app/dashboard/verify/` | Claim, add notes/photos/docs, approve/reject |
| Verification Notifications | Complete | `verifications.ts` | Landlord notified on claim, approval, rejection |

## Reviews & Ratings

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| Property Reviews | Complete (backend) | `reviews.ts` | 1-5 integer stars, comment (max 1000 chars), requires completed transaction |
| User Reviews | Complete (backend) | `reviews.ts` | Landlord/tenant review types, average rating calculation |
| Review UI | Missing | -- | No frontend for creating/viewing reviews beyond property detail page |

## Notifications

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| Notification System | Complete | `notifications.ts` | Types: message, payment, review, verification, escrow, refund |
| Notification UI | Partial | -- | Backend complete; no dedicated notification center page |

## Admin & Verifier Tools

| Feature | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| Admin Dashboard | Partial | `users.ts`, `app/dashboard/admin/page.tsx` | Stats (users, properties, transactions). Basic UI |
| User Management | Implemented | `users.ts`, `app/dashboard/admin/users/page.tsx` | List/filter by role, update role, verify ID, toggle active |
| Verification Queue | Complete | `verifications.ts`, `app/dashboard/verify/page.tsx` | Pending properties, claim, process, complete |

## Not Yet Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| Tenant Screening | Schema only | `tenantScreenings` table exists (employment, income, references, score). No backend logic or UI |
| Bank Transfer Payments | Schema only | Payment method in transaction schema. No provider integration |
| Cash Payments | Schema only | Payment method in schema. No processing logic |
| Reviews UI | Missing | No page to submit/browse reviews (backend is complete) |
| Notification Center | Missing | No dedicated page (notifications created on backend) |
| Email/SMS Notifications | Missing | Only in-app notifications exist |
| Payment Initiation Flow | Intentionally deferred | Held for later monetization rollout after adoption milestones |
