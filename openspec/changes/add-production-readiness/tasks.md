## 1. Sentry Integration

- [ ] 1.1 Install `@sentry/nextjs` in web app
- [ ] 1.2 Run `npx @sentry/wizard@latest -i nextjs` to scaffold config files
- [ ] 1.3 Configure `sentry.client.config.ts` with environment-aware settings
- [ ] 1.4 Configure `sentry.server.config.ts` for server-side errors
- [ ] 1.5 Configure `sentry.edge.config.ts` for edge runtime
- [ ] 1.6 Update `next.config.ts` to use `withSentryConfig`
- [ ] 1.7 Add Sentry env vars to `.env.example` documentation

## 2. Vercel Analytics

- [ ] 2.1 Install `@vercel/analytics` and `@vercel/speed-insights`
- [ ] 2.2 Add `<Analytics />` component to root layout
- [ ] 2.3 Add `<SpeedInsights />` component to root layout

## 3. Fix Code TODOs

- [ ] 3.1 Add toast notification on save error in `properties/page.tsx`
- [ ] 3.2 Wire `updateProfile` mutation in `dashboard/settings/page.tsx`

## 4. Claude Code Actions

- [ ] 4.1 Create `claude-pr-assistant.yml` workflow with `@claude` trigger
- [ ] 4.2 Create `security-review.yml` workflow for automatic PR security scanning
- [ ] 4.3 Document `ANTHROPIC_API_KEY` secret requirement in README

## 5. Environment Documentation

- [ ] 5.1 Update `.env.example` with clear production setup instructions
- [ ] 5.2 Document Convex deployment switching in AGENTS.md
- [ ] 5.3 Document GitHub secrets needed (ANTHROPIC_API_KEY, VERCEL_*, CONVEX_*)

## 6. Validation

- [ ] 6.1 Test Sentry error capture locally (throw test error)
- [ ] 6.2 Verify build succeeds with Sentry
- [ ] 6.3 Test settings form saves to Convex
- [ ] 6.4 Test `@claude` trigger on a test PR (after secrets configured)
