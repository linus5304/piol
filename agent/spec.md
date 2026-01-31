# Feature: TypeScript Cleanup

## Problem
There are TypeScript errors in the mobile app and convex packages that need to be fixed for a clean build.

## Requirements
- Fix implicit `any` types in mobile app FlashList components
- Fix implicit `any` types in convex payments actions
- Fix undefined parameter issues in convex properties queries
- Ensure `bun run typecheck` passes for all packages

## Constraints
- Use existing patterns from the codebase
- Add proper type annotations instead of `any`
- Don't change functionality, only add types
