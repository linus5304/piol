# Change: Add Production Polish

## Why

MVP is complete and production readiness (error tracking, analytics) is in place. Now we need to refine the codebase to meet clean production code standards: consistent design system, proper dark mode support, React best practices, and deduplication of components.

## What Changes

### UI Engineer Skill
- Add expert UI skill at `.cursor/skills/ui-engineer.md`
- Add `/ui-review` command for UI quality checks
- Reference shadcn MCP server for component documentation
- Include Piol-specific patterns (PropertyCard, loading states)

### Design System Consolidation
- **BREAKING**: Choose coral palette (matches `packages/ui/tokens`, better for housing marketplace UX)
- Update `globals.css` to align with coral tokens instead of current lime theme
- Remove all hardcoded colors (`#FF385C`, `#E31C5F`, `bg-white`, `text-gray-*`)

### Page-by-Page Cleanup
- Property pages (`/properties`, `/properties/[id]`) - replace hardcoded colors with CSS variables
- Dashboard pages - fix `text-gray-*` usage, complete TODOs, remove console.logs
- Messages page - uses `text-gray-*` instead of `text-muted-foreground`
- New property form - has incomplete TODO, mixes color systems

### Component Deduplication
- `property-card.tsx` exists in both `/components/` and `/components/properties/`
- Create centralized UI exports

### React Best Practices
- Add error boundaries where missing
- Consistent loading states across all pages
- Remove console.log statements from production code

## Impact

- Affected specs: None existing (new design-system and ui-skills capabilities)
- Affected code:
  - `.cursor/skills/ui-engineer.md` - New skill file
  - `.cursor/commands/ui-review.md` - New command
  - `.cursor/rules.md` - Updated with UI rules
  - `apps/web/src/app/globals.css` - Theme update
  - `apps/web/src/app/properties/page.tsx` - Color fixes
  - `apps/web/src/app/properties/[id]/page.tsx` - Color fixes
  - `apps/web/src/app/dashboard/messages/page.tsx` - Color fixes
  - `apps/web/src/app/dashboard/properties/new/page.tsx` - Complete TODO
  - `apps/web/src/components/property-card.tsx` - Consolidation
  - `packages/ui/src/tokens/index.ts` - Align with globals.css
