# CLAUDE.md

Piol — Cameroon housing marketplace (renters, verified properties, mobile money, landlord messaging).

## Convex Anti-Patterns (you will get these wrong)

- NEVER use `.filter()` on Convex query builders. Define an index in `schema.ts` and use `.withIndex()`. JS `Array.filter()` after `.collect()` is fine.
- ALWAYS include `returns:` validators on all Convex functions. Use `v.null()` for void returns.
- NEVER omit auth checks. Use `getCurrentUser(ctx)` from `convex/utils/auth.ts` (throws if unauthed). For optional auth: `getCurrentUserOrNull(ctx)`.
- Authorization helpers live in `convex/utils/authorization.ts`: `assertOwner`, `assertRole`, `assertLandlordOrAdmin`, `assertAdmin`, `assertAdminOrVerifier`.
- Use `internalQuery`/`internalMutation`/`internalAction` for functions not exposed to the client.
- Index naming: `by_field1_and_field2` matching the indexed fields.

## UI Anti-Patterns

- NEVER use hardcoded hex colors. Use design tokens from `globals.css` (`bg-primary` not `#FF385C`).
- NEVER hardcode user-facing strings. Use i18n.
- Install shadcn components with: `bunx --bun shadcn@latest add <name>`

## React Anti-Patterns

- NEVER use `useMemo` to create blob URLs (`URL.createObjectURL`) with a separate `useEffect` cleanup. React Strict Mode double-fires effects, revoking the cached URLs while `useMemo` returns stale (revoked) references. Use `useState` + `useEffect` instead — the effect creates fresh URLs on each mount and revokes them on cleanup. `'use no memo'` does NOT fix this.
- NEVER push directly to `main` — it's branch-protected. Always create a feature branch and PR.

## Git

- `main` is branch-protected — always push via a feature branch + PR. Branch prefixes: `feat/`, `fix/`, `chore/`, `docs/`.
- Atomic commits: each commit must be self-contained, pass lint + typecheck, and be safe to deploy on its own.
- Commit format: `<scope>(<feature-id>): <description>` — scopes: `web`, `convex`, `chore`
- Before committing: `bun run lint:fix && bun run typecheck`

## Auto-Ship

When I say "ship it": lint, typecheck, commit, push, `gh pr create`, `gh pr merge --squash --delete-branch`.

## When Something Surprises You

If you encounter something confusing or unexpected in this codebase, tell me about it. I'd rather fix the codebase than add more rules here.

## Self-Updating Rules

If you notice you are repeatedly making the same mistake or missing the same point — and a rule in this file would have prevented it — update this file directly with the lesson learned. Only add rules that encode a real, recurring pattern; do not add noise. Keep rules concise.
