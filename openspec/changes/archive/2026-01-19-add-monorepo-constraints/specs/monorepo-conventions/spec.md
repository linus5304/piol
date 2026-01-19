## ADDED Requirements

### Requirement: Package Structure

The monorepo SHALL follow Turborepo standard package structure.

#### Scenario: Apps directory contains deployable applications
- **GIVEN** a Turborepo monorepo
- **WHEN** checking the `apps/` directory
- **THEN** it SHALL contain only deployable applications (web, mobile)
- **AND** each app SHALL have its own `package.json`
- **AND** each app SHALL be independently buildable

#### Scenario: Packages directory contains shared internal packages
- **GIVEN** a Turborepo monorepo
- **WHEN** checking the `packages/` directory
- **THEN** it SHALL contain shared internal packages (convex, ui, config, types, env)
- **AND** each package SHALL have its own `package.json`
- **AND** packages SHALL NOT be deployable on their own

### Requirement: Convex Package Layout

The Convex package SHALL follow the nested directory pattern required by Convex CLI.

#### Scenario: Convex functions in subdirectory
- **GIVEN** the `packages/convex` package
- **WHEN** checking the package structure
- **THEN** Convex functions SHALL be in `packages/convex/convex/`
- **AND** the schema SHALL be at `packages/convex/convex/schema.ts`
- **AND** generated files SHALL be at `packages/convex/convex/_generated/`

#### Scenario: Convex package exports configuration
- **GIVEN** the `packages/convex/package.json`
- **WHEN** checking the exports field
- **THEN** exports SHALL point to `./convex/_generated/*` paths
- **AND** the api export SHALL be available as `@piol/convex/api`

#### Scenario: Tests import from correct path
- **GIVEN** tests in `packages/convex/__tests__/`
- **WHEN** importing Convex functions
- **THEN** imports SHALL use relative paths to `../convex/` directory
- **AND** imports SHALL NOT use paths outside the package

### Requirement: Environment File Conventions

The project SHALL maintain consistent environment file structure.

#### Scenario: Root env.example exists
- **GIVEN** a developer cloning the repository
- **WHEN** checking the root directory
- **THEN** `.env.example` SHALL exist with placeholder values
- **AND** it SHALL document all required environment variables
- **AND** it SHALL be committed to version control

#### Scenario: Local env files are gitignored
- **GIVEN** the `.gitignore` configuration
- **WHEN** checking ignored patterns
- **THEN** `.env.local` files SHALL be ignored
- **AND** `.env*.local` pattern SHALL be present
- **AND** sensitive values SHALL NOT be committed

#### Scenario: App-specific env files
- **GIVEN** an app requiring public environment variables
- **WHEN** configuring the app
- **THEN** `NEXT_PUBLIC_*` variables SHALL be in `apps/web/.env.local`
- **AND** the variables SHALL override root-level defaults if needed

### Requirement: Environment Deployment Consistency

All environment files in the workspace SHALL reference the same Convex deployment.

#### Scenario: Dev environment consistency
- **GIVEN** a developer running the project locally
- **WHEN** multiple `.env.local` files exist
- **THEN** all files referencing `CONVEX_DEPLOYMENT` SHALL use the same value
- **AND** mixing dev and prod deployments SHALL be prohibited

#### Scenario: Deployment mismatch detection
- **GIVEN** `.env.local` files with different `CONVEX_DEPLOYMENT` values
- **WHEN** running the application
- **THEN** functions defined in one deployment may not exist in another
- **AND** this SHALL result in runtime errors like "function not found"

#### Scenario: Correct dev environment setup
- **GIVEN** a developer setting up the project
- **WHEN** configuring environment files
- **THEN** `packages/convex/.env.local` SHALL have `CONVEX_DEPLOYMENT=dev:<project>`
- **AND** `apps/web/.env.local` SHALL have `NEXT_PUBLIC_CONVEX_URL` matching the dev deployment

### Requirement: CI Regression Gate

CI SHALL validate all packages from the monorepo root.

#### Scenario: CI runs from monorepo root
- **GIVEN** a pull request to the main branch
- **WHEN** CI pipeline executes
- **THEN** it SHALL run from the monorepo root
- **AND** it SHALL use Turborepo for orchestration

#### Scenario: CI validation commands
- **GIVEN** CI executing on a pull request
- **WHEN** running validation
- **THEN** `turbo run lint test typecheck build` SHALL pass
- **AND** failure of any command SHALL block merge

#### Scenario: CI paths filter accuracy
- **GIVEN** CI workflow configuration
- **WHEN** checking paths filter for jobs
- **THEN** filters SHALL match actual structure (`apps/**`, `packages/**`)
- **AND** changes to packages SHALL trigger dependent app builds

### Requirement: Package Exports

Internal packages SHALL export via the `exports` field in `package.json`.

#### Scenario: Package exports field defined
- **GIVEN** an internal package in `packages/`
- **WHEN** checking its `package.json`
- **THEN** the `exports` field SHALL be defined
- **AND** exports SHALL use explicit paths (not wildcards for security)

#### Scenario: TypeScript finds exports
- **GIVEN** an app importing from an internal package
- **WHEN** TypeScript resolves the import
- **THEN** the import SHALL resolve via the `exports` field
- **AND** TypeScript errors SHALL occur if export path is wrong

#### Scenario: Convex API export
- **GIVEN** the web app importing Convex API
- **WHEN** using `import { api } from '@piol/convex/api'`
- **THEN** the import SHALL resolve to `packages/convex/convex/_generated/api`
- **AND** all Convex functions SHALL be available on the api object
