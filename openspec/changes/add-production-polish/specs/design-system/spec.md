## ADDED Requirements

### Requirement: Design Token Consistency

The application SHALL use CSS custom properties (design tokens) for all color values instead of hardcoded hex codes.

#### Scenario: Primary brand color usage
- **WHEN** a component needs the primary brand color
- **THEN** it MUST use `bg-primary` or `text-primary` classes (not `#FF385C`)

#### Scenario: Semantic color usage
- **WHEN** a component needs a text color
- **THEN** it MUST use semantic classes (`text-foreground`, `text-muted-foreground`) not neutral variants (`text-gray-600`, `text-neutral-500`)

#### Scenario: Background color usage
- **WHEN** a component needs a background color
- **THEN** it MUST use semantic classes (`bg-background`, `bg-card`, `bg-muted`) not hardcoded values (`bg-white`)

---

### Requirement: Dark Mode Support

All pages SHALL render correctly in dark mode using the design token system.

#### Scenario: Page renders in dark mode
- **WHEN** the user's system preference is dark mode
- **THEN** all text, backgrounds, and borders adapt via CSS custom properties
- **AND** no white backgrounds appear unexpectedly

#### Scenario: Property detail page dark mode
- **WHEN** viewing `/properties/[id]` in dark mode
- **THEN** the page uses `bg-background` instead of `bg-white`
- **AND** text uses `text-foreground` instead of `text-neutral-900`

---

### Requirement: Single Source of Truth for Tokens

Design tokens SHALL be defined in exactly one location with no duplication.

#### Scenario: Token definition location
- **WHEN** adding or modifying a design token
- **THEN** the change MUST be made in `globals.css` CSS custom properties
- **AND** `packages/ui/tokens` MUST align with those values

#### Scenario: No duplicate component files
- **WHEN** a component serves the same purpose (e.g., PropertyCard)
- **THEN** only one canonical version SHALL exist
- **AND** all imports SHALL reference that single file

---

### Requirement: Brand Color Palette

The primary brand color SHALL be coral (`#FF385C`) to align with housing marketplace conventions.

#### Scenario: Primary color definition
- **WHEN** `--primary` CSS variable is resolved
- **THEN** it MUST equal `#FF385C` (coral)

#### Scenario: Primary hover state
- **WHEN** a primary button is hovered
- **THEN** it MUST use `#E31C5F` (darker coral) via `hover:bg-primary/90` or similar
