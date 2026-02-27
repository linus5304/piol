---
name: git-workflow
description: Git workflow patterns for Piol. Use for commits, branches, PRs.
---

# Piol Git Workflow

> For core git rules, see `.claude/rules/git.md` (loaded automatically).

## Creating PRs
1. Push branch: `git push -u origin <branch>`
2. Create PR with `gh pr create`
3. Link to issue if applicable
4. Wait for CI checks

## PR Template
```
## Summary
<1-3 bullet points>

## Test Plan
- [ ] Manual testing steps
- [ ] Unit tests pass
- [ ] E2E tests pass

## Screenshots (if UI changes)

🤖 Generated with Claude Code
```

## Git Worktrees (Parallel Development)

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
