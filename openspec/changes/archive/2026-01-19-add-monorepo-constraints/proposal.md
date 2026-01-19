# Change: Add Monorepo Conventions Specification

## Why

The error where `properties:listProperties` was not found had two root causes:
1. Convex functions placed at wrong path (`packages/convex/` instead of `packages/convex/convex/`)
2. Web app `.env.local` pointing to production deployment instead of dev

These are **structural/configuration issues** with no automated enforcement. Without documented conventions and validation, similar errors will recur as the codebase grows.

## What Changes

- Add new `monorepo-conventions` capability spec documenting:
  - Package structure requirements (Turborepo apps/packages layout)
  - Convex package layout (functions in `convex/` subdirectory)
  - Environment file conventions and consistency rules
  - CI regression gate requirements
  - Package exports requirements for internal packages

## Impact

- Affected specs: New `monorepo-conventions` capability
- Affected code: None (documentation/specification only)
- No breaking changes to existing functionality
- Provides authoritative reference for troubleshooting structural issues
