# testing-strategy Specification

## Purpose

Establish consistent, minimal testing patterns for verifying features work correctly.

## ADDED Requirements

### Requirement: Convex Query Tests

Critical Convex queries SHALL have unit tests verifying they return the correct data shape.

#### Scenario: getProperty returns expected shape
- **GIVEN** a property exists in the database with a landlord
- **WHEN** `api.properties.getProperty` is called with the property ID
- **THEN** the result includes:
  - `_id` matching the property ID
  - `landlord` object with `_id`, `firstName`, `lastName`, `idVerified`
  - `reviews` object with `count` and `averageRating`
  - `imageUrls` array (may be empty)
  - All required schema fields

#### Scenario: listProperties filters work
- **GIVEN** properties exist in multiple cities with different types
- **WHEN** `api.properties.listProperties` is called with filters
- **THEN** results match the filter criteria
- **AND** results include landlord info for each property

#### Scenario: Query returns null for non-existent entity
- **GIVEN** no property exists with a given ID
- **WHEN** `api.properties.getProperty` is called with that ID
- **THEN** the result is `null`

### Requirement: Component Render Tests

React components that display data SHALL have tests verifying they render correctly.

#### Scenario: PropertyCard renders all fields
- **GIVEN** a PropertyCard component with mock property data
- **WHEN** the component is rendered
- **THEN** the title, price, location, and type are visible
- **AND** the landlord name is displayed
- **AND** verified badge appears for approved properties

#### Scenario: Property detail page renders
- **GIVEN** mock property data (not from Convex)
- **WHEN** the property detail content is rendered
- **THEN** images, amenities, description, and pricing are visible
- **AND** the contact button is present

### Requirement: Test Commands

The system SHALL provide simple test commands at the root level.

#### Scenario: Run all tests
- **GIVEN** a developer wants to verify everything works
- **WHEN** they run `bun run test` from the root
- **THEN** both Convex and web tests run
- **AND** results are reported clearly

#### Scenario: Run Convex tests only
- **GIVEN** a developer changed Convex queries
- **WHEN** they run `bun run test:convex` from the root
- **THEN** only Convex vitest tests run

#### Scenario: Run web tests only
- **GIVEN** a developer changed web components
- **WHEN** they run `bun run test:web` from the root
- **THEN** only web Jest tests run

### Requirement: Test Patterns Documentation

The codebase SHALL include documented test patterns for consistency.

#### Scenario: New Convex query test
- **GIVEN** a developer needs to test a new Convex query
- **WHEN** they look at existing tests in `packages/convex/__tests__/`
- **THEN** they find a clear pattern using convex-test
- **AND** the pattern shows how to seed data and assert results

#### Scenario: New component test
- **GIVEN** a developer needs to test a new React component
- **WHEN** they look at existing tests in `apps/web/src/__tests__/`
- **THEN** they find a clear pattern using React Testing Library
- **AND** the pattern shows how to provide mock data without Convex

### Requirement: Test Isolation

Tests SHALL be isolated and not depend on external state.

#### Scenario: Convex tests use in-memory database
- **GIVEN** Convex tests are running
- **WHEN** a test inserts data
- **THEN** that data is only visible within that test
- **AND** does not affect other tests or the real database

#### Scenario: Component tests don't call Convex
- **GIVEN** component tests are running
- **WHEN** a component normally uses useQuery
- **THEN** the test provides mock data instead
- **AND** no actual Convex calls are made
