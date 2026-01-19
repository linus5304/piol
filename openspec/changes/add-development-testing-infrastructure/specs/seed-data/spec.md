# seed-data Specification

## Purpose

Provide realistic, reproducible seed data for development, testing, and demos.

## ADDED Requirements

### Requirement: Comprehensive Property Seed Data

The seed data SHALL include properties with all schema fields populated realistically.

#### Scenario: Properties have full details
- **GIVEN** the seed script has been run
- **WHEN** a property is queried from the database
- **THEN** it includes:
  - title (descriptive, French, includes neighborhood)
  - description (2-3 paragraphs in French)
  - propertyType (variety: studio, 1br, 2br, 3br, villa, house)
  - rentAmount (realistic range: 50,000 - 500,000 XAF)
  - cautionMonths (1-3)
  - upfrontMonths (3-12)
  - city (Douala, Yaoundé, Kribi, Buea, etc.)
  - neighborhood
  - amenities (at least 3 amenities per property)

#### Scenario: Properties have placeholder images
- **GIVEN** the seed script has been run
- **WHEN** a property's images are queried
- **THEN** the property has 3-5 placeholder image URLs from Unsplash
- **AND** images are stored as URLs in a `placeholderImages` field (not Convex storage)

#### Scenario: Seed covers variety of property types
- **GIVEN** the seed script has been run
- **WHEN** all properties are listed
- **THEN** there are at least 10 properties
- **AND** at least 3 different cities are represented
- **AND** at least 4 different property types are represented
- **AND** price range spans 50,000 to 500,000 XAF

### Requirement: Realistic User Seed Data

The seed data SHALL include users with realistic Cameroonian profiles.

#### Scenario: Landlord profiles
- **GIVEN** the seed script has been run
- **WHEN** landlord users are queried
- **THEN** each landlord has:
  - firstName and lastName (Cameroonian names)
  - email (realistic format)
  - role set to 'landlord'
  - idVerified set appropriately (some true, some false)
  - languagePreference (fr or en)

#### Scenario: Renter profiles
- **GIVEN** the seed script has been run
- **WHEN** renter users are queried
- **THEN** at least 2 renter users exist with role 'renter'

### Requirement: Sample Reviews Seed Data

The seed data SHALL include sample reviews for properties.

#### Scenario: Properties have reviews
- **GIVEN** the seed script has been run
- **WHEN** reviews are queried
- **THEN** at least 3 properties have 1-3 reviews each
- **AND** reviews have ratings between 3-5 (realistic positive bias)
- **AND** reviews have French comments

### Requirement: Seed Commands

The system SHALL provide simple CLI commands for seed operations.

#### Scenario: Seed database
- **GIVEN** a developer wants to populate the database
- **WHEN** they run `bun run seed` from the root
- **THEN** the seed script runs and populates all tables
- **AND** existing seed data is not duplicated (idempotent)

#### Scenario: Reset database
- **GIVEN** a developer wants to start fresh
- **WHEN** they run `bun run seed:reset` from the root
- **THEN** all seed data is cleared and re-seeded
