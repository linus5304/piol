## ADDED Requirements

### Requirement: Error Tracking

The system SHALL capture and report runtime errors to Sentry for production monitoring.

#### Scenario: Client-side error captured
- **WHEN** an unhandled JavaScript error occurs in the browser
- **THEN** the error is sent to Sentry with stack trace and user context

#### Scenario: Server-side error captured
- **WHEN** an unhandled error occurs in API routes or server components
- **THEN** the error is sent to Sentry with request context

#### Scenario: Error boundary fallback
- **WHEN** a React component throws during render
- **THEN** a fallback UI is shown and error is reported to Sentry

### Requirement: Performance Monitoring

The system SHALL collect performance metrics via Vercel Analytics.

#### Scenario: Page view tracked
- **WHEN** a user navigates to a page
- **THEN** the page view is recorded in Vercel Analytics

#### Scenario: Web vitals measured
- **WHEN** a page loads
- **THEN** Core Web Vitals (LCP, FID, CLS) are measured and reported

### Requirement: Vercel Deployment Configuration

The system SHALL be deployable to Vercel with proper monorepo configuration.

#### Configuration: Vercel Project Settings

| Setting | Value | Notes |
|---------|-------|-------|
| Root Directory | *(empty)* | Use repo root for Turborepo compatibility |
| Build Command | `npx convex deploy && turbo run build --filter=@repo/web` | Deploys Convex first, then builds web app |
| Output Directory | `apps/web/.next` | Next.js output location |
| Install Command | `bun install` | Auto-detected |

#### Configuration: Required Environment Variables (Vercel)

| Variable | Purpose | Where to get |
|----------|---------|--------------|
| `CONVEX_DEPLOY_KEY` | Authorizes Convex deployment | Convex Dashboard → Settings → Deploy Key |
| `NEXT_PUBLIC_CONVEX_URL` | Client-side Convex URL | Convex Dashboard → URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (client) | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk auth (server) | Clerk Dashboard → API Keys |
| `NEXT_PUBLIC_SENTRY_DSN` | Error tracking | Sentry → Project → DSN |
| `SENTRY_AUTH_TOKEN` | Source map uploads | Sentry → Settings → Auth Tokens |
| `SENTRY_ORG` | Sentry organization slug | Sentry URL path |
| `SENTRY_PROJECT` | Sentry project slug | Sentry URL path |

#### Configuration: Required Environment Variables (Convex Dashboard)

| Variable | Purpose |
|----------|---------|
| `CLERK_JWT_ISSUER_DOMAIN` | Your Clerk domain (e.g., `your-app.clerk.accounts.dev`) |

#### Scenario: Successful production deploy
- **WHEN** code is pushed to `main` branch
- **THEN** Vercel triggers build with Convex deploy followed by Next.js build
- **AND** the app is deployed with correct environment configuration

#### Scenario: Convex deploy fails gracefully
- **WHEN** `CONVEX_DEPLOY_KEY` is missing or invalid
- **THEN** the build fails with clear error message before Next.js build starts

### Requirement: Environment Separation

The system SHALL support separate development and production environments.

#### Scenario: Development uses dev Convex
- **WHEN** running locally with `bun run dev`
- **THEN** the app connects to the development Convex deployment

#### Scenario: Production uses prod Convex
- **WHEN** deployed to Vercel production
- **THEN** the app connects to the production Convex deployment

#### Scenario: Environment variables isolated
- **WHEN** setting `CLERK_JWT_ISSUER_DOMAIN` in Convex
- **THEN** each deployment (dev/prod) has its own value configured

### Requirement: User Feedback on Errors

The system SHALL provide user-visible feedback when operations fail.

#### Scenario: Save property error shows toast
- **WHEN** toggling save on a property fails
- **THEN** a toast notification informs the user of the error

#### Scenario: Settings update confirms success
- **WHEN** user saves profile settings
- **THEN** the changes are persisted to Convex and user sees confirmation

### Requirement: AI-Assisted Code Review

The system SHALL support on-demand AI code review via GitHub Actions.

#### Scenario: Claude responds to trigger phrase
- **WHEN** a user comments `@claude` on a PR or issue
- **THEN** Claude Code Action reviews the code and responds with suggestions

#### Scenario: Claude can implement changes
- **WHEN** a user comments `@claude implement this` on an issue
- **THEN** Claude attempts to implement the requested changes

#### Scenario: No action without trigger
- **WHEN** a PR is opened without `@claude` mention
- **THEN** Claude PR Assistant does not run (cost control)

### Requirement: Automated Security Review

The system SHALL automatically scan PRs for security vulnerabilities.

#### Scenario: Security scan on PR open
- **WHEN** a pull request is opened or updated
- **THEN** Claude Security Review scans the changes for vulnerabilities

#### Scenario: Security findings reported
- **WHEN** security issues are detected
- **THEN** findings are posted as PR comments with severity and remediation

#### Scenario: Clean PR passes
- **WHEN** no security issues are found
- **THEN** the PR is not blocked and may show a passing check
