# Change: Add Production Readiness

## Why

MVP is complete. Need to deploy to production with proper observability, error tracking, environment separation, and AI-assisted code review.

## What Changes

- Add Sentry for error tracking (web app)
- Add Vercel Analytics for performance metrics
- Document Convex dev/prod environment configuration
- Fix remaining TODOs in code (toast notifications, settings form)
- Add Claude Code Action for on-demand PR assistance (`@claude` trigger)
- Add Claude Security Review for automatic PR security scanning

## Impact

- Affected specs: None existing (new deployment capability)
- Affected code:
  - `apps/web/` - Sentry + Analytics integration
  - `apps/web/src/app/properties/page.tsx` - Toast on save error
  - `apps/web/src/app/dashboard/settings/page.tsx` - Wire updateProfile mutation
  - `.env.example` - Production environment documentation
  - `.github/workflows/` - New Claude Code workflows
