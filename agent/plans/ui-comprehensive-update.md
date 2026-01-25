# Comprehensive UI & Feature Update Plan

**Created:** 2026-01-24
**Status:** Pending Implementation
**Session:** Can be resumed by any Claude session

---

## Overview

This plan covers 10 major improvements to the Piol housing marketplace application:
1. Server-side filtering with URL params
2. GeistMono font strategic usage
3. Consistent dashboard container layout
4. Recent properties with real data
5. User roles workflow documentation
6. Dark theme activation
7. Aceternity UI for landing page (Subtle effects)
8. Contact block component
9. Features block enhancement
10. AI translation engine (Anthropic Claude)

**User Preferences:**
- AI Provider: Anthropic Claude (claude-3-haiku)
- Admin UI: Yes, create admin/verifier dashboards
- Animations: Subtle (GridPattern, hover effects, no heavy particles)

---

## Phase 1: Foundation (No Dependencies)

### 1.1 Dark Theme Activation

**Files to modify:**
- `apps/web/src/app/providers.tsx` - Add ThemeProvider wrapper
- `apps/web/src/components/header.tsx` - Add theme toggle
- Create `apps/web/src/components/theme-toggle.tsx` - New component

**Implementation:**
```typescript
// providers.tsx - wrap content with ThemeProvider
import { ThemeProvider } from 'next-themes';

// Inside return, wrap children:
<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  {children}
</ThemeProvider>
```

The dark mode CSS already exists in `globals.css` (lines 92-135). Just need to activate it.

### 1.2 Server-side Filtering with useSearchParams

**Files to modify:**
- `apps/web/src/app/properties/page.tsx` - Convert useState to useSearchParams

**Current state (line 130-137):**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [selectedCity, setSelectedCity] = useState<string | undefined>();
// ... more useState
```

**Implementation:**
```typescript
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();

// Read from URL
const searchQuery = searchParams.get('q') ?? '';
const selectedCity = searchParams.get('city') ?? undefined;
const selectedCategory = searchParams.get('type') ?? 'all';
const priceRange = searchParams.get('price') ?? 'all';
const sortBy = searchParams.get('sort') ?? 'newest';

// Update URL helper
const updateParams = (updates: Record<string, string | null>) => {
  const params = new URLSearchParams(searchParams.toString());
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === '' || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });
  router.replace(`${pathname}?${params.toString()}`, { scroll: false });
};
```

**URL structure:** `/properties?city=Douala&type=apartment&price=50000-100000&sort=newest&q=bastos`

---

## Phase 2: Data Integration

### 2.1 Recent Properties - Replace Mock Data

**File to modify:**
- `apps/web/src/components/app-sidebar.tsx` (lines 85-89)

**Current mock data:**
```typescript
const recentProperties = [
  { title: 'Appartement Bastos', url: '/dashboard/properties/1' },
  { title: 'Villa Bonanjo', url: '/dashboard/properties/2' },
  { title: 'Studio Akwa', url: '/dashboard/properties/3' },
];
```

**Implementation:**
```typescript
import { useQuery } from 'convex/react';
import { api } from '@repo/convex/_generated/api';

// Inside AppSidebar component:
const myProperties = useQuery(api.properties.getMyProperties);

const recentProperties = useMemo(() => {
  if (!myProperties) return [];
  return myProperties.slice(0, 3).map(p => ({
    title: p.title,
    url: `/dashboard/properties/${p._id}`
  }));
}, [myProperties]);
```

Add loading skeleton when `myProperties === undefined`.

### 2.2 GeistMono Font Strategic Usage

**Files to modify:**
- `apps/web/src/app/dashboard/page.tsx` - Transaction IDs/references
- `apps/web/src/components/properties/property-card.tsx` - Prices
- `apps/web/src/app/dashboard/properties/[id]/page.tsx` - Property IDs

**Usage locations (add `font-mono` class):**
1. Transaction reference numbers (e.g., `TXN-2024-001234`)
2. Property IDs when displayed
3. Price amounts with currency (maintains alignment with `tabular-nums`)
4. Dates in tables (consistent column width)
5. Phone numbers in contact info

**Example:**
```tsx
<span className="font-mono text-sm tabular-nums">
  {formatCurrency(property.rentAmount)}
