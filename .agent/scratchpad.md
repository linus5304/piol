# Piol Development Scratchpad

> Current session context, decisions, and blockers. This file is for capturing in-flight work.

---

## Current Focus

**Feature:** Architecture patterns update
**Status:** Completed — added Lee Rob + Next.js patterns

---

## Active Decisions

### Architecture Decisions
- Using Convex for backend (serverless functions + real-time database)
- Clerk for authentication (webhooks sync to Convex users table)
- Next.js 16 App Router for web
- Expo Router for mobile
- Turborepo for monorepo management

### New Architecture Patterns (from Lee Rob + Next.js docs)
- **Route groups:** `(marketing)` for public pages, `(app)` for dashboard
- **Content as code:** Inline marketing content in JSX, not translation keys
- **i18n strategy:** French as source, build-time AI translation for English
- **Agent-friendly:** Greppable content, explicit imports, flat components

### Open Questions
- [ ] Is Clerk webhook properly configured for user sync?
- [ ] Should we restructure routes to use `(marketing)` and `(app)` groups?
- [ ] Build-time translation script needed?
- [ ] Mobile app status — how much is implemented?

---

## Current Blockers

None currently.

---

## Recent Context

### Files Modified This Session
- `.agent/features.json` — Created with 130 features
- `.agent/progress.md` — Created session log
- `.agent/scratchpad.md` — Created (this file)
- `.agent/init.sh` — Created smoke test script
- `docs/ARCHITECTURE_PATTERNS.md` — NEW: Route groups, i18n, agent patterns
- `AGENTS.frontend.md` — Updated with new patterns
- `AGENTS.md` — Added harness workflow section

### Key Findings
- Project has solid architecture docs (AGENTS.md, AGENTS.backend.md, etc.)
- Schema is well-defined with proper indexes
- Web app has basic routes but many features need implementation
- Homepage has hardcoded French + uses translation keys (inconsistent)
- Current structure mixes marketing and app without route groups

---

## Notes for Next Session

1. Run `init.sh` to verify dev environment works
2. Manually test auth flow (sign-up → sign-in → dashboard)
3. Update `features.json` status based on actual testing
4. Start implementing from highest-priority failing features

---

## Useful Commands

```bash
# Start everything
bun run dev:all

# Just web
bun run dev:web

# Just convex
bun run dev:convex

# Seed database
bun run seed

# Check types
bun run typecheck
```

---

## Links

- [AGENTS.md](../AGENTS.md) — System architecture
- [AGENTS.backend.md](../AGENTS.backend.md) — Convex patterns
- [AGENTS.frontend.md](../AGENTS.frontend.md) — Next.js patterns
- [Schema](../packages/convex/schema.ts) — Data model
