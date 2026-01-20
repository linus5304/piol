## ADDED Requirements

### Requirement: Public Page Layout
Public pages (home, properties, property detail, about, contact, terms, privacy) SHALL use a consistent layout with header, content area, and footer.

#### Scenario: Header on public pages
- **GIVEN** any public page
- **WHEN** the page renders
- **THEN** a sticky header is displayed with logo, navigation links, language switcher, and auth buttons

#### Scenario: Footer on public pages
- **GIVEN** any public page (except /properties with map view)
- **WHEN** the page renders
- **THEN** a footer is displayed with brand info, navigation links, and legal links

#### Scenario: Mobile responsive header
- **GIVEN** a mobile viewport (< 768px)
- **WHEN** a public page renders
- **THEN** navigation collapses into a hamburger menu using Drawer component

### Requirement: Renter Dashboard Layout
Renter dashboard pages (saved, messages, payments, settings) SHALL use a tab-based navigation layout distinct from landlord dashboard.

#### Scenario: Tab navigation for renter
- **GIVEN** an authenticated renter
- **WHEN** they visit any dashboard page
- **THEN** horizontal tabs are displayed for Home, Saved, Messages, Payments, Settings

#### Scenario: No sidebar for renter
- **GIVEN** an authenticated renter
- **WHEN** they visit their dashboard
- **THEN** no sidebar is displayed (unlike landlord dashboard)

#### Scenario: Mobile renter navigation
- **GIVEN** a mobile viewport (< 768px) and authenticated renter
- **WHEN** they visit dashboard pages
- **THEN** tabs are scrollable horizontally with overflow indicator

#### Scenario: Renter dashboard header
- **GIVEN** an authenticated renter on dashboard
- **WHEN** the page renders
- **THEN** a simple header with logo and user menu is displayed (no full nav)

### Requirement: Landlord Dashboard Layout
Landlord dashboard pages SHALL use a sidebar-based navigation layout.

#### Scenario: Sidebar for landlord
- **GIVEN** an authenticated landlord
- **WHEN** they visit any dashboard page
- **THEN** a collapsible sidebar is displayed with navigation items

#### Scenario: Sidebar navigation items
- **GIVEN** an authenticated landlord on dashboard
- **WHEN** viewing the sidebar
- **THEN** it includes: Home, Properties, Messages, Settings

#### Scenario: Mobile landlord navigation
- **GIVEN** a mobile viewport (< 768px) and authenticated landlord
- **WHEN** they visit dashboard pages
- **THEN** sidebar is hidden and accessible via hamburger menu (Drawer)

### Requirement: Consistent Spacing
All pages SHALL use consistent spacing from the design system (4px base unit, 16px standard gap).

#### Scenario: Container padding
- **GIVEN** any page with a content container
- **WHEN** the content renders
- **THEN** horizontal padding is 16px on mobile, 24px on tablet, 32px on desktop

#### Scenario: Section spacing
- **GIVEN** multiple content sections on a page
- **WHEN** the page renders
- **THEN** vertical spacing between sections is consistent (gap-8 or gap-12)

### Requirement: Loading States
All pages with async content SHALL display proper loading skeletons.

#### Scenario: Page-level loading
- **GIVEN** a page fetching data
- **WHEN** data is loading
- **THEN** skeleton placeholders match the shape of expected content

#### Scenario: Component-level loading
- **GIVEN** a component like PropertyCard loading data
- **WHEN** data is pending
- **THEN** a skeleton with matching dimensions is displayed

### Requirement: Empty States
Pages and components SHALL display meaningful empty states when no data exists.

#### Scenario: No properties found
- **GIVEN** a search with no results
- **WHEN** the page renders
- **THEN** an Empty component shows with icon, message, and clear filters CTA

#### Scenario: No saved properties
- **GIVEN** a renter with no saved properties
- **WHEN** they visit /dashboard/saved
- **THEN** an Empty component shows with icon, message, and browse CTA

#### Scenario: No messages
- **GIVEN** a user with no conversations
- **WHEN** they visit /dashboard/messages
- **THEN** an Empty component shows with icon, message, and helpful text