</span>
```

---

## Phase 3: Dashboard Layout

### 3.1 Consistent Container Layout

**Files to modify:**
- `apps/web/src/app/dashboard/layout.tsx` - Add container wrapper
- `apps/web/src/app/dashboard/page.tsx` - Remove redundant padding
- `apps/web/src/app/dashboard/properties/page.tsx` - Align pattern
- `apps/web/src/app/dashboard/properties/[id]/page.tsx` - Align pattern
- `apps/web/src/app/dashboard/properties/new/page.tsx` - Align pattern

**Standard dashboard container pattern:**
```typescript
// In dashboard layout for main content area:
<main className="flex flex-1 flex-col">
  <div className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl w-full">
    {children}
  </div>
</main>
```

Remove duplicate `px-4 lg:px-6` from individual pages since layout handles it.

---

## Phase 4: User Roles Workflow

### 4.1 RBAC Documentation & Implementation

**Files to create:**
- `apps/web/src/lib/permissions.ts` - Permission constants and helpers
- `apps/web/src/hooks/use-permissions.ts` - React hook for permission checks

**Current roles from schema (4 total):**
1. `renter` - Browse, save, message, pay
2. `landlord` - Create/manage properties, receive payments
3. `admin` - Full access, manage users
4. `verifier` - Verify properties, update verification status

**Permission matrix:**
```typescript
export const PERMISSIONS = {
  'property:create': ['landlord', 'admin'],
  'property:edit:own': ['landlord', 'admin'],
  'property:edit:any': ['admin'],
  'property:delete:own': ['landlord', 'admin'],
  'property:verify': ['admin', 'verifier'],
  'property:view:draft': ['landlord', 'admin', 'verifier'],
  'user:manage': ['admin'],
  'user:verify': ['admin', 'verifier'],
  'transaction:view:own': ['renter', 'landlord'],
  'transaction:view:all': ['admin'],
} as const;
```

**Hook usage:**
```typescript
const { can } = usePermissions();
if (can('property:verify')) {
  // Show verification controls
}
```

### 4.2 Admin Dashboard

**Create:** `apps/web/src/app/dashboard/admin/page.tsx`

**Features:**
- User management table (view all users, change roles)
- System statistics (total properties, users, transactions)
- Pending verifications count
- Recent activity log

**Route guard:** Only accessible to `admin` role

### 4.3 Verifier Dashboard

**Create:** `apps/web/src/app/dashboard/verify/page.tsx`

**Features:**
- Queue of properties pending verification
- Property detail view with verification checklist
- Approve/Reject actions with notes
- Verification history

**Verification workflow:**
1. Landlord submits property for verification (`status: pending_verification`)
2. Verifier sees property in queue
3. Verifier reviews: photos, description, pricing
4. Verifier approves or rejects with notes
5. Landlord notified of result

**Files to create:**
- `apps/web/src/app/dashboard/admin/page.tsx` - Admin overview
- `apps/web/src/app/dashboard/admin/users/page.tsx` - User management
- `apps/web/src/app/dashboard/verify/page.tsx` - Verification queue
- `apps/web/src/app/dashboard/verify/[id]/page.tsx` - Property verification detail
- `apps/web/src/components/verification-checklist.tsx` - Checklist component

**Update dashboard layout:** Add role-based navigation for admin/verifier roles

---

## Phase 5: Landing Page Enhancements (Subtle Aceternity)

### 5.1 Install Dependencies & Subtle Effects

**Command:**
```bash
cd apps/web && bun add framer-motion clsx tailwind-merge
```

Note: Aceternity UI components are copy-pasted from their docs, not installed as a package.

**Subtle effects to implement (per user preference):**
- GridPattern backgrounds on feature cards
- Gentle hover scale/shadow transitions
- Smooth scroll-triggered fade-ins using Framer Motion
- No heavy particles, beams, or sparkles

### 5.2 Contact Block Component

**Create:** `apps/web/src/components/contact-block.tsx`

**Based on user-provided pattern with these customizations:**
- Use Piol brand contact info
- i18n translations (already exist in `contact` namespace)
- Form submission to Convex action (or external service)

**Structure:**
```tsx
<section className="container mx-auto px-4 py-20">
  <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
    {/* Left: Contact Info Cards */}
    <div className="space-y-6">
      <h2>{t('contact.title')}</h2>
      <p>{t('contact.subtitle')}</p>
      <div className="grid grid-cols-2 gap-4">
        <ContactCard icon={Mail} label="Email" value="contact@piol.cm" />
        <ContactCard icon={Phone} label="Phone" value="+237 6XX XXX XXX" />
        <ContactCard icon={MapPin} label="Address" value="Douala, Cameroon" className="col-span-2" />
      </div>
    </div>
    {/* Right: Contact Form */}
    <form className="space-y-4">
      {/* Name, Email, Phone, Message fields */}
    </form>
  </div>
