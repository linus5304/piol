## Context

The MVP codebase has evolved organically with two competing color systems:
1. **Lime/Dark theme** in `globals.css` (primary: `#84cc16`)
2. **Coral/Airbnb theme** in hardcoded values and `packages/ui/tokens` (primary: `#FF385C`)

This creates visual inconsistency and breaks dark mode in several places.

## Goals / Non-Goals

**Goals:**
- Single source of truth for design tokens
- Consistent visual appearance across all 19 pages
- Proper dark mode support on all pages
- No hardcoded color values in component files

**Non-Goals:**
- Complete UI redesign (that's a separate initiative)
- Mobile app polish (paused until web stable)
- Adding new features or functionality

## Decisions

### Decision 1: Choose Coral Palette
**What:** Adopt the coral palette (`#FF385C`) as the primary brand color
**Why:**
- Housing marketplace convention (Airbnb, Zillow use warm colors)
- Already defined in `packages/ui/tokens` with full token set
- Better emotional fit for "finding a home"

**Alternatives considered:**
- Keep lime: Unique but cold, not housing-appropriate
- New palette: Unnecessary scope creep

### Decision 2: CSS Variables Over Hardcoded Colors
**What:** All component colors via `var(--color-*)` not hex values
**Why:**
- Enables dark mode toggle
- Single place to update theme
- Standard shadcn/ui pattern

### Decision 3: Deduplicate to `/components/properties/`
**What:** Move canonical `property-card.tsx` to `/components/properties/`, delete duplicate
**Why:**
- `/components/properties/` already has skeleton and index
- More organized component structure
- Clear domain grouping

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Visual regression | Manual review of all 19 pages after changes |
| Breaking existing tests | Run full test suite after each phase |
| Time creep | Strict scope per polish-* feature |

## Migration Plan

1. **Phase 1** (polish-1): Update `globals.css` with coral theme
2. **Phase 2** (polish-2): Fix `/properties` and `/properties/[id]`
3. **Phase 3** (polish-3): Fix dashboard pages
4. **Phase 4** (polish-4): Deduplicate components
5. **Phase 5** (polish-5): Add missing shadcn components

Each phase is a separate commit with visual verification.

## Open Questions

- Q: Should we add a theme toggle for light/dark mode?
- A: Out of scope for this change. Current focus is making dark mode work correctly.
