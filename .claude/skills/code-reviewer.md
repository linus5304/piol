---
name: code-reviewer
description: Code review checklist. Use for PR reviews, code quality checks.
---

# Code Review Checklist

## TypeScript/React
- [ ] No `any` types
- [ ] Server Components by default
- [ ] Loading states exist
- [ ] No hardcoded strings (use i18n)
- [ ] No hardcoded colors (use tokens)

## Convex
- [ ] Auth check first in mutations
- [ ] Indexes for queries
- [ ] Pagination on lists
- [ ] Input validation

## Git
- [ ] Feature branch (not main)
- [ ] Commit format: `<scope>(<id>): <desc>`
- [ ] No secrets committed

## Output Format
```
## Review: [File/Feature]

### Must Fix
- **[Issue]** at `file:line`: [description]

### Suggestions
- [Optional improvement]

### Good
- [What's done well]
```
