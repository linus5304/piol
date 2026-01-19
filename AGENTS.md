<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

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

## Required Setup

### Convex Environment Variables

Set these in **Convex Dashboard → Settings → Environment Variables** (not in `.env.local`):

| Variable | Description | Where to find |
|----------|-------------|---------------|
| `CLERK_JWT_ISSUER_DOMAIN` | Your Clerk domain (e.g., `your-app.clerk.accounts.dev`) | Clerk Dashboard → API Keys |

Without this, you'll see: `"No auth provider found matching the given token (no providers configured)"`

### Clerk JWT Template

Create a JWT template named `convex` in **Clerk Dashboard → JWT Templates** with default claims.

### Seed Data

After setting up auth, seed realistic data:

```bash
bun run seed        # Populate with test properties
bun run seed:reset  # Clear and re-seed
```

The seed uses your real user (linus@truesignaldigital.com) as a landlord if it exists in Convex.

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
- **Commits:** `<scope>(<feature-id>): <description>` (e.g., `web(mvp-2): wire properties to Convex`)
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

## Agent Harness (Ralph Wiggum)

Session-based workflow for AI agents. Keeps context minimal, tracks progress across sessions.

### Files

| File | Purpose |
|------|---------|
| `agent/features.json` | MVP backlog with status, priority, acceptance criteria |
| `agent/progress.md` | Session history (append-only) |
| `agent/scratchpad.md` | Current working context (not committed, ephemeral) |
| `agent/init.sh` | Run at session start to see context |

### Session Workflow

**Start of session:**
```bash
./agent/init.sh
```

This shows:
- Uncommitted work warning (if any — fix before proceeding!)
- Feature status summary
- Next feature to work on
- Current context from scratchpad
- Last session summary

**During session:**
1. Create a feature branch (if not already on one): `git checkout -b feat/<feature-id>-<description>`
2. Work on ONE feature only (the one from init.sh)
3. Update `agent/scratchpad.md` with decisions and notes
4. When feature complete, update `agent/features.json`:
   - Set status to `"done"`
   - Add notes about what was done

**End of session:**
1. Append entry to `agent/progress.md`:
   ```markdown
   ## Session: YYYY-MM-DD HH:MM
   
   **Focus**: [feature id and name]
   **Outcome**: completed | partial | blocked
   
   ### Done
   - [What was accomplished]
   
   ### Blockers
   - [What's blocking, if any]
   
   ### Decisions
   - [Key decisions made]
   
   ### Next
   - [Recommended next steps]
   ```
2. Update `agent/scratchpad.md` with context for next session
3. Commit changes
4. **Stop.** Human reviews, then starts new session.

### Feature Status

| Status | Meaning |
|--------|---------|
| `todo` | Not started |
| `in_progress` | Currently being worked on (max 1) |
| `blocked` | Waiting on external factor |
| `done` | Verified complete |

### Why This Workflow

- **Fresh context each session** — Prevents agent degradation from context overload
- **Human checkpoint** — Review between sessions catches mistakes early
- **External state** — Files are memory, not conversation history
- **One feature focus** — Prevents scope creep

### Branch Workflow

**NEVER commit directly to main.** Each feature gets its own branch.

```bash
# 1. Start feature on new branch (from main)
git checkout main && git pull
git checkout -b feat/mvp-2-properties-convex

# 2. Work, commit, push
# ... do work ...
git push -u origin HEAD

# 3. Create PR to main when done
gh pr create --title "web(mvp-2): wire properties to Convex"
```

**Branch naming:** `<type>/<feature-id>-<description>`
- Types: `feat/`, `fix/`, `chore/`
- Example: `feat/mvp-2-properties-convex`, `fix/mvp-3-image-loading`

### Commit Protocol

The project uses pre-commit hooks (Husky + lint-staged + Biome) that auto-format code. To avoid messy commits:

**Two commits per feature:**

```bash
# 1. Format code first (prevents pre-commit hook from modifying files)
bunx biome check --write .

# 2. Stage and commit feature code
git add apps/ packages/
git commit -m "web(mvp-2): wire properties to Convex"

# 3. Stage and commit agent state
git add agent/features.json agent/progress.md
git commit -m "agent: complete mvp-2"

# 4. IMPORTANT: Check for missed files before pushing
git status  # Should show nothing untracked (except gitignored)
```

**Commit message format:**
```
<scope>(<feature-id>): <description>

Scopes: web | convex | mobile | agent | chore
Feature ID: mvp-1, mvp-2, etc. (omit for non-feature work)
```

**Why two commits:**
- Feature code is reviewable and revertable independently
- Agent state tracks progress without polluting feature history
- `git log --grep="web"` shows only product changes

**What's NOT committed:**
- `agent/scratchpad.md` — Ephemeral session context (gitignored)
