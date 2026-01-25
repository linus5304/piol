---
description: Create a pull request with proper format
---

1. Check current branch and ensure not on main
2. Run `git diff main...HEAD` to see all changes
3. Run `git log main..HEAD --oneline` for commit history
4. Push branch if needed: `git push -u origin $(git branch --show-current)`
5. Create PR with gh:

```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<bullets>

## Test Plan
- [ ] Tests pass locally
- [ ] Manual verification done

🤖 Generated with Claude Code
EOF
)"
```

Return the PR URL when done.
