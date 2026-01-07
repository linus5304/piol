# Frontend Agent Instructions — Next.js Web App

> For AI agents and developers working on `apps/web`

## Key References

- **[ARCHITECTURE_PATTERNS.md](./docs/ARCHITECTURE_PATTERNS.md)** — Route groups, i18n strategy, agent-friendly patterns
- **[Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)** — Official conventions

---

## Architecture Overview

### Recommended Structure (Route Groups)

```
apps/web/src/app/
├── (marketing)/                 # Public marketing pages
│   ├── layout.tsx               # PublicLayout: header, footer
│   ├── page.tsx                 # Homepage (/)
│   ├── about/page.tsx           # /about
│   ├── contact/page.tsx         # /contact
│   ├── properties/              # /properties (browse + detail)
│   ├── terms/page.tsx           # /terms
│   └── privacy/page.tsx         # /privacy
│
├── (app)/                       # Authenticated app area
│   ├── layout.tsx               # AppLayout: sidebar, topbar
│   └── dashboard/               # /dashboard/*
│       ├── page.tsx
│       ├── properties/
│       ├── messages/
│       ├── payments/
│       ├── saved/
│       ├── settings/
│       └── onboarding/
│
├── (auth)/                      # Auth pages
│   ├── layout.tsx
│   ├── sign-in/
│   └── sign-up/
│
├── layout.tsx                   # Root layout (providers, fonts)
└── providers.tsx
```

### Supporting Files

```
apps/web/src/
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Card, etc.)
│   ├── layouts/            # Layout components (PublicLayout, etc.)
│   └── *.tsx               # Feature components (PropertyCard, Header, etc.)
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities (cn, env, utils)
├── i18n/                   # Internationalization
│   ├── request.ts          # Server-side locale detection
│   └── locales/            # Translation files (fr.json = source, en.json = generated)
└── config/                 # App configuration
```

---

## Agent-Friendly Code Principles

> "With AI and coding agents, the cost of an abstraction has never been higher." — Lee Robinson

### 1. Content as Code (Marketing Pages)

Inline content directly in JSX for marketing pages. Makes content greppable and agent-editable:

```tsx
// ✅ Good: Greppable, agent can find and edit
<section>
  <h2>Comment ça marche</h2>
  <div>
    <h3>1. Recherchez</h3>
    <p>Filtrez par ville, prix et type de logement</p>
  </div>
</section>

// ❌ Avoid: Hidden behind translation keys or data arrays
<section>
  <h2>{t('howItWorks.title')}</h2>
  {steps.map(step => <StepCard key={step.id} {...step} />)}
</section>
```

### 2. When to Use Translation Keys

| Use Translation Keys | Inline Content |
|---------------------|----------------|
| Dynamic content (from DB) | Static marketing copy |
| Reused UI strings (buttons) | Page-specific content |
| Error messages | Hero text, feature lists |
| Form labels | "How it works", testimonials |

### 3. Explicit Over Clever

```tsx
// ✅ Good: Clear, explicit imports
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// ❌ Avoid: Barrel imports hide dependencies
import { Button, Card, CardContent } from '@/components/ui';
```

## Core Principles

### 1. Server vs Client Components

**Default to Server Components.** Use `'use client'` only when you need:
- Event handlers (onClick, onChange, etc.)
- React hooks (useState, useEffect, useConvex, etc.)
- Browser APIs

```typescript
// ✅ Server Component (default) - No 'use client' directive
// Runs on server, can fetch data directly, smaller bundle
export default async function PropertyPage({ params }: { params: { id: string } }) {
  // Server-side data fetching would go here
  return <PropertyDetails id={params.id} />;
}

// ✅ Client Component - Has interactivity
'use client';

import { useState } from 'react';

export function SaveButton({ propertyId }: { propertyId: string }) {
  const [isSaved, setIsSaved] = useState(false);
  return (
    <button onClick={() => setIsSaved(!isSaved)}>
      {isSaved ? 'Saved' : 'Save'}
    </button>
  );
}
```

### 2. Data Fetching with Convex

Use Convex React hooks in client components:

```typescript
'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@repo/convex/_generated/api';

export function PropertyList() {
  // Reactive query - auto-updates when data changes
  const result = useQuery(api.properties.listProperties, { 
    city: 'Douala',
    limit: 20 
  });

  // Loading state
  if (result === undefined) {
    return <PropertyListSkeleton />;
  }

  // Error state (Convex throws, handle in error boundary)
  
  // Empty state
  if (result.properties.length === 0) {
    return <EmptyState message="No properties found" />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {result.properties.map(property => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}
```

### 3. Mutations with Optimistic Updates

