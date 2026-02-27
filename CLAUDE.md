# CLAUDE.md

Piol — Cameroon housing marketplace (renters, verified properties, mobile money, landlord messaging).

Tech stack: Next.js 16 + Convex + Clerk + Tailwind v4 + shadcn/ui. Monorepo via Turborepo, Bun package manager.

@docs/architecture.md

## Universal Rules

- NEVER push directly to `main` — it's branch-protected. Always feature branch + PR.
- NEVER use hardcoded hex colors. Use design tokens from `globals.css`.
- NEVER hardcode user-facing strings. Use i18n (`useTranslation()`).
- Install shadcn components with: `bunx --bun shadcn@latest add <name>`

## Git

- Branch prefixes: `feat/`, `fix/`, `chore/`, `docs/`.
- Atomic commits: self-contained, pass lint + typecheck, safe to deploy alone.
- Commit format: `<scope>(<feature-id>): <description>` — scopes: `web`, `convex`, `chore`
- Before committing: `bun run lint:fix && bun run typecheck`

## Auto-Ship

When I say "ship it": lint, typecheck, commit, push, `gh pr create`, `gh pr merge --squash --delete-branch`.

## When Something Surprises You

If you encounter something confusing or unexpected, tell me about it. I'd rather fix the codebase than add more rules here.

## Self-Updating Rules

If you notice a recurring mistake — and a rule here would have prevented it — update this file directly. Only add rules encoding real, recurring patterns. Keep it concise.
