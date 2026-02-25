# Contributing

This guide covers how to set up a development environment, follow the project's conventions, and contribute code to Piol.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Git Workflow](#git-workflow)
- [Code Style](#code-style)
- [Common Development Tasks](#common-development-tasks)
- [Testing](#testing)
- [PR Review Checklist](#pr-review-checklist)

## Prerequisites

- **Node.js** >= 20
- **Bun** >= 1.2 ([install](https://bun.sh/docs/installation))
- **Git**
- A code editor with Biome support (VS Code: [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome))

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd piol

# Install dependencies
bun install

# Set up environment variables (see docs/deployment.md)
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your keys

# Start development servers
bun run dev
```

The dev command starts both the Next.js dev server (with Turbopack) and the Convex dev server.

## Git Workflow

### Branch Naming

| Prefix | Use |
|--------|-----|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Maintenance, deps, tooling |
| `docs/` | Documentation changes |

Examples: `feat/property-search`, `fix/auth-redirect`, `chore/update-deps`

### Commit Format

```
<type>(<scope>): <description>
```

- **Types:** `feat`, `fix`, `chore`, `docs`, `refactor`
- **Scopes:** `web`, `convex`, `chore`
- **Example:** `web(mvp-2): wire properties to Convex`

### Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout main && git pull
   git checkout -b feat/my-feature
   ```

2. Make changes, ensuring they pass checks:
   ```bash
   bun run lint:fix     # Auto-fix lint issues
   bun run typecheck    # Verify types
   ```

3. Commit with conventional format:
   ```bash
   git add <files>
   git commit -m "feat(web): add property search filters"
   ```

4. Push and create PR:
   ```bash
   git push -u origin feat/my-feature
   gh pr create --title "feat(web): add property search filters"
   ```

5. PRs are **squash merged** into `main`.

### Rules

- **Never** commit directly to `main`
- **Never** skip pre-commit hooks (`--no-verify`)
- **Never** commit `.env` files or secrets
- Always run `bun run lint:fix && bun run typecheck` before pushing

## Code Style

### General

- **TypeScript everywhere** -- avoid `any` where possible
- **Biome** for linting and formatting (2 spaces, single quotes, semicolons, trailing commas)
- **File names:** kebab-case (e.g., `property-card.tsx`)
- **Component names:** PascalCase (e.g., `PropertyCard`)
- **Keep files under 300 LOC** when feasible

### Frontend Patterns

- **Server Components by default** -- use `"use client"` only when interactivity is needed
- **Convex hooks** for data: `useQuery`, `useMutation`, `useAction`
- **No hardcoded strings** -- use i18n (`apps/web/src/i18n/locales/`)
- **No hardcoded colors** -- use design tokens (`bg-primary`, not `#FF385C`)
- **Loading skeletons** for async data states
- **Error boundaries** for error handling
- **Mobile-first** responsive design (375px, 768px, 1024px breakpoints)

### Convex Backend Patterns

- **Always include `returns:` validators** on all functions. Use `v.null()` for void returns.
- **Never use `.filter()`** on Convex query builders. Define an index in `schema.ts` and use `.withIndex()` instead.
- **Auth check first** in every mutation: `const identity = await ctx.auth.getUserIdentity()`
- **Use `internalQuery`/`internalMutation`/`internalAction`** for functions not exposed to clients.
- **Index naming:** `by_field1_and_field2` matching the indexed fields.
- **Validate inputs** with Convex validators (`v.string()`, `v.number()`, etc.).

### shadcn/ui Components

Components are copied into `apps/web/src/components/ui/`. Install new ones with:

```bash
bunx --bun shadcn@latest add <component-name>
```

## Common Development Tasks

### Adding a New Page

1. Create the route file:
   ```
   apps/web/src/app/dashboard/my-feature/page.tsx
   ```

2. Add i18n keys to `apps/web/src/i18n/locales/en.json` and `fr.json`

3. If the page needs client-side interactivity, add `"use client"` at the top.

4. Use Convex hooks for data:
   ```tsx
   import { useQuery } from 'convex/react';
   import { api } from '@repo/convex/_generated/api';

   export default function MyFeaturePage() {
     const data = useQuery(api.myFeature.list);
     // ...
   }
   ```

### Adding a Convex Function

1. Create or edit a file in `packages/convex/convex/`:
   ```ts
   import { query, mutation } from './_generated/server';
   import { v } from 'convex/values';

   export const list = query({
     args: { city: v.optional(v.string()) },
     returns: v.array(v.object({ /* ... */ })),
     handler: async (ctx, args) => {
       // Use .withIndex(), not .filter()
       return await ctx.db
         .query('properties')
         .withIndex('by_city', (q) => q.eq('city', args.city))
         .collect();
     },
   });
   ```

2. If you add new query patterns, add a corresponding index to `schema.ts`.

3. Run `bun run test:convex` to verify.

### Adding Internationalization Strings

1. Add the English string to `apps/web/src/i18n/locales/en.json`
2. Add the French translation to `apps/web/src/i18n/locales/fr.json`
3. Both files must have matching keys.

## Testing

### Backend Tests (Vitest)

```bash
bun run test:convex                                    # All tests
cd packages/convex && bunx vitest run -t "test name"   # Single test
cd packages/convex && bunx vitest                      # Watch mode
```

Test files are in `packages/convex/__tests__/*.test.ts`.

### Frontend Tests (Jest)

```bash
bun run test:web                                       # All tests
cd apps/web && bunx jest path/to/test.tsx              # Single file
cd apps/web && bunx jest --coverage                    # With coverage
```

### E2E Tests (Playwright)

See [docs/e2e-testing.md](./e2e-testing.md) for full details.

```bash
cd apps/web && bunx playwright test                    # All E2E tests
cd apps/web && bunx playwright test --ui               # Interactive UI mode
```

### Pre-Commit Validation

Run before every commit:

```bash
bun run lint:fix && bun run typecheck
```

## PR Review Checklist

Before submitting a PR, verify:

- [ ] `bun run lint:fix` passes with no errors
- [ ] `bun run typecheck` passes with no errors
- [ ] All new/modified Convex functions have `returns:` validators
- [ ] No hardcoded strings (i18n keys for both `en` and `fr`)
- [ ] No hardcoded colors (use design tokens)
- [ ] Convex queries use `.withIndex()`, not `.filter()`
- [ ] New indexes added to `schema.ts` for new query patterns
- [ ] Tests added/updated for new functionality
- [ ] Mobile-responsive (test at 375px, 768px, 1024px)
- [ ] No `.env` files or secrets in the diff
- [ ] Commit messages follow the `<type>(<scope>): <description>` format