</section>
```

### 5.3 Features Block Enhancement

**Modify:** `apps/web/src/app/page.tsx` (lines 265-308)

**Enhancements:**
1. Add GridPattern background (already referenced in user's example)
2. Add subtle hover animations with Framer Motion
3. Expand to 6 features (user's example has 6)
4. Use i18n for all text

**Feature list for Piol:**
```typescript
const features = [
  { title: 'Verified Listings', icon: CheckCircle2, key: 'verifiedListings' },
  { title: 'Mobile Money', icon: Smartphone, key: 'mobilePayment' },
  { title: 'Bilingual Support', icon: Languages, key: 'bilingualSupport' },
  { title: 'ID Verification', icon: Fingerprint, key: 'idVerification' },
  { title: 'Secure Payments', icon: Shield, key: 'securePayments' },
  { title: 'Direct Messaging', icon: MessageSquare, key: 'directMessaging' },
];
```

### 5.4 Hero Section Enhancement (Optional Aceternity)

Consider adding:
- `SparklesCore` or `BackgroundBeams` as subtle background
- `TextGenerateEffect` for headline animation
- These are optional and can be added incrementally

---

## Phase 6: AI Translation Engine (Using Anthropic Claude)

### 6.1 Architecture

**Approach:** Hybrid translation system
- Static strings: Keep in JSON files (performance, SEO, no API cost)
- Dynamic content: AI translation for user-generated content (property descriptions, messages)
- Caching: Store translations in Convex to avoid repeated API calls
- Provider: **Anthropic Claude** (better French/English context)

**Files to create:**
- `packages/convex/convex/translations.ts` - Convex queries/mutations/actions
- `apps/web/src/hooks/use-translated-content.ts` - Hook for translated text
- `apps/web/src/components/translated-text.tsx` - Component with loading state

### 6.2 Convex Translation Service

```typescript
// packages/convex/convex/translations.ts

// Schema addition (in schema.ts):
translations: defineTable({
  sourceText: v.string(),
  sourceLocale: v.string(),
  targetLocale: v.string(),
  translatedText: v.string(),
  hash: v.string(), // SHA256 of sourceText for lookup
}).index('by_hash_locale', ['hash', 'targetLocale']),

// Query to get cached translation
export const getTranslation = query({...});