```typescript
'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@repo/convex/_generated/api';

export function SavePropertyButton({ propertyId }: { propertyId: Id<'properties'> }) {
  const saved = useQuery(api.savedProperties.isPropertySaved, { propertyId });
  const toggleSave = useMutation(api.savedProperties.toggleSave);
  
  const [optimisticSaved, setOptimisticSaved] = useState<boolean | null>(null);
  
  const handleClick = async () => {
    const newState = !(optimisticSaved ?? saved);
    setOptimisticSaved(newState); // Optimistic update
    
    try {
      await toggleSave({ propertyId });
    } catch (error) {
      setOptimisticSaved(null); // Rollback on error
      toast.error('Failed to save property');
    }
  };
  
  const isSaved = optimisticSaved ?? saved ?? false;
  
  return (
    <Button onClick={handleClick} disabled={saved === undefined}>
      <Heart className={cn(isSaved && 'fill-current')} />
    </Button>
  );
}
```

### 4. Authentication with Clerk

```typescript
// In providers.tsx - Wrap app with ClerkProvider
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

// Using auth in components
'use client';

import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

export function Header() {
  const { isSignedIn, user } = useUser();
  
  return (
    <header>
      {isSignedIn ? (
        <>
          <span>Welcome, {user.firstName}</span>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      )}
    </header>
  );
}
```

### 5. Route Protection

```typescript
// app/dashboard/layout.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

## Component Patterns

### UI Components (shadcn/ui)

Located in `components/ui/`. These are primitive building blocks:

```typescript
// ✅ Use UI components for consistency
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function PropertyCard({ property }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{property.title}</CardTitle>
        <Badge variant="secondary">{property.propertyType}</Badge>
      </CardHeader>
      <CardContent>
        <p>{formatCurrency(property.rentAmount)} FCFA/month</p>
      </CardContent>
    </Card>
  );
}
```

### Feature Components

Located in `components/`. Compose UI primitives for specific features:

```typescript
// components/property-card.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// ... compose into feature-specific component
```

### Layout Components

```typescript
// components/layouts/public-layout.tsx
export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageSection({ 
  children, 
  className,
  bordered = false,
  bg = 'default' 
}: PageSectionProps) {
  return (
    <section className={cn(
      'py-12 px-4 md:px-6 lg:px-8',
      bordered && 'border-b',
      bg === 'muted' && 'bg-muted/50',
      bg === 'brand' && 'bg-[#FF385C] text-white',
      className
    )}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}
```

## Styling Guidelines

### Tailwind CSS

Use Tailwind utility classes. Design tokens defined in `tailwind.config.ts`:

```typescript
// ✅ Use semantic color names and spacing scale
<div className="bg-background text-foreground p-4 rounded-xl">
  <h1 className="text-2xl font-semibold text-foreground">Title</h1>
  <p className="text-muted-foreground mt-2">Description</p>
  <Button className="mt-4 bg-[#FF385C] hover:bg-[#E31C5F]">
    Primary Action
  </Button>
</div>

// ❌ Avoid magic numbers and raw colors
<div className="bg-[#f9fafb] text-[#111827] p-[17px]">
```

### Class Merging with `cn()`

```typescript
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'default' | 'outline';
  className?: string;
}

export function MyButton({ variant = 'default', className }: ButtonProps) {
  return (
    <button className={cn(
      'px-4 py-2 rounded-xl font-medium',
      variant === 'default' && 'bg-[#FF385C] text-white',
      variant === 'outline' && 'border border-input bg-background',
      className // Allow overrides
    )}>
      Click me
    </button>
  );
}
```

### Responsive Design

Mobile-first approach:

```typescript
// ✅ Mobile-first (default → sm → md → lg → xl)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>

<h1 className="text-2xl md:text-3xl lg:text-4xl">
  {/* Scales with viewport */}
</h1>
```

## Internationalization (i18n)

### Using Translations

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function PropertyCard({ property }) {
  const t = useTranslations();
  
  return (
    <Card>
      <Badge>{t(`propertyTypes.${property.propertyType}`)}</Badge>
      <p>{t('common.perMonth', { price: formatCurrency(property.rentAmount) })}</p>
    </Card>
  );
}
```

### Translation Files

```json
// i18n/locales/en.json
{
  "common": {
    "loading": "Loading...",
    "perMonth": "{price} FCFA/month",
    "save": "Save",
    "cancel": "Cancel"
  },
  "propertyTypes": {
    "studio": "Studio",
    "1br": "1 Bedroom",
    "2br": "2 Bedrooms",
    "house": "House",
    "villa": "Villa"
  },
  "home": {
    "title": "Find your next home",
    "subtitle": "Verified listings, secure Mobile Money payments"
  }
}
```

