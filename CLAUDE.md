# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Piol is a Cameroon housing marketplace where renters find verified properties, pay via mobile money (MTN MoMo, Orange Money), and message landlords.

## Tech Stack

- **Backend:** Convex (serverless + realtime DB), Clerk auth
- **Web:** Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, shadcn/ui
- **Mobile:** Expo 52, React Native (paused until web MVP done)
- **Monorepo:** Turborepo + Bun

## Common Commands

```bash
bun install                 # Install dependencies
bun run dev                 # Web + Convex dev servers
bun run dev:convex          # Convex only
bun run lint:fix            # Biome auto-fix
bun run format              # Biome format
bun run typecheck           # TypeScript check
bun run test:convex         # Convex tests (vitest)
bun run test:web            # Web tests (jest)
bun run seed                # Populate test data
bun run seed:reset          # Clear and re-seed
```

### Adding shadcn/ui Components

```bash
bunx --bun shadcn@latest add <component-name>
```

## Verification Commands

```bash
# Type check entire project
bun run typecheck

# Type check specific package
cd apps/web && bunx tsc --noEmit
cd packages/convex && bunx tsc --noEmit

# Run single Convex test
cd packages/convex && bunx vitest run -t "test name"

# Run single Convex test file
cd packages/convex && bunx vitest run __tests__/properties.test.ts

# Run web tests
cd apps/web && bunx jest

# Lint check (no auto-fix)
biome check .

# Quick validation before commit
bun run lint:fix && bun run typecheck

# Verify Convex schema compiles
cd packages/convex && bunx convex dev --once
```

## Guardrails

- NEVER commit directly to main - always use feature branches
- NEVER skip pre-commit hooks (--no-verify)
- NEVER commit .env files or secrets
- Always run `bun run typecheck` before creating PRs
- Always run `bun run lint:fix` before committing
- Verify Convex schema compiles after schema changes

## Testing

### Convex Backend
```bash
bun run test:convex                                    # All tests
cd packages/convex && bunx vitest run -t "test name"   # Single test
cd packages/convex && bunx vitest                      # Watch mode
```

Test files: `packages/convex/__tests__/*.test.ts`

### Web App
```bash
bun run test:web                                       # All tests
cd apps/web && bunx jest path/to/test.tsx              # Single file
cd apps/web && bunx jest --coverage                    # With coverage
```

## Monorepo Structure

```
apps/
  web/                      # Next.js 16 web app (@repo/web)
  mobile/                   # Expo React Native app (@repo/mobile)
packages/
  convex/                   # Convex backend functions + schema (@repo/convex)
  ui/                       # Shared UI components (@repo/ui)
  types/                    # Shared TypeScript types (@repo/types)
  config/                   # Shared config (@repo/config)
  env/                      # Environment variable handling (@repo/env)
```

## Architecture

### Convex Backend (`packages/convex/convex/`)

- **Schema:** `schema.ts` is the source of truth for all data models
- **Queries:** Read-only, real-time subscriptions
- **Mutations:** Write ops, always verify auth first with `ctx.auth.getUserIdentity()`
- **Actions:** External API calls (payments, webhooks)
- **Patterns:**
  - Validate inputs with zod
  - Auth check first in every mutation
  - Indexes for every query path (no table scans)
  - Paginate lists (max 100 items)

### Web App (`apps/web/src/`)

- `app/` - Next.js App Router pages
- `components/` - React components
- `hooks/` - Custom React hooks
- `lib/` - Utilities and helpers
- `i18n/` - Internationalization

**Frontend patterns:**
- Server Components by default, Client only when interactive
- Convex hooks for data (`useQuery`, `useMutation`)
- Loading skeletons, error boundaries
- No hardcoded strings (use i18n)
- No hardcoded colors (use design tokens: `bg-primary` not `#FF385C`)

## Code Style

- **TypeScript everywhere**, avoid `any`
- **Biome** for formatting (2 spaces, single quotes, semicolons)
- **Files:** kebab-case, keep under 300 LOC when feasible
- **Components:** PascalCase
- **Fonts:** Use Geist fonts only:
  - `import { GeistSans } from 'geist/font/sans'`
  - `import { GeistMono } from 'geist/font/mono'`

### Git Workflow

- Never commit to main directly
- Branch naming: `feat/`, `fix/`, `chore/`, `docs/`
- Commit format: `<scope>(<feature-id>): <description>`
  - Scopes: `web`, `convex`, `mobile`, `agent`, `chore`
  - Example: `web(mvp-2): wire properties to Convex`
- Squash merge PRs

### Parallel Development with Git Worktrees

For working on multiple features simultaneously:

```bash
# Create worktree for new feature
git worktree add ../piol-feature-x feat/feature-x

# List worktrees
git worktree list

# Remove when done
git worktree remove ../piol-feature-x
```

