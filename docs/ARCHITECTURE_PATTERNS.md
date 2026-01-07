# Architecture Patterns — Piol Web App

> Based on insights from [Lee Robinson's Agents article](https://leerob.com/agents), [Anthropic's harness guide](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), and [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure).

---

## Core Philosophy

### Complexity Budget

> "With AI and coding agents, the cost of an abstraction has never been higher." — Lee Robinson

Every layer of abstraction makes code harder for AI agents to understand and modify. Prioritize:
- **Greppable code** — Content should be searchable in the codebase
- **Inline over dynamic** — Static content belongs in JSX, not fetched from APIs
- **Explicit over clever** — Verbose but clear beats compact but opaque

### Content as Code

For marketing pages, inline the content directly in JSX instead of abstracting into data files:

```tsx
// ✅ Good: Greppable, agent-friendly
export function HowItWorks() {
  return (
    <section>
      <h2>Comment ça marche</h2>
      <div>
        <h3>1. Recherchez</h3>
        <p>Filtrez par ville, prix et type de logement</p>
      </div>
      <div>
        <h3>2. Contactez</h3>
        <p>Discutez avec les propriétaires vérifiés</p>
      </div>
      <div>
        <h3>3. Emménagez</h3>
        <p>Payez par Mobile Money et récupérez vos clés</p>
      </div>
    </section>
  );
}

// ❌ Avoid: Extra indirection, harder to grep
const steps = [
  { title: '1. Recherchez', desc: 'Filtrez par ville...' },
  { title: '2. Contactez', desc: 'Discutez avec...' },
  { title: '3. Emménagez', desc: 'Payez par Mobile...' },
];
export function HowItWorks() {
  return (
    <section>
      <h2>Comment ça marche</h2>
      {steps.map(step => (
        <div key={step.title}>
          <h3>{step.title}</h3>
          <p>{step.desc}</p>
        </div>
      ))}
    </section>
  );
}
```

**When to use arrays:** Only when the data is truly dynamic (from DB) or repeated 10+ times.

---

## Recommended Project Structure

### Route Groups Strategy

```
apps/web/src/app/
├── (marketing)/                 # Public marketing pages
│   ├── layout.tsx               # PublicLayout: header, footer
│   ├── page.tsx                 # Homepage (/)
│   ├── about/
│   │   └── page.tsx             # /about
│   ├── contact/
│   │   └── page.tsx             # /contact
│   ├── properties/
│   │   ├── page.tsx             # /properties (browse)
│   │   └── [id]/
│   │       └── page.tsx         # /properties/[id] (detail)
│   ├── terms/
│   │   └── page.tsx             # /terms
│   └── privacy/
│       └── page.tsx             # /privacy
│
├── (app)/                       # Authenticated app area
│   ├── layout.tsx               # AppLayout: sidebar, topbar
│   ├── dashboard/
│   │   ├── page.tsx             # /dashboard
│   │   ├── properties/
│   │   │   ├── page.tsx         # /dashboard/properties
│   │   │   ├── new/
│   │   │   │   └── page.tsx     # /dashboard/properties/new
│   │   │   └── [id]/
│   │   │       └── page.tsx     # /dashboard/properties/[id]
│   │   ├── messages/
│   │   │   ├── page.tsx         # /dashboard/messages
│   │   │   └── [id]/
│   │   │       └── page.tsx     # /dashboard/messages/[id]
│   │   ├── payments/
│   │   │   └── page.tsx         # /dashboard/payments
│   │   ├── saved/
│   │   │   └── page.tsx         # /dashboard/saved
│   │   ├── settings/
│   │   │   └── page.tsx         # /dashboard/settings
│   │   └── onboarding/
│   │       └── page.tsx         # /dashboard/onboarding
│   └── _components/             # App-specific components (private)
│       ├── dashboard-nav.tsx
│       └── stats-cards.tsx
│
├── (auth)/                      # Auth pages (existing)
│   ├── layout.tsx
│   ├── sign-in/
│   └── sign-up/
│
├── layout.tsx                   # Root layout (providers, fonts)
├── globals.css
└── providers.tsx
```

### Benefits of This Structure

| Benefit | Explanation |
|---------|-------------|
| **Separate layouts** | Marketing has header/footer, app has sidebar |
| **URL unchanged** | Route groups don't affect URL paths |
| **Colocation** | App-specific components in `(app)/_components/` |
| **Clear ownership** | Marketing team owns `(marketing)/`, product owns `(app)/` |

---

## Internationalization Strategy

### Option A: Build-Time AI Translation (Recommended)

Per Lee Robinson's approach, use French as the source language and generate translations at build time:

```
# Build process
1. Write content in French (source of truth)
2. Run AI translation script during build
3. Generate English locale files automatically
4. Deploy with both locales
```

**Implementation:**

```typescript
// scripts/translate.ts
import Anthropic from '@anthropic-ai/sdk';

async function translateLocale(sourceLocale: string, targetLocale: string) {
  const source = await import(`../i18n/locales/${sourceLocale}.json`);
  const client = new Anthropic();
  
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: `Translate this JSON from French to English. Preserve all keys exactly. Return only valid JSON.\n\n${JSON.stringify(source, null, 2)}`
    }]
  });
  
  // Write to en.json
  await writeFile(`../i18n/locales/${targetLocale}.json`, response.content);
}
```

**Add to build:**

```json
// package.json
{
  "scripts": {
    "translate": "tsx scripts/translate.ts",
    "build": "npm run translate && next build"
  }
}
```

### Option B: Manual Locale Files (Current)

Keep the current `next-intl` approach but:
- French (`fr.json`) is source of truth
- English (`en.json`) is maintained manually
- Use translation keys for dynamic content only

**When to use translation keys:**
- ✅ Dynamic content (user-generated, DB-driven)
- ✅ Reused strings (button labels, common phrases)
- ❌ Marketing copy (inline in JSX instead)

---

## Component Hierarchy

### Marketing Pages

```
(marketing)/layout.tsx
└── PublicLayout
    ├── Header (nav, logo, auth buttons)
    ├── {children}
    └── Footer (links, copyright)
```

### App Pages

```
(app)/layout.tsx
└── AppLayout
    ├── Sidebar (nav, user info)
    ├── TopBar (breadcrumbs, actions)
    └── {children}
```

### Shared UI Components

Located in `src/components/ui/` — these are primitives used everywhere:
- `Button`, `Card`, `Input`, `Badge`, etc.
- Should be unopinionated about layout
- Import from `@/components/ui/*`

---

## Subdomain Architecture (Future)

For larger scale, consider splitting into:

| Domain | Purpose | Stack |
|--------|---------|-------|
| `piol.cm` | Marketing site | Next.js static |
| `app.piol.cm` | Dashboard app | Next.js + Convex |
| `api.piol.cm` | API (if needed) | Convex HTTP |

**Implementation with Next.js Multi-Zones:**

```javascript
// next.config.js (marketing site)
module.exports = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: 'https://app.piol.cm/:path*',
        },
      ],
    };
  },
};
```

**Benefits:**
- Marketing can be fully static (faster, cheaper)
- App can use ISR/SSR as needed
- Independent deployments
- Different caching strategies

---

## Agent-Friendly Patterns

### Make Content Greppable

```bash
# Agent should be able to find content with:
rg "Comment ça marche" apps/web/
rg "Annonces vérifiées" apps/web/

# Not hidden behind:
rg "howItWorks.title" # Then find in JSON file
```

### Explicit Imports

```tsx
// ✅ Good: Clear what's being used
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// ❌ Avoid: Barrel imports hide dependencies
import { Button, Card, CardContent, CardHeader } from '@/components/ui';
```

### Flat Component Structure

```tsx
// ✅ Good: Flat, one component per file
// components/property-card.tsx
// components/property-list.tsx
// components/property-filters.tsx

// ❌ Avoid: Deep nesting
// components/properties/card/index.tsx
// components/properties/card/image.tsx
// components/properties/card/price.tsx
```

---

## Migration Path

If restructuring from current to recommended:

### Phase 1: Route Groups (Low Risk)
1. Create `(marketing)/` and `(app)/` folders
2. Move existing pages into appropriate groups
3. Create group-specific layouts
4. Test all routes work unchanged

### Phase 2: Content Inlining (Medium Risk)
1. Identify marketing pages with hardcoded content
2. Remove translation keys for static marketing copy
3. Keep translation keys for dynamic content only
4. Update English manually or set up build-time translation

### Phase 3: Subdomain Split (Higher Risk, Optional)
1. Set up separate Next.js projects
2. Configure DNS and routing
3. Migrate marketing pages to static site
4. Keep app on main domain

---

## Checklist for New Pages

### Marketing Page
- [ ] In `(marketing)/` route group
- [ ] Uses `PublicLayout`
- [ ] Content inlined in JSX (French source)
- [ ] Server Component by default
- [ ] SEO metadata defined
- [ ] Mobile responsive

### App Page
- [ ] In `(app)/` route group
- [ ] Uses `AppLayout`
- [ ] Protected by auth check in layout
- [ ] Loading skeleton for async content
- [ ] Error boundary in place
- [ ] Convex queries with proper loading states
