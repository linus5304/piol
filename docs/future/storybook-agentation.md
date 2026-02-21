# Storybook + Agentation + Opus 4.6

> **Status:** Deferred until post-MVP launch
> **Prerequisites:** MVP shipped, core features (payments, applications, lease) complete
> **Trigger:** Hand this file to Claude and say "set this up"

## Concept

Use Storybook as a visual component development/testing layer, with Claude agents (Opus 4.6) automating story generation, visual review, and UI regression testing.

## Why

- Frontend test coverage is minimal (~2 test files for entire web app)
- No visual regression testing
- No component catalog or design system documentation
- As the team grows, UI consistency becomes harder to maintain manually

## Architecture

```
Storybook (component isolation + visual testing)
    |
    v
Claude Agent (Opus 4.6)
    |-- Auto-generates stories from components
    |-- Screenshots each story variant
    |-- Reviews against design tokens
    |-- Flags inconsistencies in PRs
    |
    v
Chromatic or Percy (optional - visual regression CI)
```

## Implementation Plan

### Phase 1: Storybook Setup (~1 day)

1. Install Storybook in `apps/web`
   ```bash
   cd apps/web && npx storybook@latest init
   ```
2. Configure for Tailwind v4 + Next.js 16 + React 19
3. Add to Turborepo tasks in `turbo.json`
4. Verify shadcn components render correctly in isolation

### Phase 2: Core Stories (~1 day with Claude)

Write stories for high-value components first:
- PropertyCard (all states: loading, verified, unverified, saved, error)
- SearchBar + Filters
- MessageThread
- PaymentFlow states
- DashboardLayout (mobile, tablet, desktop)

Use Claude to auto-generate:
```
Read apps/web/src/components/property-card.tsx and write a Storybook story
that covers all variants, states (loading, error, empty), and responsive
breakpoints (375px, 768px, 1024px). Use existing design tokens only.
```

### Phase 3: Agent-Powered Visual Review (~1 day)

Create a Claude skill or CI workflow that:
1. Runs Storybook build
2. Screenshots every story at 3 breakpoints
3. Compares against design tokens (colors, spacing, typography)
4. Posts a visual review comment on PRs

### Phase 4: Visual Regression CI (optional)

- Add Chromatic or Percy integration
- Run on every PR
- Block merge if visual regressions detected

## Tech Decisions to Make When Ready

- **Storybook 8 vs 9** — check latest stable at the time
- **Chromatic vs Percy vs Playwright visual** — cost vs features
- **Stories location** — colocated (`component.stories.tsx`) vs centralized (`stories/`)
- **Interaction tests** — Storybook play functions vs separate Playwright tests

## Cost Estimate

- Storybook: Free (open source)
- Chromatic: Free tier (5,000 snapshots/month), paid after
- Claude Opus 4.6: Standard API usage for agent runs
- Time: ~3 days total setup, then incremental

## References

- [Storybook + Next.js](https://storybook.js.org/recipes/next)
- [Storybook + Tailwind](https://storybook.js.org/recipes/tailwindcss)
- [Chromatic](https://www.chromatic.com/)