Each worktree is a separate Claude Code session context.

## OpenSpec (Spec-Driven Development)

For new features, breaking changes, or architecture shifts, use OpenSpec:

1. Read `openspec/AGENTS.md` for the full workflow
2. Create proposals in `openspec/changes/<change-id>/`
3. Run `openspec validate <change-id> --strict --no-interactive`

Skip proposals for: bug fixes, typos, dependency updates, config changes.

## Agent Harness

Session-based workflow for AI agents. Key files:

- `agent/features.json` - MVP backlog with status
- `agent/progress.md` - Session history (append-only)
- `agent/scratchpad.md` - Current working context (gitignored)
- `agent/init.sh` - Run at session start

### Session Workflow

```bash
./agent/init.sh             # Start of session - see context
# Work on ONE feature only
# Update agent/scratchpad.md with decisions
# When done, update agent/features.json status to "done"
# Append entry to agent/progress.md
# Commit: feature code first, then agent state separately
```

## Autonomous Mode

When user says "autonomous mode", "full auto", or similar:

1. Don't ask clarifying questions - make reasonable decisions
2. Document decisions in code comments or agent/scratchpad.md
3. If blocked, try 2 alternative approaches before asking
4. Always run typecheck + lint before considering task done
5. Update agent/features.json and progress.md when complete

## Auto-Ship Mode

When user says "auto-ship", "ship it", "commit and deploy", or similar after completing a feature/fix:

**Automatically perform the full deployment pipeline:**

1. **Verify** - Run `bunx biome check --write . && bun run typecheck`
2. **Branch** - `git checkout -b feat/<feature-name>` or `fix/<fix-name>`
3. **Commit** - Stage and commit with conventional commit format
4. **Push** - `git push -u origin <branch>`
5. **PR** - `gh pr create --title "<title>" --body "<summary>"`
6. **Merge** - `gh pr merge <pr-number> --squash --delete-branch`
7. **Deploy** - Convex auto-deploys on merge to main via GitHub Actions

**Trigger phrases:**
- "ship it" / "auto-ship" / "deploy"
- "commit, PR, merge" / "full pipeline"
- "proceed with deployment"

**Commit message format:**
```
<type>(<scope>): <description>

<body>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`
Scopes: `web`, `convex`, `mobile`, `agent`

### Prompting Patterns for UI Work

**Pattern 1: Task + Constraints + Verification (Recommended)**
```
Implement [feature]:
- [Requirement 1]
- [Requirement 2]

Constraints:
- Mobile-first (375px, 768px, 1024px)
- Use existing shadcn components
- No hardcoded colors (use tokens)
- No hardcoded strings (use i18n)

When done:
1. Run typecheck and lint
2. List files changed
3. Note any decisions made
```

**Pattern 2: Reference-Based Implementation**
```
Look at [existing-file.tsx] for the pattern.
Now create [new-file.tsx] following the same patterns for:
- Data fetching, loading states, error handling
Match the existing code style exactly.
```

**Pattern 3: Iterative with Checkpoints**
```
Build [feature]. Work in phases:
Phase 1: Component shell with props interface
Phase 2: Add [sub-feature 1]
Phase 3: Add [sub-feature 2]
After each phase, show what you built before continuing.
```

**Pattern 4: Full Autonomous**
```
I'm stepping away. Complete these from agent/features.json:
- [feature-id-1]
- [feature-id-2]

For each:
1. Read the feature spec
2. Explore related code first
3. Implement following existing patterns
4. Run typecheck and lint
5. Update features.json status to "done"
6. Append summary to progress.md

Don't ask questions - make reasonable decisions and document them.
```

### Daily Development Prompt Template

```
## Task
[What you want built]

## Reference
[Existing file to mimic, or skip if new pattern]

## Constraints
- Use existing shadcn components (install if needed)
- Mobile-first (375px, 768px, 1024px)
- No hardcoded colors (use tokens)
- No hardcoded strings (use i18n or placeholders)

## Verification
When complete:
1. bun run typecheck
2. bun run lint:fix
3. List all files changed
4. Note any decisions you made

## Autonomy Level
[Pick one]
- Ask me before major decisions
- Make reasonable decisions, document them
- Full auto - only stop if blocked
```

## Environment Setup

### Convex Environment Variables

Set in **Convex Dashboard > Settings > Environment Variables** (not `.env.local`):
- `CLERK_JWT_ISSUER_DOMAIN` - Your Clerk domain

### Clerk JWT Template

Create a JWT template named `convex` in Clerk Dashboard with default claims.

## Key Files

- `packages/convex/convex/schema.ts` - Database schema (source of truth)
- `apps/web/src/app/layout.tsx` - Root layout with providers
- `turbo.json` - Turborepo task configuration
- `biome.json` - Linter/formatter configuration
