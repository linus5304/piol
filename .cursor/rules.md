# Code Rules

## Style

- TypeScript everywhere, avoid `any`
- Biome for formatting (`bun run format`)
- Files <300 LOC when feasible

## Frontend

- Server Components by default, Client only when interactive
- Convex hooks for data (`useQuery`, `useMutation`)
- Loading skeletons, error boundaries
- No hardcoded strings (use i18n)
- **No hardcoded colors** - use design tokens (`bg-primary`, not `#FF385C`)
- See `.cursor/skills/ui-engineer.md` for UI patterns

## Convex

- Validate inputs with zod
- Auth check first in every mutation
- Indexes for every query path (no table scans)
- Paginate lists (max 100 items)

## Git

- Never commit to main directly
- Branch: `feat/`, `fix/`, `chore/`, `docs/`
- Commit: `<scope>: <description>`
- Squash merge PRs
