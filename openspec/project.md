# Project Context

## Purpose

**Piol** — Cameroon housing marketplace. Renters find verified properties, pay via mobile money, message landlords.

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Convex (serverless + realtime DB) |
| Auth | Clerk |
| Web | Next.js 16, React 19, Tailwind v4, shadcn/ui |
| Mobile | Expo 52 (paused until web MVP) |
| Payments | MTN MoMo, Orange Money |

## Code Conventions

- **Formatter:** Biome (2 spaces, single quotes, semicolons)
- **Files:** kebab-case. **Components:** PascalCase
- **Commits:** `<scope>: <description>`
- **Git:** Always PR, never commit to main

## Domain

### User Roles
- `renter` — Browse, save, message, pay
- `landlord` — Create/manage listings
- `verifier` — Verify properties
- `admin` — Full access

### Property Lifecycle
```
draft → pending_verification → verified → active → rented/archived
```

### Payment Flow
```
pending → processing → completed (escrow) → released (95% landlord, 5% fee)
```

## Constraints

- Currency: XAF (Central African CFA Franc)
- Languages: French (primary), English
- Every Convex query needs an index
- Pagination required (max 100 items)
- 5% platform commission on payments

## External Services

- **Clerk** — Auth
- **MTN MoMo / Orange Money** — Payments
- **Convex Storage** — Files
- **Vercel** — Web hosting
