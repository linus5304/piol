## ADDED Requirements

### Requirement: Zinc Theme
The application SHALL use a zinc/neutral color theme as the primary design language.

#### Scenario: Light mode zinc colors
- **GIVEN** light mode is active
- **WHEN** any page renders
- **THEN** backgrounds use zinc-50/white, text uses zinc-900, borders use zinc-200

#### Scenario: Dark mode zinc colors
- **GIVEN** dark mode is active (system preference)
- **WHEN** any page renders
- **THEN** backgrounds use zinc-950, text uses zinc-50, borders use zinc-800

#### Scenario: Coral accent color
- **GIVEN** a call-to-action button or highlight element
- **WHEN** it renders
- **THEN** it uses coral (#FF385C) as accent, applied via `--accent` CSS variable

### Requirement: Icon Logo
The application SHALL display a consistent icon-based logo (Lucide `Home` icon) across all pages.

#### Scenario: Logo in header
- **GIVEN** any public page
- **WHEN** the page renders
- **THEN** the header displays the Home icon logo with "Piol" text

#### Scenario: Logo in sidebar
- **GIVEN** a dashboard page with sidebar
- **WHEN** the page renders
- **THEN** the sidebar header displays the Home icon logo

#### Scenario: Logo icon only
- **GIVEN** a context requiring compact logo (mobile, favicon)
- **WHEN** the logo is rendered
- **THEN** only the Home icon is displayed without text

### Requirement: Favicon
The application SHALL provide a favicon matching the logo icon.

#### Scenario: Favicon in browser tab
- **GIVEN** any page of the application
- **WHEN** the page is loaded in a browser
- **THEN** the browser tab displays the Piol icon favicon

#### Scenario: Favicon formats
- **GIVEN** the favicon assets
- **WHEN** checked for availability
- **THEN** SVG and PNG formats are available for broad browser support

### Requirement: No Hardcoded Colors
The application SHALL use CSS variables for all colors, with no hardcoded hex values in component files.

#### Scenario: Color via variable
- **GIVEN** any component file
- **WHEN** the file is inspected
- **THEN** colors reference CSS variables (e.g., `bg-background`, `text-foreground`), not hex codes

#### Scenario: Grep for hardcoded colors
- **GIVEN** the codebase
- **WHEN** searching for `#FF385C`, `#E31C5F`, `bg-white`, `text-gray-*`
- **THEN** no matches are found in component files (only in globals.css definitions)
