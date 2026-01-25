---
name: security-reviewer
description: Security audit checklist. Use for security reviews, vulnerability checks.
---

# Security Review Checklist

## Authentication
- [ ] All mutations check `ctx.auth.getUserIdentity()`
- [ ] Role-based access where needed
- [ ] No privilege escalation

## Input Validation
- [ ] All inputs validated
- [ ] No SQL/injection vulnerabilities
- [ ] XSS prevention (no raw HTML)

## Secrets
- [ ] No secrets in code
- [ ] Environment variables used correctly
- [ ] .env files not committed

## Search Commands
```bash
rg -i "(password|secret|api.?key|token)" --type ts
rg "dangerouslySetInnerHTML" apps/web/
rg "getUserIdentity" packages/convex/
```

## Output Format
```
## Security Review

### Critical
- **[Issue]**: [risk] → [fix]

### Warnings
- [Potential issues]

### Recommendations
- [Improvements]
```
