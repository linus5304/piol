# Design: Development & Testing Infrastructure

## Context

Piol is an MVP with real-time Convex backend. We need to:
- Verify features work before marking them done
- Have realistic data for development and demos
- Establish simple, repeatable testing patterns

**Stakeholders**: Developers, AI agents working on the codebase

**Constraints**:
- Keep tooling minimal (no new dependencies if possible)
- Tests must run fast (< 30 seconds for full suite)
- Seed data must work with both local and deployed Convex

## Goals / Non-Goals

**Goals:**
- Seed data covers all schema fields with realistic Cameroon content
- Convex queries have unit tests verifying correct data shape
- Web pages have integration tests verifying they render with data
- One command to seed database, one command to run all tests

**Non-Goals:**
- End-to-end browser tests (Playwright exists but out of scope)
- 100% test coverage (focus on critical paths)
- Performance testing
- Mocking Convex in React tests (use convex-test for Convex, skip Convex in component tests)

## Decisions

### 1. Seed Data Strategy

**Decision**: Enhance existing seed scripts, use Unsplash for placeholder images

**Why**:
- Seed already exists at `packages/convex/convex/seed/`
- Unsplash provides free, high-quality placeholder images via URL
- No file uploads needed (images are URLs, not Convex storage)

**Structure**:
```
packages/convex/convex/seed/
├── data/
│   ├── properties.json   # Full property data (10+ properties)
│   ├── users.json        # Landlord + renter profiles
│   └── reviews.json      # Sample reviews
├── index.ts              # Entry point
├── properties.ts         # Property seeding logic
├── users.ts              # User seeding logic
└── reviews.ts            # Review seeding logic (NEW)
```

### 2. Testing Strategy

**Decision**: Three test layers, each with clear purpose

| Layer | Tool | Tests | Location |
|-------|------|-------|----------|
| Convex queries | vitest + convex-test | Query returns correct shape | `packages/convex/__tests__/` |
| React components | Jest + RTL | Component renders correctly | `apps/web/src/__tests__/` |
| Integration (manual) | Dev server + seed data | Full flow works | Manual verification |

**Why not mock Convex in React tests?**
- Complex and brittle
- `convex-test` already provides in-memory Convex for query tests
- Component tests focus on rendering, not data fetching

### 3. Test Patterns

**Convex Query Test Pattern**:
```typescript
import { convexTest } from 'convex-test';
import { api } from '../convex/_generated/api';
import schema from '../convex/schema';

describe('properties.getProperty', () => {
  it('returns property with landlord and reviews', async () => {
    const t = convexTest(schema);
    
    // Seed test data
    const landlordId = await t.run(async (ctx) => {
      return ctx.db.insert('users', { /* ... */ });
    });
    const propertyId = await t.run(async (ctx) => {
      return ctx.db.insert('properties', { landlordId, /* ... */ });
    });
    
    // Run query
    const result = await t.query(api.properties.getProperty, { propertyId });
    
    // Assert shape
    expect(result).toMatchObject({
      _id: propertyId,
      landlord: { _id: landlordId },
      reviews: { count: 0 },
    });
  });
});
```

**React Component Test Pattern** (no Convex):
```typescript
import { render, screen } from '@testing-library/react';
import { PropertyCard } from '@/components/property-card';

// Test with mock data, not Convex query
const mockProperty = { /* realistic mock */ };

it('renders property title', () => {
  render(<PropertyCard property={mockProperty} />);
  expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
});
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Seed data gets stale vs schema | Seed script validates against schema on run |
| Tests slow down development | Keep test count low, only critical paths |
| Unsplash URLs break | Use stable Unsplash source URLs, fallback to placeholder |

## Migration Plan

1. Enhance seed data (no migration, additive)
2. Add Convex query tests (additive)
3. Add web component tests (additive)
4. Document test commands in README

**Rollback**: Delete test files, revert seed changes. No production impact.

## Open Questions

1. Should we add Playwright e2e tests now or defer to later MVP?
   - **Recommendation**: Defer. Manual testing with seed data is sufficient for MVP.

2. Should seed data include sample images in Convex storage?
   - **Recommendation**: No. Use Unsplash URLs for now. Storage images can come in mvp-4 (create property).