```json
// i18n/locales/fr.json
{
  "common": {
    "loading": "Chargement...",
    "perMonth": "{price} FCFA/mois",
    "save": "Sauvegarder",
    "cancel": "Annuler"
  },
  "propertyTypes": {
    "studio": "Studio",
    "1br": "1 Chambre",
    "2br": "2 Chambres",
    "house": "Maison",
    "villa": "Villa"
  },
  "home": {
    "title": "Trouvez votre prochain logement",
    "subtitle": "Annonces vérifiées, paiement sécurisé par Mobile Money"
  }
}
```

**Rules:**
- Never hardcode text strings in components
- Always use translation keys
- Keep translations organized by feature/page
- French is primary (Cameroon), English secondary

## Forms

### React Hook Form + Zod

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@repo/convex/_generated/api';

const propertySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  city: z.string().min(1, 'City is required'),
  rentAmount: z.number().min(10000, 'Minimum rent is 10,000 XAF'),
  propertyType: z.enum(['studio', '1br', '2br', '3br', '4br', 'house', 'apartment', 'villa']),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export function CreatePropertyForm() {
  const createProperty = useMutation(api.properties.createProperty);
  
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      city: '',
      rentAmount: 50000,
      propertyType: 'apartment',
    },
  });
  
  const onSubmit = async (data: PropertyFormData) => {
    try {
      await createProperty(data);
      toast.success('Property created!');
      router.push('/dashboard/properties');
    } catch (error) {
      toast.error('Failed to create property');
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title"
          {...form.register('title')} 
          className={cn(form.formState.errors.title && 'border-destructive')}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>
      
      {/* More fields... */}
      
      <Button 
        type="submit" 
        disabled={form.formState.isSubmitting}
        className="w-full"
      >
        {form.formState.isSubmitting ? 'Creating...' : 'Create Property'}
      </Button>
    </form>
  );
}
```

## Loading & Error States

### Loading Skeletons

```typescript
// Always show skeletons for async content
export function PropertyListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-[4/3] bg-muted animate-pulse" />
          <CardContent className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// In component
export function PropertyList() {
  const result = useQuery(api.properties.listProperties, {});
  
  if (result === undefined) {
    return <PropertyListSkeleton />;
  }
  
  // ... render data
}
```

### Error Boundaries

```typescript
// app/dashboard/error.tsx
'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### Empty States

```typescript
export function EmptyState({ 
  icon: Icon = FileQuestion,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
```

## Performance

### Image Optimization

```typescript
import Image from 'next/image';

// ✅ Always use Next.js Image
<Image
  src={imageUrl}
  alt={property.title}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
  priority={isAboveFold} // Only for LCP images
/>

// ❌ Never use raw img tags for content images
<img src={imageUrl} />
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const PropertyMap = dynamic(() => import('@/components/property-map'), {
  loading: () => <div className="h-64 bg-muted animate-pulse rounded-xl" />,
  ssr: false, // Maps don't work on server
});
```

### Memoization

```typescript
'use client';

import { useMemo, useCallback } from 'react';

export function PropertyFilters({ properties, onFilter }) {
  // Memoize expensive computations
  const cities = useMemo(() => 
    [...new Set(properties.map(p => p.city))].sort(),
    [properties]
  );
  
  // Stable callbacks for child components
  const handleCityChange = useCallback((city: string) => {
    onFilter({ city });
  }, [onFilter]);
  
  return (
    <Select onValueChange={handleCityChange}>
      {cities.map(city => (
        <SelectItem key={city} value={city}>{city}</SelectItem>
      ))}
    </Select>
  );
}
```

## Testing

### Component Tests

```typescript
// __tests__/property-card.test.tsx
import { render, screen } from '@testing-library/react';
import { PropertyCard } from '@/components/property-card';

const mockProperty = {
  _id: '1',
  title: 'Test Property',
  propertyType: '2br',
  rentAmount: 150000,
  currency: 'XAF',
  city: 'Douala',
  neighborhood: 'Bonapriso',
};

describe('PropertyCard', () => {
  it('renders property title', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Test Property')).toBeInTheDocument();
  });
  
  it('formats price correctly', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/150.*000.*FCFA/)).toBeInTheDocument();
  });
  
  it('shows verified badge when approved', () => {
    render(<PropertyCard property={{ ...mockProperty, verificationStatus: 'approved' }} />);
    expect(screen.getByText('Vérifié')).toBeInTheDocument();
  });
});
```

## Checklist for New Pages/Components

- [ ] Server or Client Component? (default to Server)
- [ ] Loading skeleton implemented
- [ ] Error boundary in place
- [ ] Empty state handled
- [ ] Translations used (no hardcoded strings)
- [ ] Responsive design (mobile-first)
- [ ] Accessible (labels, ARIA, keyboard nav)
- [ ] Images optimized with Next.js Image
- [ ] Forms validated with Zod
- [ ] Convex queries have proper loading states
