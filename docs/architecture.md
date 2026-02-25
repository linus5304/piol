# Architecture

This document describes the system architecture of Piol, a Cameroon housing marketplace built as a monorepo with a Next.js frontend and Convex serverless backend.

## Table of Contents

- [System Overview](#system-overview)
- [Component Layers](#component-layers)
- [Data Flow](#data-flow)
- [Authentication Flow](#authentication-flow)
- [Monorepo Structure](#monorepo-structure)
- [Key Architectural Decisions](#key-architectural-decisions)

## System Overview

```mermaid
graph TD
    Client["Next.js 16 App<br/>(App Router + Turbopack)"]
    Convex["Convex Backend<br/>(Serverless + Realtime DB)"]
    Clerk["Clerk<br/>(Authentication)"]
    Storage["Convex File Storage<br/>(Images, Documents)"]
    Scheduled["Convex Scheduled Tasks<br/>(Background Jobs)"]
    Mapbox["Mapbox<br/>(Maps + Geocoding)"]
    Vercel["Vercel<br/>(Hosting + CDN)"]
    Sentry["Sentry<br/>(Error Tracking)"]

    Client <-->|"useQuery / useMutation<br/>WebSocket (realtime)"| Convex
    Client -->|"JWT Token"| Clerk
    Clerk -->|"JWT Verification"| Convex
    Convex <-->|"storageId references"| Storage
    Convex -->|"Scheduled functions"| Scheduled
    Client -->|"Map tiles + Geocoding"| Mapbox
    Client -->|"Deployed on"| Vercel
    Client -->|"Error reports"| Sentry
```

## Component Layers

The frontend follows a layered architecture:

```mermaid
graph TD
    Pages["App Router Pages<br/>(apps/web/src/app/)"]
    Components["React Components<br/>(apps/web/src/components/)"]
    Hooks["Custom Hooks<br/>(apps/web/src/hooks/)"]
    ConvexAPI["Convex API<br/>(@repo/convex)"]
    Lib["Utilities<br/>(apps/web/src/lib/)"]
    I18n["Internationalization<br/>(apps/web/src/i18n/)"]

    Pages --> Components
    Pages --> Hooks
    Components --> Hooks
    Components --> Lib
    Components --> I18n
    Hooks --> ConvexAPI
    Hooks --> Lib
```

### Pages (`apps/web/src/app/`)

Next.js App Router pages that define routes and layouts. Server Components by default, Client Components only when interactivity is needed.

Key routes:
- `/` - Public landing page
- `/properties` - Public property search and listing
- `/properties/[id]` - Public property detail
- `/dashboard` - Authenticated dashboard (role-dependent layout)
- `/dashboard/properties` - Landlord property management
- `/dashboard/admin` - Admin panel (user/application management)
- `/dashboard/verify` - Verifier panel
- `/dashboard/messages` - Messaging between users
- `/dashboard/payments` - Payment history
- `/dashboard/settings` - User settings

### Components (`apps/web/src/components/`)

Reusable React components built with shadcn/ui and Tailwind v4. Organized by feature domain (e.g., `properties/`, `layouts/`).

### Hooks (`apps/web/src/hooks/`)

Custom React hooks encapsulating business logic, Convex queries/mutations, and authentication state.

### Convex API (`packages/convex/convex/`)

Backend functions organized by domain:
- `users.ts` - User CRUD, profile management
- `properties.ts` - Property listing, search, CRUD
- `messages.ts` - Messaging between users
- `transactions.ts` - Payment tracking
- `verifications.ts` - Property verification workflow
- `landlordApplications.ts` - Landlord application review
- `savedProperties.ts` - Favorites/bookmarks
- `reviews.ts` - Property and user reviews
- `notifications.ts` - User notifications
- `files.ts` - File upload/download URLs
- `http.ts` - HTTP routes (webhooks)

## Data Flow

### Reading Data (Realtime)

```mermaid
sequenceDiagram
    participant UI as React Component
    participant Hook as useQuery Hook
    participant WS as WebSocket
    participant Conv as Convex Query
    participant DB as Convex Database

    UI->>Hook: useQuery(api.properties.list, { city })
    Hook->>WS: Subscribe to query
    WS->>Conv: Execute query function
    Conv->>DB: db.query("properties").withIndex("by_city", ...)
    DB-->>Conv: Results
    Conv-->>WS: Return data
    WS-->>Hook: Update reactive state
    Hook-->>UI: Re-render with data

    Note over DB,WS: On any DB change matching the query,<br/>Convex automatically pushes updates
```

### Writing Data

```mermaid
sequenceDiagram
    participant UI as React Component
    participant Hook as useMutation Hook
    participant Conv as Convex Mutation
    participant Auth as ctx.auth
    participant DB as Convex Database

    UI->>Hook: mutate({ title, city, ... })
    Hook->>Conv: Call mutation function
    Conv->>Auth: getUserIdentity()
    Auth-->>Conv: { subject: clerkId, ... }
    Conv->>DB: db.insert("properties", { ... })
    DB-->>Conv: Document ID
    Conv-->>Hook: Return result
    Hook-->>UI: Optimistic update + confirmation
```

## Authentication Flow

Authentication uses Clerk for identity management with Convex for backend authorization.

```mermaid
sequenceDiagram
    participant User as Browser
    participant Clerk as Clerk
    participant Next as Next.js
    participant Conv as Convex

    User->>Clerk: Sign in (email/password or OAuth)
    Clerk-->>User: Session + JWT
    User->>Next: Request page
    Next-->>User: Render with ClerkProvider

    Note over User,Conv: On Convex API calls:
    User->>Conv: Request with Clerk JWT
    Conv->>Clerk: Verify JWT (via JWKS)
    Clerk-->>Conv: Valid identity
    Conv->>Conv: ctx.auth.getUserIdentity()
    Conv->>Conv: Look up user by clerkId
    Conv-->>User: Authorized response
```

### Provider Hierarchy

The app wraps components in nested providers (see `apps/web/src/app/providers.tsx`):

```
ClerkProvider (authentication)
  └── ThemeProvider (dark/light mode via next-themes)
      └── ConvexProviderWithClerk (realtime backend + auth bridge)
          └── QueryClientProvider (TanStack Query for non-Convex data)
              └── GTProvider (internationalization via gt-next)
                  └── App Content
```

### Role-Based Access

Users have one of four roles: `renter`, `landlord`, `admin`, `verifier`. The dashboard layout (`apps/web/src/app/dashboard/layout.tsx`) adapts based on role:

- **Renter**: Tab-based navigation layout (mobile-friendly)
- **Landlord**: Sidebar navigation layout
- **Admin**: Sidebar navigation with admin panel access
- **Verifier**: Sidebar navigation with verification panel access

## Monorepo Structure

```
piol/
├── apps/
│   └── web/                          # @repo/web - Next.js 16 web app
│       ├── src/
│       │   ├── app/                  # App Router pages and layouts
│       │   ├── components/           # React components (shadcn/ui based)
│       │   ├── hooks/                # Custom React hooks
│       │   ├── lib/                  # Utilities, validations, env config
│       │   └── i18n/                 # Internationalization (en/fr locales)
│       └── e2e/                      # Playwright E2E tests
│           ├── fixtures/             # Test fixtures (auth)
│           ├── pages/                # Page object models
│           └── tests/                # Test specs
├── packages/
│   ├── convex/                       # @repo/convex - Convex backend
│   │   ├── convex/                   # Backend functions and schema
│   │   └── __tests__/                # Backend unit tests (vitest)
│   ├── ui/                           # @repo/ui - Shared UI components
│   ├── types/                        # @repo/types - Shared TypeScript types
│   └── config/                       # @repo/config - Shared configuration
├── turbo.json                        # Turborepo task configuration
├── biome.json                        # Biome linter/formatter config
└── package.json                      # Root workspace config
```

### Package Responsibilities

| Package | Name | Purpose |
|---------|------|---------|
| `apps/web` | `@repo/web` | Next.js 16 frontend with App Router, Turbopack dev server |
| `packages/convex` | `@repo/convex` | Convex backend: schema, queries, mutations, actions, HTTP routes |
| `packages/ui` | `@repo/ui` | Shared UI components across apps |
| `packages/types` | `@repo/types` | Shared TypeScript type definitions |
| `packages/config` | `@repo/config` | Shared configuration (e.g., Tailwind, TypeScript) |

### Build Tool Chain

- **Turborepo** orchestrates builds across packages with caching
- **Bun** is the package manager and JavaScript runtime
- **Biome** handles linting and formatting (replaces ESLint + Prettier)
- **TypeScript** for type safety across all packages

## Key Architectural Decisions

### Why Convex over traditional REST/GraphQL?

- **Realtime by default**: All queries automatically subscribe to changes via WebSocket
- **No API layer to maintain**: Functions are called directly from the client
- **ACID transactions**: Mutations run in database transactions
- **Integrated file storage**: No separate S3/Cloudinary setup needed
- **Serverless scaling**: No infrastructure management

### Why Clerk for auth?

- **Pre-built UI components**: Sign-in/sign-up forms with localization
- **JWT integration with Convex**: Native `ConvexProviderWithClerk` bridge
- **Webhook-based sync**: User data syncs to Convex via Clerk webhooks (`packages/convex/convex/http.ts`)
- **Multi-language**: Supports French and English localizations

### Why Tailwind v4 + shadcn/ui?

- **Design tokens**: Consistent theming via CSS variables (no hardcoded colors)
- **Composable components**: shadcn/ui components are copied into the project and fully customizable
- **Dark mode**: Built-in with `next-themes` provider

### Why Turborepo + Bun?

- **Fast installs**: Bun's package manager is significantly faster than npm/yarn
- **Task caching**: Turborepo caches build/lint/typecheck results
- **Parallel execution**: Independent tasks run simultaneously
- **Workspace protocol**: Clean dependency management between packages
