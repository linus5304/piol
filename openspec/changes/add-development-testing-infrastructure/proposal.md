# Change: Add Development & Testing Infrastructure

## Why

Current state:
- Seed data is minimal (3 properties, no amenities/images/descriptions)
- No way to verify features work with realistic data
- Convex tests exist but web tests are incomplete
- No integration tests for pages that query Convex

This makes it hard to:
- Confidently ship features (mvp-3 was "done" but untested with real data)
- Demo the product to stakeholders
- Develop UI against realistic content

## What Changes

### 1. Realistic Seed Data
- Enhance seed to include full property details (amenities, descriptions, images)
- Add more variety (different cities, property types, price ranges)
- Include realistic landlord profiles
- Provide CLI command to seed/reset data easily

### 2. Testing Strategy
- Add Convex query tests for critical queries
- Add integration tests for Convex-connected pages
- Establish patterns for testing pages that use `useQuery`
- Keep tests simple and focused (no complex mocking frameworks)

## Impact

- Affected specs: NEW `seed-data`, NEW `testing-strategy`
- Affected code:
  - `packages/convex/convex/seed/` - Enhanced seed data
  - `packages/convex/__tests__/` - Query tests
  - `apps/web/src/__tests__/` - Component integration tests
  - `package.json` - Test scripts

## Design Principles

1. **Minimal complexity**: Use existing tools (vitest, convex-test, Jest)
2. **Realistic but fake**: Seed data looks real but is obviously test data
3. **Fast feedback**: Tests run in seconds, not minutes
4. **Consistency**: Same patterns across Convex and web
