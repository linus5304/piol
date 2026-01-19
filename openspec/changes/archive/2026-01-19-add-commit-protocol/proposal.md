# Change: Add Commit Protocol for Agent Harness

## Why

The project has pre-commit hooks (Husky + lint-staged + Biome) that auto-format code. When AI agents commit without formatting first:
1. Biome modifies files during commit
2. Those modifications aren't staged
3. Leftover changes leak into next commit
4. Commits become messy and hard to track

Additionally, there's no clear separation between:
- Feature code changes (what the agent built)
- Agent state changes (progress tracking)

## What Changes

- Add `agent/scratchpad.md` to `.gitignore` (ephemeral, not tracked)
- Update `AGENTS.md` with commit protocol
- Modify agent-harness spec to include commit requirements

## Impact

- Affected specs: `agent-harness` (MODIFIED)
- Affected files: `.gitignore`, `AGENTS.md`
- No breaking changes
