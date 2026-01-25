# Ralph Wiggum Autonomous Session

**Timestamp:** {{TIMESTAMP}}
**Branch:** {{GIT_BRANCH}}
**Modified files:** {{GIT_MODIFIED}} | **Untracked:** {{GIT_UNTRACKED}}

## Feature Backlog Status
- Done: {{DONE_COUNT}}
- In Progress: {{IN_PROGRESS_COUNT}}
- Blocked: {{BLOCKED_COUNT}}
- Todo: {{TODO_COUNT}}

## Current Feature: {{FEATURE_ID}}
**{{FEATURE_NAME}}**

---

## Your Task

You are working on feature **{{FEATURE_ID}}**: {{FEATURE_NAME}}

Complete this feature following these rules:

### Workflow
1. **Read first** - Explore related code before making changes
2. **Follow patterns** - Match existing code style exactly
3. **Incremental changes** - Make small, focused changes
4. **Verify** - Run typecheck and lint after changes

### After Implementation
1. Run `bunx biome check --write . && bun run typecheck`
2. If tests exist, run them
3. Update `agent/features.json`:
   - Set status to "done" if complete
   - Set status to "blocked" if stuck (add blockers array)
   - Add notes explaining what was done
4. Update `agent/scratchpad.md` with:
   - Decisions made
   - Files changed
   - Any issues encountered
5. Commit your changes with format: `feat(web): <description>`

### If Blocked
- Try 2 alternative approaches before marking as blocked
- Document what was tried in the notes field
- Be specific about what's blocking progress

### Guardrails
- NEVER commit to main branch
- NEVER skip verification (lint + typecheck)
- NEVER work on multiple features simultaneously
- NEVER force push or destructive git operations
- ALWAYS create focused, atomic commits

---

Work autonomously. Make reasonable decisions. Document everything.
