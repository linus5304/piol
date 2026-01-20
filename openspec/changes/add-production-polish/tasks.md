## 0. UI Engineer Skill (polish-0)

- [x] 0.1 Create `.cursor/skills/` directory
- [x] 0.2 Create `ui-engineer.md` skill with React/Tailwind/shadcn patterns
- [x] 0.3 Create `/ui-review` command in `.cursor/commands/`
- [x] 0.4 Update `.cursor/rules.md` with UI rules reference
- [ ] 0.5 Document shadcn MCP server setup in skill

## 1. Design System Consolidation (polish-1)

- [ ] 1.1 Update `globals.css` `:root` to use coral primary (`#FF385C`)
- [ ] 1.2 Update `globals.css` `.light` theme variant
- [ ] 1.3 Verify `packages/ui/tokens` aligns with globals.css
- [ ] 1.4 Run `bun run build` to verify no breaks

## 2. Property Pages Cleanup (polish-2)

- [ ] 2.1 `/properties/page.tsx` - replace `#FF385C` with `bg-primary`
- [ ] 2.2 `/properties/page.tsx` - replace `#E31C5F` with `hover:bg-primary/90`
- [ ] 2.3 `/properties/[id]/page.tsx` - replace `bg-white` with `bg-background`
- [ ] 2.4 `/properties/[id]/page.tsx` - replace `text-neutral-*` with semantic colors
- [ ] 2.5 Verify dark mode renders correctly on both pages

## 3. Dashboard Pages Cleanup (polish-3)

- [ ] 3.1 `/dashboard/messages/page.tsx` - replace `text-gray-*` with `text-muted-foreground`
- [ ] 3.2 `/dashboard/messages/page.tsx` - replace `bg-gray-*` with semantic tokens
- [ ] 3.3 `/dashboard/properties/new/page.tsx` - complete TODO at line 83
- [ ] 3.4 `/dashboard/properties/new/page.tsx` - replace hardcoded colors
- [ ] 3.5 Remove all `console.log` statements from dashboard pages
- [ ] 3.6 Verify all dashboard pages render correctly

## 4. Component Deduplication (polish-4)

- [ ] 4.1 Compare `/components/property-card.tsx` vs `/components/properties/property-card.tsx`
- [ ] 4.2 Consolidate to single canonical version in `/components/properties/`
- [ ] 4.3 Update all imports to use new path
- [ ] 4.4 Delete duplicate file
- [ ] 4.5 Update `/components/properties/index.ts` exports

## 5. Add Missing shadcn Components (polish-5)

- [ ] 5.1 Run `bunx --bun shadcn@latest add command`
- [ ] 5.2 Run `bunx --bun shadcn@latest add calendar`
- [ ] 5.3 Run `bunx --bun shadcn@latest add carousel`
- [ ] 5.4 Run `bunx --bun shadcn@latest add alert`
- [ ] 5.5 Verify components work with current theme

## 6. Final Verification

- [ ] 6.1 Visual review of all 19 pages
- [ ] 6.2 Run `bun run lint` - no errors
- [ ] 6.3 Run `bun run test` - all pass
- [ ] 6.4 Run `bun run build` - successful
