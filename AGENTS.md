# Piol

Cameroon housing marketplace. Renters find verified properties, pay via mobile money (MTN MoMo, Orange Money), message landlords.

## Stack

- **Backend:** Convex (serverless + realtime DB), Clerk auth
- **Web:** Next.js 16, React 19, Tailwind v4, shadcn/ui
- **Mobile:** Expo 52, React Native (paused until web MVP done)
- **Monorepo:** Turborepo + Bun

## Run

```bash
bun install
bun run dev          # Web + Convex
bun run dev:convex   # Convex only
```

## MVP Focus (Web Only)

1. [x] Auth pages exist (sign-up, sign-in)
2. [ ] User redirected to dashboard after auth
3. [ ] Browse properties at /properties
4. [ ] View property detail at /properties/[id]
5. [ ] Landlord can create property
6. [ ] User can message landlord
7. [ ] User can save properties

## Code Style

- **Formatter:** Biome (2 spaces, single quotes, semicolons)
- **Files:** kebab-case. **Components:** PascalCase
- **Commits:** `<scope>: <description>` (e.g., `web: add property list`)
- **Branches:** `feat/`, `fix/`, `chore/` — always PR, never commit to main

## Convex Patterns

- **Queries:** Read-only, real-time subscriptions
- **Mutations:** Write ops, always verify auth first
- **Actions:** External API calls (payments, webhooks)
- **Auth check:** `const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new Error('Not authenticated');`

## Schema

Source of truth: `packages/convex/schema.ts`

## OpenSpec

Use `/openspec-proposal` to design before building new features. See `openspec/AGENTS.md` for workflow.
