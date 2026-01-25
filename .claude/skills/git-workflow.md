---
name: git-workflow
description: Git workflow patterns for Piol. Use for commits, branches, PRs.
---

# Piol Git Workflow

## Branch Naming
- `feat/<ticket>-<description>` - New features
- `fix/<ticket>-<description>` - Bug fixes
- `chore/<description>` - Maintenance
- `docs/<description>` - Documentation

## Commit Messages
Format: `<scope>(<feature-id>): <description>`

Scopes: `web`, `convex`, `mobile`, `agent`, `chore`

Examples:
- `web(mvp-2): add property search filters`
- `convex(mvp-3): implement message pagination`
- `fix(auth): resolve Clerk token refresh issue`

## Before Committing
1. Run `bun run lint:fix`
2. Run `bun run typecheck`
3. Verify tests pass
4. Stage specific files (not `git add -A`)

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

## Dangerous Operations (Avoid)
- `git push --force` - Use `--force-with-lease` instead
- `git reset --hard` - Creates data loss risk
- `git push origin main` - Always use PRs
- `--no-verify` - Never skip hooks
