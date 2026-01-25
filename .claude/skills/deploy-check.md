---
name: deploy-check
description: Verify deployment readiness before creating PRs. Runs typecheck, lint, and tests.
---

# Deploy Readiness Check

Run this skill before creating a PR to verify the codebase is ready for deployment.

## Verification Steps

### 1. TypeScript Check
```bash
bun run typecheck
```

### 2. Lint Check
```bash
bunx biome check .
```

### 3. Run Tests
```bash
bun run test:convex   # Convex backend tests
bun run test:web      # Web app tests
```

### 4. Convex Schema Validation
```bash
cd packages/convex && bunx convex dev --once
```

## Checklist

- [ ] No TypeScript errors in changed files
- [ ] No lint errors (run `bunx biome check --write .` to auto-fix)
- [ ] All tests pass
- [ ] No console.logs in production code (except error handling)
- [ ] No hardcoded secrets or credentials
- [ ] No TODO comments that should be addressed
- [ ] Convex schema compiles successfully

## Common Issues

### Pre-existing test errors
Some test files have pre-existing type compatibility issues. Focus on verifying your changes don't introduce new errors.

### Mobile app errors
The mobile app is paused. Ignore errors from `apps/mobile`.

## Quick Validation
```bash
bunx biome check --write . && bun run typecheck
```
