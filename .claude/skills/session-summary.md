---
name: session-summary
description: Save session progress and decisions to agent/progress.md. Use at end of work session.
user-invocable: true
---

# Session Summary

Use this skill to document your work at the end of a session. This helps maintain context across sessions.

## Template for agent/progress.md

```markdown
## [Date] - [Brief Session Title]

**Focus:** [What you worked on]

### Completed
- [Task 1 completed]
- [Task 2 completed]

### Decisions Made
- [Decision 1 and rationale]
- [Decision 2 and rationale]

### Files Changed
- `path/to/file1.ts` - [Brief description of changes]
- `path/to/file2.ts` - [Brief description of changes]

### Next Steps
- [ ] [Task to continue]
- [ ] [Task to continue]

### Notes
- [Any important context for future sessions]
```

## How to Use

1. At the end of your session, append a summary to `agent/progress.md`
2. Include key decisions and rationale
3. List files changed for quick reference
4. Document blockers or issues encountered
5. Outline next steps for continuity

## Also Update

- `agent/features.json` - Update status of completed features
- `agent/scratchpad.md` - Clear or update working context

## Example Entry

```markdown
## 2024-01-15 - Convex Auth Utilities

**Focus:** Create reusable auth/authorization utilities

### Completed
- Created `packages/convex/convex/utils/auth.ts` with getCurrentUser helper
- Created `packages/convex/convex/utils/authorization.ts` with role checks
- Refactored users.ts, properties.ts, messages.ts to use new utilities

### Decisions Made
- Used function naming `getCurrentUser` to match common patterns
- Split auth (getting user) from authorization (checking permissions)
- Made throwing and non-throwing versions for different use cases

### Files Changed
- `convex/utils/auth.ts` - New file with getCurrentUser, getCurrentUserOrNull
- `convex/utils/authorization.ts` - New file with assertOwner, assertRole, etc.
- `convex/users.ts` - Refactored to use utilities (renamed import to avoid conflict)

### Next Steps
- [ ] Update remaining files (notifications.ts, savedProperties.ts)
- [ ] Add tests for utilities
```
