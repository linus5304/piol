# Secret Provisioning Guide

## Purpose
Where each variable comes from, and where to set it.

## Clerk

| Variable | Get It From | Set It In |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard -> API Keys | Vercel (Preview/Production), local `.env.local` |
| `CLERK_SECRET_KEY` | Clerk Dashboard -> API Keys | Vercel (Preview/Production), local `.env.local` |
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk Dashboard -> API Keys (`*.clerk.accounts.dev` or prod domain) | Convex Dashboard -> Settings -> Environment Variables |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard -> Webhooks -> Endpoint secret | Convex Dashboard -> Settings -> Environment Variables |

## Convex

| Variable | Get It From | Set It In |
|---|---|---|
| `CONVEX_DEPLOYMENT` | Convex CLI output / dashboard deployment label | local `.env.local` |
| `NEXT_PUBLIC_CONVEX_URL` | Convex Dashboard -> deployment URL | Vercel env vars, local `.env.local` |
| `CONVEX_SITE_URL` | Convex deployment site URL (`*.convex.site`) | Convex Dashboard env vars |
| `CONVEX_DEPLOY_KEY` | `npx convex deploy --prod` first-time setup output | GitHub Secrets |

## Sentry (optional)

| Variable | Get It From | Set It In |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry Project -> Client Keys (DSN) | Vercel/local |
| `SENTRY_AUTH_TOKEN` | Sentry Settings -> Auth Tokens | Vercel/GitHub (build contexts) |
| `SENTRY_ORG`, `SENTRY_PROJECT` | Sentry project settings | Vercel/local |

## General Translation

| Variable | Get It From | Set It In |
|---|---|---|
| `GT_PROJECT_ID` | General Translation dashboard | local/Vercel server env |
| `GT_API_KEY` | General Translation dashboard | local/Vercel server env |
| `NEXT_PUBLIC_GT_PROJECT_ID` | General Translation project id alias | local/Vercel |

## MTN MoMo

| Variable | Get It From | Set It In |
|---|---|---|
| `MTN_MOMO_API_USER` | MTN MoMo Developer Portal app credentials | Convex Dashboard env vars |
| `MTN_MOMO_API_KEY` | MTN MoMo Developer Portal app credentials | Convex Dashboard env vars |
| `MTN_MOMO_SUBSCRIPTION_KEY` | MTN MoMo subscription details | Convex Dashboard env vars |
| `MTN_MOMO_ENVIRONMENT` | Deployment intent (`sandbox` or `production`) | Convex Dashboard env vars |

## Orange Money

| Variable | Get It From | Set It In |
|---|---|---|
| `ORANGE_MONEY_CLIENT_ID` | Orange Money developer console | Convex Dashboard env vars |
| `ORANGE_MONEY_CLIENT_SECRET` | Orange Money developer console | Convex Dashboard env vars |
| `ORANGE_MONEY_MERCHANT_KEY` | Orange Money merchant settings | Convex Dashboard env vars |
| `ORANGE_MONEY_ENVIRONMENT` | Deployment intent (`sandbox` or `production`) | Convex Dashboard env vars |

## Vercel + GitHub

| Variable | Get It From | Set It In |
|---|---|---|
| `VERCEL_TOKEN` | Vercel account tokens page | GitHub Secrets |
| `VERCEL_ORG_ID` | Vercel team settings | GitHub Secrets |
| `VERCEL_PROJECT_ID` | Vercel project settings | GitHub Secrets |
| `CONVEX_URL` | Convex deployment URL | GitHub Secrets (`web-ci`) |
| `ANTHROPIC_API_KEY` | Anthropic Console -> API keys | GitHub Secrets |

## Provisioning Order
1. Provision Clerk test instance and set Preview keys.
2. Provision Convex dev/prod and set dashboard env vars.
3. Set Vercel Preview and Production variables separately.
4. Set GitHub Secrets for CI/CD.
5. Validate via `docs/ops/release-gate.md`.
