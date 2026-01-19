## Context

Piol MVP is complete. Preparing for production deployment on Vercel with Convex backend.

## Goals / Non-Goals

**Goals:**
- Error visibility in production via Sentry
- Performance metrics via Vercel Analytics
- Clear dev/prod environment separation for Convex
- Clean up code TODOs
- AI-assisted code review via Claude Code Actions

**Non-Goals:**
- Mobile app deployment (paused)
- Payment provider integration (post-MVP)
- Custom logging infrastructure

## Decisions

### 1. Sentry Integration

**Decision:** Use `@sentry/nextjs` with automatic instrumentation

**Why:**
- Official Next.js SDK with App Router support
- Automatic error boundary integration
- Performance monitoring included
- Source maps upload during build

**Configuration:**
- DSN from env: `NEXT_PUBLIC_SENTRY_DSN`
- Auth token for source maps: `SENTRY_AUTH_TOKEN`
- Sample rate: 100% errors, 10% transactions in prod

### 2. Vercel Analytics

**Decision:** Use `@vercel/analytics` + `@vercel/speed-insights`

**Why:**
- Zero config with Vercel deployment
- Free tier sufficient for MVP
- Complements Sentry (metrics vs errors)

### 3. Convex Environment Separation

**Decision:** Use separate Convex deployments for dev/prod

**Setup:**
```
Development:
- CONVEX_DEPLOYMENT=dev:your-project
- NEXT_PUBLIC_CONVEX_URL=https://your-dev.convex.cloud

Production:
- CONVEX_DEPLOYMENT=prod:your-project  
- NEXT_PUBLIC_CONVEX_URL=https://your-prod.convex.cloud
```

**Where to set:**
- Local dev: `.env.local` files
- Vercel: Environment variables per environment (Preview/Production)
- Convex Dashboard: `CLERK_JWT_ISSUER_DOMAIN` in each deployment

### 4. TODO Fixes

| Location | TODO | Fix |
|----------|------|-----|
| `properties/page.tsx:196` | Show toast on save error | Use sonner `toast.error()` |
| `dashboard/settings/page.tsx:46` | Update Convex user | Call `updateProfile` mutation |

**Note:** `dashboard/properties/new/page.tsx:82` (Submit to Convex) is NOT a necessary TODO - it already simulates submission and the create flow exists elsewhere. Skip this one.

### 5. Claude Code Actions

**Decision:** Add two GitHub Actions workflows for AI-assisted development

**Why:**
- Small team benefits from automated code review
- Security review catches vulnerabilities before production
- On-demand `@claude` trigger controls API costs
- Fits existing agent-driven development workflow

**Workflow 1: Claude PR Assistant** (`claude-pr-assistant.yml`)
- Trigger: Comment `@claude` on PR or issue
- Use case: On-demand code review, implementation help
- Cost: Only when explicitly triggered

**Workflow 2: Security Review** (`security-review.yml`)
- Trigger: Automatic on every PR
- Use case: Catch security vulnerabilities
- Cost: ~$0.05-0.20 per PR (acceptable for production safety)

**Required secrets:**
- `ANTHROPIC_API_KEY` - Your Anthropic API key for Claude

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Sentry cost at scale | Start with 10% transaction sampling |
| Source map exposure | Sentry handles securely, not public |
| Env var misconfiguration | Document clearly, validate at build |
| Claude API costs | Security review auto, PR assistant on-demand only |
| Claude hallucinations | Human reviews Claude's suggestions before merging |

## Migration Plan

1. Add Sentry SDK and configure
2. Add Vercel Analytics
3. Fix code TODOs
4. Add Claude Code Action workflows
5. Update .env.example with production docs
6. Add `ANTHROPIC_API_KEY` to GitHub secrets
7. Deploy to Vercel, set env vars
8. Create prod Convex deployment, set env vars

## Open Questions

None - straightforward integration.
