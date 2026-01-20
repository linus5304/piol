## ADDED Requirements

### Requirement: UI Engineer Skill

The project SHALL include an expert UI Engineer skill that guides AI agents on frontend best practices.

#### Scenario: Skill file exists
- **WHEN** an agent needs UI guidance
- **THEN** they can reference `.cursor/skills/ui-engineer.md`
- **AND** the skill covers React, Tailwind, shadcn/ui, and accessibility

#### Scenario: UI review command available
- **WHEN** a user wants to review UI quality
- **THEN** they can use `/ui-review` command
- **AND** it applies the UI Engineer skill checklist

---

### Requirement: shadcn/ui Integration

The UI Engineer skill SHALL provide guidance on using shadcn/ui components correctly.

#### Scenario: Component installation
- **WHEN** a new UI component is needed
- **THEN** the skill guides using `bunx --bun shadcn@latest add <component>`
- **AND** recommends appropriate components for common patterns

#### Scenario: MCP server setup
- **WHEN** real-time shadcn documentation is needed
- **THEN** the skill references `bunx --bun shadcn@latest mcp init --client cursor`
- **AND** explains how to use the MCP server for component docs

---

### Requirement: Design Token Enforcement

The UI Engineer skill SHALL enforce design token usage over hardcoded values.

#### Scenario: Color token guidance
- **WHEN** a component needs a color
- **THEN** the skill guides using semantic tokens (`bg-primary`, `text-muted-foreground`)
- **AND** explicitly forbids hardcoded hex values (`#FF385C`, `#E31C5F`)

#### Scenario: Dark mode compatibility
- **WHEN** reviewing a component
- **THEN** the skill checks that all colors work in dark mode
- **AND** identifies `bg-white`, `text-gray-*` as violations

---

### Requirement: Piol-Specific Patterns

The UI Engineer skill SHALL include patterns specific to the Piol housing marketplace.

#### Scenario: Property card usage
- **WHEN** displaying property listings
- **THEN** the skill guides using the canonical `PropertyCard` from `/components/properties/`
- **AND** supports both vertical and horizontal variants

#### Scenario: Loading states
- **WHEN** implementing async UI
- **THEN** the skill requires skeleton loading states
- **AND** provides skeleton component patterns for cards, text, and pages
