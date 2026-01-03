# Cursor Rules — Cameroon Housing Marketplace (Convex + Expo + Next + Bun)

## Scope & Defaults

- TypeScript everywhere; no `any`. Keep files <300 LOC when feasible.
- Single source of truth for design tokens (colors/spacing/typography). Import, never inline magic numbers.
- Biome must pass (`bun run format` / `bun run lint`). No unchecked TODOs on main.
- Prefer pure, small functions; side effects only in boundaries (IO, navigation, logging).

## Frontend (Mobile: Expo Router / React Native)

- Use shared primitives for layout/typography/buttons/forms; no ad-hoc styles. Spacing via tokens only.
- Navigation: routes typed; guard missing params; always render loading/empty/error states.
- Lists: stable keys; `getItemLayout` when height known; debounce search inputs; paginate/infinite scroll for feeds.
- Async UX: show skeletons for primary lists; disable submit while pending; optimistic updates with rollback for chat/forms.
- Accessibility: `accessibilityLabel` on tappables; respect font scaling; 44x44 min touch targets; dark/high-contrast supported.
- Images: cached image component; width/height set; placeholder + error fallback; compress before upload.
- Forms: zod schemas; inline errors near fields; success/failure toasts; prevent double-submit.

## Frontend (Web: Next.js)

- Server actions/queries typed; never trust client data. Use shared DTOs from `shared/types`.
- Keep layout/components presentational; data fetching in page/route layer. Avoid heavy logic in client components.
- Use suspense boundaries with sensible fallbacks; error boundaries for dashboards.
- Internationalization: strings come from locale files; no hard-coded text.

## State & Data

- Server state via Convex hooks; cache keys typed; no prop drilling >2 levels—lift to small store if needed.
- Local UI state stays local; global store only for auth/session/theme.
- Avoid N+1: batch in Convex queries; define indexes before shipping.
- Date/number formatting via shared utils; never format inline in JSX.

## Convex Backend

- All mutations/queries validate inputs with zod; fail fast on auth.
- Enforce authz per call: role matrix for renter/landlord/admin/verifier. Centralize role helpers.
- Idempotency: all create/external-calling mutations accept `requestId` and enforce uniqueness.
- Errors: throw typed errors with user-safe messages; no generic catch-swallow.
- Persistence: define indexes for every query path; no table scans for lists. Paginate and cap page size.
- Auditing: log admin/verifier actions; avoid logging PII; mask secrets.
- Payments/webhooks: verify signatures; store provider refs; mark transactions via state machine (pending → held → released/refunded); idempotent on callbacks.

## API Contracts

- DTOs live in `shared/types`; clients import, not re-declare. Version DTOs on breaking changes.
- Time in ISO or epoch ms; no local timezones in storage.
- Never return internal IDs you wouldn’t expose; map to public-facing fields.

## Reliability & Observability

- External calls have timeouts + limited retries (idempotent only) with backoff/jitter.
- Structured logs with `event`, `userId`, `requestId`. Propagate `requestId` from client → Convex → outbound calls.
- Metrics: count errors/success, latency p50/p95, and cache hit rates. Alerts on error-rate/latency spikes.
- Feature flags for risky changes; default off. Kill switches for new payment/notification paths.

## Security

- Auth via Clerk; never trust client role flags. Re-check inside Convex.
- Input validation everywhere; output escape any rich text.
- Secrets only in env; keep `.env.example` current; no secrets in logs.
- Rate-limit sensitive mutations; consider captcha/proof-of-work on abuse surfaces (auth, messaging send, payments).

## Performance

- Avoid heavy computation in render; memoize derived data; stable callbacks on frequently re-rendered lists.
- Prefetch on navigation where useful (property detail, messages). Virtualize large lists.
- Images: prefer WebP/AVIF; cap dimensions; CDN when possible.
- Backend: precompute aggregates when cheap; avoid fan-out per request.

## Testing

- Unit tests for pure utilities/validation; include positive/negative cases.
- Component tests for screens with branching logic; snapshot only stable shells.
- Integration/e2e for auth, listing CRUD, messaging send/read, payments/escrow happy + failure paths.
- Deterministic seeds/fixtures; no live network in unit tests; mock time when relevant.

## CI/CD (GitHub Actions)

- Required checks on PRs: typecheck, biome lint, tests (web + mobile), Convex schema check, build (web).
- Cache Bun deps and Next/Expo artifacts where safe. Pin Node/Bun versions.
- PR template: summary, screenshots for UI, test plan. Small, single-purpose PRs.
- Protect `main`; squash or rebase-only. No direct pushes.
- Add Expo EAS preview builds for mobile changes; upload artifacts/screenshots to PR.
- SAST/dep scan weekly; fail on high severity; auto-issue with remediation.

## Git Hygiene

- Commit format: `<scope>: <change>` in present tense. One concern per commit.
- Keep `.env.*` out of git; update `.env.example` when adding config.
- No large binary assets in repo—use object storage/CDN.

## Documentation

- Update `TECHNICAL_QUICK_START.md` when commands/env vars change.
- Add short ADRs for non-trivial architectural decisions under `docs/adr/`.
- For new external integrations, document auth, idempotency, callback handling, and failure modes.