// Action to translate via Anthropic Claude (uses internal mutation to cache)
export const translateText = action({
  args: { text: v.string(), sourceLocale: v.string(), targetLocale: v.string() },
  handler: async (ctx, args) => {
    // Check cache first via internal query
    // If not cached, call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // Fast and cheap for translations
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Translate the following ${args.sourceLocale} text to ${args.targetLocale}. Return only the translation, no explanations:\n\n${args.text}`
        }]
      })
    });
    // Cache and return
  }
});
```

### 6.3 Translation Hook

```typescript
// apps/web/src/hooks/use-translated-content.ts
export function useTranslatedContent(text: string, sourceLocale = 'fr') {
  const currentLocale = useLocale();

  // If same locale, return original
  if (currentLocale === sourceLocale) return { text, isLoading: false };

  // Check cache first
  const cached = useQuery(api.translations.getTranslation, {
    text,
    targetLocale: currentLocale,
  });

  // Trigger translation if not cached
  const translate = useAction(api.translations.translateText);

  useEffect(() => {
    if (cached === null) {
      translate({ text, sourceLocale, targetLocale: currentLocale });
    }
  }, [cached, text, sourceLocale, currentLocale, translate]);

  return {
    text: cached?.translatedText ?? text,
    isLoading: cached === undefined,
  };
}
```

### 6.4 Environment Setup

Add to Convex Dashboard environment variables:
- `ANTHROPIC_API_KEY` - Required for Claude translations

---

## Implementation Order

```
┌─────────────────────────────────────────────────────────┐
│ Phase 1 (Parallel)                                      │
│ ┌─────────────────────┐ ┌─────────────────────────────┐ │
│ │ 1.1 Dark Theme     │ │ 1.2 Server-side Filtering  │ │
│ └─────────────────────┘ └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 2 (Parallel)                                      │
│ ┌─────────────────────┐ ┌─────────────────────────────┐ │
│ │ 2.1 Recent Props   │ │ 2.2 GeistMono Usage        │ │
│ └─────────────────────┘ └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 3                                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 3.1 Dashboard Container Layout                     │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 4 (Admin & Verifier Dashboards)                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 4.1 RBAC + 4.2 Admin + 4.3 Verifier Dashboards     │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 5 (Parallel)                                      │
│ ┌─────────────────┐ ┌─────────────┐ ┌────────────────┐ │
│ │ Contact Block  │ │ Features   │ │ Aceternity UI │ │
│ └─────────────────┘ └─────────────┘ └────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 6                                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 6.1 AI Translation Engine                          │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Critical Files Summary

| Task | Files |
|------|-------|
| Dark theme | `providers.tsx`, `header.tsx`, new `theme-toggle.tsx` |
| URL filtering | `app/properties/page.tsx` |
| Recent properties | `components/app-sidebar.tsx` |
| GeistMono | `dashboard/page.tsx`, `property-card.tsx`, various |
| Dashboard layout | `dashboard/layout.tsx`, all dashboard pages |
| RBAC | new `lib/permissions.ts`, new `hooks/use-permissions.ts` |
| Admin dashboard | new `app/dashboard/admin/page.tsx`, `admin/users/page.tsx` |
| Verifier dashboard | new `app/dashboard/verify/page.tsx`, `verify/[id]/page.tsx` |
| Contact block | new `components/contact-block.tsx`, `app/page.tsx` |
| Features block | `app/page.tsx`, new `components/ui/grid-pattern.tsx` |
| AI translation | new `convex/translations.ts`, new hooks/components, schema update |

---

## Verification Steps

After each phase:
```bash
bun run typecheck
bun run lint:fix
bun run dev  # Manual testing
```

### Testing checklist:
- [ ] Dark mode toggle works, persists on refresh
- [ ] Filters persist in URL, back button works
- [ ] Recent properties show real landlord data
- [ ] Dashboard pages have consistent padding
- [ ] Admin dashboard accessible only to admin role
- [ ] Verifier dashboard shows pending properties queue
- [ ] Property verification workflow completes successfully
- [ ] Contact form submits successfully
- [ ] Features section has GridPattern and hover animations
- [ ] AI translation shows cached translations
- [ ] GeistMono visible on prices, IDs, and references

---

## i18n Updates Required

Add new translation keys for:
- Theme toggle labels (`theme.light`, `theme.dark`, `theme.system`)
- New feature descriptions
- Admin dashboard strings
- Verifier dashboard strings
- Contact form validation messages
- Any new UI strings

Both `en.json` and `fr.json` need updates.

---

## How to Resume This Plan

To continue this implementation in a new Claude session:

1. Read this plan file: `agent/plans/ui-comprehensive-update.md`
2. Check which phases are complete (update checklist above as you go)
3. Start from the next incomplete phase
4. Run verification commands after each phase

**Command to check plan:**
```bash
cat agent/plans/ui-comprehensive-update.md
```
