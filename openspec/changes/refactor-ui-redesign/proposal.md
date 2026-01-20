# Change: Refactor UI Redesign

## Why

The current UI lacks visual consistency and polish. Pages have different layouts, the logo is text-based rather than iconic, there's no favicon, the property search lacks a map view, and messaging lacks a proper conversation UI. This redesign creates a cohesive, minimal, modern interface using a **zinc/neutral theme** inspired by GitHub's UI patterns, efferd.com, square-ui rentals template, and shadcn blocks.

**Supersedes:** `add-production-polish` — This redesign is more comprehensive and includes all design system work from that change.

## What Changes

### Theme Update
- **BREAKING**: Switch from coral theme to **zinc/neutral theme**
- Update `globals.css` with zinc-based color palette
- Clean, professional look suitable for housing marketplace
- Keep coral as accent only (CTAs, verification badges)

### Branding & Assets
- Replace text "P" logo with a minimal house icon using Lucide `Home`
- Generate and add favicon (SVG + PNG fallbacks)
- Consistent logo placement across all pages

### Layout System
- **Public pages** (home, properties, property detail, about, contact, terms, privacy): Consistent header with icon logo, minimal navigation, clean footer
- **Renter dashboard** (saved, messages, payments): Tab-based navigation, no sidebar, lighter feel
- **Landlord/Admin dashboard**: Sidebar-based navigation, data-dense layouts

### Page Redesigns (ALL Pages)

**Public Pages:**
- `/` — Home: Cleaner hero, search bar, how-it-works, featured properties
- `/properties` — Split view with interactive map, filters, property grid
- `/properties/[id]` — Gallery carousel, info cards, contact CTA
- `/about` — Company story, mission, clean typography
- `/contact` — Contact form with Field components
- `/terms` — Legal content with proper typography
- `/privacy` — Legal content with proper typography

**Auth Pages:**
- `/sign-in` — Polished Clerk styling
- `/sign-up` — Polished Clerk styling

**Renter Dashboard:**
- `/dashboard` — Quick stats cards, recent activity
- `/dashboard/saved` — Saved properties grid
- `/dashboard/messages` — Conversation list + thread view (Item components)
- `/dashboard/messages/[id]` — Full conversation thread
- `/dashboard/payments` — Payment history table
- `/dashboard/settings` — Profile form with Field/FieldGroup components

**Landlord Dashboard:**
- `/dashboard` — Revenue stats, transaction table
- `/dashboard/properties` — Property list with status badges
- `/dashboard/properties/new` — Multi-step form with FieldSet
- `/dashboard/properties/[id]` — Property edit form
- `/dashboard/messages` — Conversation list with property context
- `/dashboard/messages/[id]` — Conversation thread
- `/dashboard/settings` — Profile and business settings

### Messaging Components
- Create `ConversationList` using Item/ItemGroup pattern
- Create `MessageThread` with proper message bubbles
- Create `MessageInput` using InputGroup pattern
- Add empty states using Empty component pattern
- Real-time message updates (already in Convex)

### Component Patterns (shadcn blocks style)
- Use `Item`, `ItemGroup`, `ItemMedia`, `ItemContent`, `ItemActions` for lists
- Use `Field`, `FieldGroup`, `FieldSet`, `FieldLabel`, `FieldDescription` for forms
- Use `InputGroup`, `InputGroupAddon`, `InputGroupButton` for enhanced inputs
- Use `Empty`, `EmptyHeader`, `EmptyContent` for empty states
- Use `Card` with proper `CardHeader`, `CardContent`, `CardFooter` structure

### Technical
- Use only shadcn components — delete any custom duplicates
- Follow React best practices (error boundaries, loading states)
- Remove ALL hardcoded colors, use CSS variables
- Mobile-first responsive design
- Proper loading skeletons for all async content

## Impact

- Affected specs: None existing (creates new capabilities)
- **Supersedes**: `openspec/changes/add-production-polish/` — archive after this is approved
- Affected code:
  - `apps/web/src/app/globals.css` — Zinc theme
  - `apps/web/src/app/favicon.ico` — New icon favicon
  - `apps/web/src/components/brand.tsx` — Icon-based logo
  - `apps/web/src/components/layouts/` — Layout components
  - `apps/web/src/components/messages/` — New messaging components
  - `apps/web/src/app/**/*.tsx` — ALL page files
  - `apps/web/src/components/ui/` — Add missing shadcn components

## Design References

1. **shadcn blocks** — Component patterns (Item, Field, InputGroup, Empty)
2. **efferd.com** — Overall aesthetic, minimal property cards
3. **square-ui/rentals** — Map + list split view for property search
4. **GitHub UI** — Professional zinc theme, data-dense dashboards
