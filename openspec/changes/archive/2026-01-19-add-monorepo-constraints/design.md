# Design: Monorepo Conventions

## Context

Piol is a Turborepo monorepo with:
- **Apps**: `apps/web` (Next.js), `apps/mobile` (Expo, paused)
- **Packages**: `packages/convex`, `packages/ui`, `packages/config`, `packages/types`, `packages/env`
- **Backend**: Convex with functions living in a nested `convex/` subdirectory

Recent debugging revealed that structural misunderstandings (where files go, how env vars work) caused hard-to-diagnose runtime errors. This spec codifies conventions to prevent recurrence.

## Goals

1. Document the canonical monorepo structure
2. Define environment file conventions with consistency rules
3. Specify Convex package layout requirements
4. Define CI validation requirements

## Non-Goals

1. Automated linting of structure (future enhancement)
2. Migration tooling (one-time manual setup)
3. Multi-deployment support (dev vs prod handled externally)

## Decisions

### Decision 1: Package Structure Standard

**Choice**: Turborepo standard with apps/ and packages/ separation

```
piol/
├── apps/           # Deployable applications
│   ├── web/        # Next.js app
│   └── mobile/     # Expo app (paused)
├── packages/       # Shared internal packages
│   ├── convex/     # Backend (Convex functions in convex/ subdir)
│   ├── ui/         # Shared components
│   ├── config/     # Shared configs (eslint, tailwind, typescript)
│   └── types/      # Shared TypeScript types
```

**Rationale**: Industry standard for Turborepo projects. Clear separation between deployables and shared code.

### Decision 2: Convex Package Layout

**Choice**: Nested `convex/` directory for functions

```
packages/convex/
├── convex/           # Convex functions directory (required by Convex CLI)
│   ├── _generated/   # Auto-generated (gitignored except api.d.ts)
│   ├── schema.ts     # Database schema
│   ├── *.ts          # Function files (queries, mutations)
│   └── actions/      # External API actions
├── __tests__/        # Tests (import from ../convex/*)
├── package.json      # Exports point to ./convex/_generated/*
└── .env.local        # CONVEX_DEPLOYMENT for dev
```

**Rationale**: Convex CLI expects functions in a directory named `convex/`. Placing the package at `packages/convex` with functions in `packages/convex/convex/` is required for the monorepo pattern.

**Alternatives considered**:
- Flat structure (`packages/convex/*.ts`) — Rejected: Convex CLI won't find functions
- Root-level `convex/` — Rejected: Breaks Turborepo package structure

### Decision 3: Environment File Hierarchy

**Choice**: Root defaults + app-specific overrides

| File | Location | Contains | Committed |
|------|----------|----------|-----------|
| `.env.example` | root | Template with placeholder values | Yes |
| `.env.local` | root | Dev deployment, shared secrets | No |
| `.env.local` | apps/web | `NEXT_PUBLIC_*` vars for web | No |
| `.env.local` | packages/convex | `CONVEX_DEPLOYMENT` for convex dev | No |

**Critical constraint**: All `.env.local` files in a workspace MUST reference the same Convex deployment (dev or prod, not mixed).

**Rationale**: Mixing deployments causes runtime errors that are extremely hard to debug (functions exist in one deployment but not the other).

### Decision 4: CI Regression Gate

**Choice**: Turborepo-based CI from monorepo root

Requirements:
- CI MUST run from monorepo root using Turborepo
- All `turbo run lint test typecheck build` MUST pass before merge
- PR paths filter MUST match actual structure (`apps/**`, `packages/**`)

**Rationale**: Ensures all packages are validated together. Turborepo's caching makes this efficient.

## Risks / Trade-offs

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Spec becomes stale | Medium | Medium | Reference spec during onboarding |
| Devs ignore conventions | Medium | High | Automated validation (future) |
| Over-specification | Low | Low | Keep requirements minimal and focused |

## Migration Plan

1. Create spec documenting current conventions (this proposal)
2. No code changes required (spec is documentation)
3. Future: Add automated validation via lint rules

## Open Questions

1. Should we add a CI job to validate env file consistency?
   - **Recommendation**: Future enhancement, not part of this spec

2. Should package.json exports be validated by tooling?
   - **Recommendation**: TypeScript errors already catch misconfigurations
