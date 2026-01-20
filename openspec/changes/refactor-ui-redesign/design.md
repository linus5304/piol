## Context

Piol is a Cameroon housing marketplace. The current UI was built for MVP functionality but lacks visual polish and consistency. Users (renters) need a trustworthy, easy-to-use interface. Landlords need a functional dashboard with good messaging capabilities.

### Stakeholders
- Renters: Browse properties, save favorites, message landlords, make payments
- Landlords: List properties, manage messages, track payments
- Admins/Verifiers: Manage platform (out of scope for this redesign)

### Constraints
- Must use shadcn/ui components only (no custom UI primitives)
- Mobile-first (Cameroon users often mobile-primary)
- Bilingual: French (primary) + English
- Performance: Fast load times on variable network

## Goals / Non-Goals

### Goals
- Consistent visual identity across ALL pages
- Clean zinc/neutral theme (professional, trustworthy)
- Clear distinction between renter and landlord experiences
- Interactive map for property search
- Proper messaging UI with conversation list and thread view
- Mobile-optimized

### Non-Goals
- Mobile app (Expo is paused)
- Admin dashboard redesign
- New features (this is visual only)
- Dark mode toggle (keep current system preference detection)

## Decisions

### Decision 1: Zinc Theme
**Choice:** Switch from coral to zinc/neutral as primary theme
**Rationale:**
- More professional, trustworthy appearance
- Better contrast and readability
- Coral kept as accent for CTAs and highlights
- Aligns with GitHub-style UI patterns

**Color System:**
```css
/* Zinc theme base */
--background: #fafafa (light) / #09090b (dark)
--foreground: #18181b (light) / #fafafa (dark)
--muted: #f4f4f5 (light) / #27272a (dark)
--border: #e4e4e7 (light) / #27272a (dark)
--accent: #ff385c (coral - for CTAs only)
```

### Decision 2: Icon Logo
**Choice:** Use Lucide `Home` icon with rounded corners as logo mark
**Rationale:** 
- Immediately communicates "housing"
- Works at all sizes (favicon to header)
- Consistent with minimal design direction
- No design cost (already available in Lucide)

### Decision 3: Renter Dashboard Layout
**Choice:** Tab-based navigation (no sidebar) for renter dashboard
**Rationale:**
- Renters have fewer nav items (saved, messages, payments, settings)
- Simpler mental model than sidebar
- More screen space for content
- Visually distinct from landlord experience

### Decision 4: Map Implementation
**Choice:** Leaflet with OpenStreetMap tiles
**Rationale:**
- Free, no API key required for basic usage
- Well-supported React wrapper (react-leaflet)
- Sufficient for Cameroon coverage
- Can upgrade to Mapbox later if needed

### Decision 5: Messaging UI Pattern
**Choice:** Item/ItemGroup pattern for conversations, custom thread view
**Rationale:**
- Consistent with shadcn blocks patterns
- Item component handles avatars, content, actions naturally
- Empty component for "no messages" states
- InputGroup for message composer

**Messaging Components:**
```
ConversationList → ItemGroup of conversation Items
  - ItemMedia: Avatar
  - ItemContent: Name, last message preview, timestamp
  - ItemActions: Unread badge

MessageThread → Scrollable message list
  - Message bubbles (sent vs received styling)
  - Timestamp grouping
  - Typing indicator

MessageComposer → InputGroup
  - InputGroupTextarea for message
  - InputGroupButton for send
```

### Decision 6: Form Patterns
**Choice:** Use Field/FieldGroup/FieldSet pattern throughout
**Rationale:**
- Consistent form styling across app
- Built-in label, description, error handling
- Matches shadcn blocks examples
- Better accessibility

### Decision 7: Component Library
**Choice:** Use shadcn/ui exclusively, add missing components as needed
**Components to add:**
- `Item` (list item with media, content, actions)
- `Field` (form field wrapper)
- `InputGroup` (enhanced input with addons)
- `Empty` (empty state component)

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Map adds bundle size | Slower initial load | Lazy load map component |
| Leaflet SSR issues | Build errors | Dynamic import with ssr: false |
| Theme change breaks existing pages | Visual bugs | Update all pages systematically |
| New components need creation | Development time | Copy from shadcn blocks, customize |

## Migration Plan

1. **Phase 0: Setup** — Archive old change, install deps, add new components
2. **Phase 1: Foundation** — Zinc theme, logo, favicon, layout components
3. **Phase 2: Public pages** — Home, properties list, property detail
4. **Phase 3: Messaging** — ConversationList, MessageThread, MessageComposer
5. **Phase 4: Renter dashboard** — Tab layout, all renter pages
6. **Phase 5: Landlord dashboard** — Polish sidebar, all landlord pages
7. **Phase 6: Static pages** — About, contact, terms, privacy, auth
8. **Phase 7: Polish** — Loading states, empty states, error boundaries

Each phase is independently deployable. Rollback = revert git commits.

## Open Questions

1. ~~What icon for logo?~~ → Decided: Home icon
2. ~~Map provider?~~ → Decided: Leaflet + OSM
3. ~~Theme color?~~ → Decided: Zinc with coral accent
4. ~~Messaging pattern?~~ → Decided: Item/ItemGroup + custom thread
