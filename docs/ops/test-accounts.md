# Fixed QA Test Accounts

## Account Model
Use fixed identities per role for repeatable QA.
No role-switching for baseline regression runs.

## Required Accounts

| Role | Email | Purpose |
|---|---|---|
| renter | `qa.renter@piol.test` | Search, save, message, payment-history checks |
| landlord | `qa.landlord@piol.test` | Property creation/lifecycle, inbox, payout-history checks |
| verifier | `qa.verifier@piol.test` | Verification claim/approve/reject checks |
| admin | `qa.admin@piol.test` | User/role management and admin-level access-control checks |

## Data State Contract
Seeded baseline must always include:
- At least one landlord-owned `draft` property.
- At least one `pending_verification` property.
- At least one `verified` or `active` property.
- At least one renter-landlord conversation thread.

## Reset Protocol
1. Run `bun run seed:reset`.
2. Sign in as `qa.admin@piol.test`.
3. Confirm role assignments for all QA accounts.
4. Confirm seeded status distribution (`draft`, `pending_verification`, `verified/active`).
5. Execute smoke tests.
6. Execute manual role checklists.

## Optional Playwright Storage State
For authenticated E2E tests, provide one storage-state file per role:
- `PLAYWRIGHT_STORAGE_STATE_RENTER`
- `PLAYWRIGHT_STORAGE_STATE_LANDLORD`
- `PLAYWRIGHT_STORAGE_STATE_ADMIN`
- `PLAYWRIGHT_STORAGE_STATE_VERIFIER`

Alternative:
- Set `PLAYWRIGHT_AUTH_DIR` and place `renter.json`, `landlord.json`, `admin.json`, `verifier.json`.
