# Environment Matrix

## Scope
This matrix is the source of truth for web + Convex + Clerk production readiness.

## Environment Topology
- Local: developer machine, Convex dev deployment, Clerk test instance.
- Preview: Vercel preview deployment, Convex dev or preview deployment, Clerk test instance.
- Production: Vercel production deployment, Convex production deployment, Clerk production instance (or test keys pre-launch).

## Ownership Matrix

| Surface | Variables | Notes |
|---|---|---|
| Local `.env.local` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_APP_URL`, `GT_PROJECT_ID`, `GT_API_KEY`, `NEXT_PUBLIC_GT_PROJECT_ID`, optional `NEXT_PUBLIC_SENTRY_DSN`, optional `SENTRY_AUTH_TOKEN`, optional `SENTRY_ORG`, optional `SENTRY_PROJECT`, optional `NEXT_PUBLIC_PAYMENTS_ENABLED` | Local only. Do not store production secrets here. |
| Convex Dashboard (dev + prod) | `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_WEBHOOK_SECRET`, `CONVEX_SITE_URL`, `MTN_MOMO_*`, `ORANGE_MONEY_*` | Required for Convex auth/webhooks/payment actions. |
| Vercel Environment Variables | Preview: Clerk test keys + `NEXT_PUBLIC_CONVEX_URL`; Production: Clerk prod or test keys + `NEXT_PUBLIC_CONVEX_URL` + app/public vars | Preview must use Clerk test keys on `*.vercel.app`. |
| GitHub Repository Secrets | `CONVEX_DEPLOY_KEY`, `CONVEX_URL`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `ANTHROPIC_API_KEY` | Used by CI/CD and automation workflows. |

## Required Compatibility Rules
- `NEXT_PUBLIC_CONVEX_URL` is canonical.
- Temporary migration fallback is supported: if `NEXT_PUBLIC_CONVEX_URL` is missing, app falls back to `CONVEX_URL`.
- `CLERK_JWT_ISSUER_DOMAIN` must match the Clerk instance for the keys in use.
- `NEXT_PUBLIC_PAYMENTS_ENABLED` defaults to `false` for staged launch.

## Deployment Mapping

| Deployment Target | Clerk Key Type | Convex Deployment | Payments Flag |
|---|---|---|---|
| Local | `pk_test_*`, `sk_test_*` | `dev:<project>` | `false` |
| Preview | `pk_test_*`, `sk_test_*` | dev/preview | `false` |
| Production Wave 1 | test or live keys (custom domain required for live) | `prod:<project>` | `false` |
| Production Wave 2 | live keys preferred | `prod:<project>` | `true` after validation |

## Verification Checklist
- `bun run dev` starts without env parse failures.
- Convex auth works (no provider mismatch errors).
- Preview sign-in/sign-up works on Vercel preview URL.
- Production auth works only on approved custom domain.
- Payment actions are hidden when `NEXT_PUBLIC_PAYMENTS_ENABLED=false`.
