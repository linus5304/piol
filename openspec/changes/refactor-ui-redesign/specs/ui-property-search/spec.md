## ADDED Requirements

### Requirement: Map View
The properties page SHALL provide an interactive map view showing property locations.

#### Scenario: Toggle to map view
- **GIVEN** a user on /properties page
- **WHEN** they click the map toggle button
- **THEN** the view switches to split layout with map on one side and property list on the other

#### Scenario: Map markers
- **GIVEN** properties are loaded and map view is active
- **WHEN** the map renders
- **THEN** each property is represented by a marker at its location showing price

#### Scenario: Map marker interaction
- **GIVEN** map view with property markers
- **WHEN** user clicks a marker
- **THEN** a popup or card shows property preview (image, title, price)

#### Scenario: Map bounds
- **GIVEN** properties in the current search results
- **WHEN** map view activates
- **THEN** the map auto-zooms to fit all property markers

### Requirement: Split View Layout
When map view is active, the layout SHALL split between list and map.

#### Scenario: Desktop split view
- **GIVEN** a desktop viewport (≥ 1024px) and map view active
- **WHEN** the page renders
- **THEN** property list takes 50% width on left, map takes 50% on right

#### Scenario: Mobile map view
- **GIVEN** a mobile viewport (< 768px) and map view active
- **WHEN** the page renders
- **THEN** map is full screen with floating property cards at bottom

#### Scenario: List scroll syncs with map
- **GIVEN** split view on desktop
- **WHEN** user hovers over a property card in the list
- **THEN** the corresponding map marker is highlighted

### Requirement: Property Filters
The properties page SHALL provide filtering by city, property type, price range, and amenities.

#### Scenario: City filter
- **GIVEN** the filter bar on /properties
- **WHEN** user selects a city from dropdown
- **THEN** only properties in that city are shown

#### Scenario: Price range filter
- **GIVEN** the filter bar on /properties
- **WHEN** user selects a price range
- **THEN** only properties within that price range are shown

#### Scenario: Active filter badges
- **GIVEN** one or more filters are active
- **WHEN** the filter bar renders
- **THEN** badges show active filters with X buttons to remove each

#### Scenario: Clear all filters
- **GIVEN** multiple filters are active
- **WHEN** user clicks "Clear all"
- **THEN** all filters reset to default and full property list shows

### Requirement: Property Card Design
Property cards SHALL follow a minimal, image-forward design inspired by Airbnb.

#### Scenario: Card in grid view
- **GIVEN** grid view on /properties
- **WHEN** property cards render
- **THEN** each card shows: image (with carousel if multiple), title, location, price, and save button

#### Scenario: Card in list view (split)
- **GIVEN** split view with map active
- **WHEN** property cards render in the list panel
- **THEN** cards show horizontal layout: image on left, details on right

#### Scenario: Image carousel
- **GIVEN** a property with multiple images
- **WHEN** user interacts with the card
- **THEN** they can swipe/click through images without leaving the list

#### Scenario: Save button
- **GIVEN** any property card
- **WHEN** authenticated user clicks the heart icon
- **THEN** property is saved/unsaved and heart icon toggles filled/outline
