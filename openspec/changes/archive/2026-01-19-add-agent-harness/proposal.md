# Change: Add Agent Development Harness (Ralph Wiggum)

## Why

AI agents working on Piol lack session continuity—each new session starts from scratch without knowing what was worked on, what's blocked, or what decisions were made. The MVP checklist in `AGENTS.md` isn't machine-readable, making it impossible for agents to systematically work through features or track completion. This leads to:

- Duplicate work across sessions
- Lost context on technical decisions
- No clear prioritization
- Inability to verify completion

## What Changes

- Add `agent/` directory at project root with:
  - `features.json` — Machine-readable MVP backlog with status, priority, and acceptance criteria
  - `progress.md` — Session handoff log (what was done, blockers, next steps)
  - `scratchpad.md` — Current working context (decisions, notes, links)
  - `init.sh` — Session startup script for agents
- Update `AGENTS.md` to reference agent harness and define workflow
- Define verification criteria for each MVP feature

## Impact

- Affected specs: New `agent-harness` capability
- Affected code: `AGENTS.md` (documentation update)
- No breaking changes to existing functionality

## Design Rationale

### OpenSpec + Ralph Wiggum Integration

| Concern | Handled By | Purpose |
|---------|------------|---------|
| What to build | OpenSpec specs | Requirements, scenarios, acceptance criteria |
| How to change | OpenSpec changes | Proposals, design docs, task lists |
| How to work | Agent harness | Session flow, progress tracking, handoffs |
| What's done | Both | OpenSpec tracks specs, harness tracks features |

### Why Not Inside OpenSpec Directory?

- OpenSpec is for *specification artifacts* (specs, changes)
- Agent harness is for *workflow artifacts* (progress, context)
- Keeping them separate makes roles clear
- `agent/` at root is visible and accessible

### Feature Status Model

```
todo → in_progress → blocked → done
```

- `todo` — Not started
- `in_progress` — Currently being worked on (max 1)
- `blocked` — Waiting on external factor (document why)
- `done` — Verified working

### Verification Requirements

Each feature needs explicit acceptance criteria that agents can verify:
- Route accessible and renders
- Data flows from Convex
- User actions work end-to-end
- Tests pass (where applicable)

## Risks

- **Over-engineering**: Mitigated by keeping harness minimal (4 files)
- **Stale state**: Mitigated by requiring updates at session end
- **Conflict with OpenSpec**: Avoided by clear separation of concerns
