# Bloc-a-Bloc Property Creation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 798-line monolithic 3-step wizard with a template-first, bloc-a-bloc card flow for property creation.

**Architecture:** Template picker screen → Block form with 7 collapsible cards (accordion on mobile, multi-expand on desktop) → Success screen with social share buttons. Templates pre-fill form fields. Same Convex mutations, same Zod validation, restructured UI.

**Tech Stack:** Next.js 16, React 19, react-hook-form, Zod, shadcn/ui Accordion, Tailwind v4, gt-next i18n, Convex

---

## Task 1: Install Accordion & Create Branch

**Files:**
- Install: `apps/web/src/components/ui/accordion.tsx` (via shadcn CLI)

**Step 1: Create feature branch**
```bash
git checkout -b feat/bloc-a-bloc-property-creation
```

**Step 2: Install accordion**
```bash
cd apps/web && bunx --bun shadcn@latest add accordion
```

**Step 3: Create blocks directory**
```bash
mkdir -p apps/web/src/components/properties/blocks
```

**Step 4: Verify**
```bash
ls apps/web/src/components/ui/accordion.tsx
```

**Step 5: Commit**
```bash
git add apps/web/src/components/ui/accordion.tsx
git commit -m "chore(web): install shadcn accordion component"
```

---

## Task 2: Add i18n Keys

**Files:**
- Modify: `apps/web/src/i18n/locales/en.json` (inside `"newProperty"` object)
- Modify: `apps/web/src/i18n/locales/fr.json` (inside `"newProperty"` object)

**Step 1: Add English keys**

Add these keys inside the `"newProperty"` object after the existing keys (before the closing `}`):

```json
"templatePickerTitle": "Choose a template",
"templatePickerSubtitle": "Pick a template to get started quickly",
"fromScratch": "Start from scratch",
"fromScratchDesc": "Fill in all details yourself",
"rentRangeHint": "Typical: {min} - {max} FCFA",
"blockPropertyType": "Property type",
"blockLocation": "Location",
"blockPricing": "Rent & conditions",
"blockAmenities": "Amenities",
"blockPhotos": "Photos",
"blockDescription": "Description",
"blockLandmarks": "How to find it",
"blockComplete": "Done",
"blockRequired": "Required",
"blockOptional": "Optional",
"blockRecommended": "Recommended",
"blockAmenitiesCount": "{count} selected",
"blockPhotosCount": "{count} photos",
"totalEntry": "Total at entry:",
"customAmount": "Custom",
"useSuggestion": "Use suggestion",
"writeOwn": "Write my own",
"autoTitleHint": "Auto-generated from your details",
"descriptionTemplate": "{type} available in {location}. {amenities}Rent: {rent} FCFA/month, deposit {caution} months.",
"addGpsPosition": "Add my GPS position",
"progressRequired": "{count}/{total} required",
"publish": "Publish",
"publishing": "Publishing...",
"shareTitle": "Share your listing",
"shareWhatsapp": "WhatsApp",
"shareFacebook": "Facebook",
"shareCopyLink": "Copy link",
"shareCopied": "Link copied!",
"shareText": "{title} - {rent} FCFA/month. View on Piol: {url}",
"lockedByTemplate": "Set by template"
```

**Step 2: Add French keys**

Same position in `fr.json`:

```json
"templatePickerTitle": "Choisir un modèle",
"templatePickerSubtitle": "Choisissez un modèle pour démarrer rapidement",
"fromScratch": "Créer de zéro",
"fromScratchDesc": "Remplissez tous les détails vous-même",
"rentRangeHint": "Typique : {min} - {max} FCFA",
"blockPropertyType": "Type de logement",
"blockLocation": "Localisation",
"blockPricing": "Loyer et conditions",
"blockAmenities": "Équipements",
"blockPhotos": "Photos",
"blockDescription": "Description",
"blockLandmarks": "Repères",
"blockComplete": "Fait",
"blockRequired": "Requis",
"blockOptional": "Optionnel",
"blockRecommended": "Recommandé",
"blockAmenitiesCount": "{count} sélectionné(s)",
"blockPhotosCount": "{count} photos",
"totalEntry": "Total à l'entrée :",
"customAmount": "Personnalisé",
"useSuggestion": "Utiliser la suggestion",
"writeOwn": "Écrire moi-même",
"autoTitleHint": "Généré automatiquement à partir de vos détails",
"descriptionTemplate": "{type} disponible à {location}. {amenities}Loyer : {rent} FCFA/mois, caution {caution} mois.",
"addGpsPosition": "Ajouter ma position GPS",
"progressRequired": "{count}/{total} requis",
"publish": "Publier",
"publishing": "Publication...",
"shareTitle": "Partagez votre annonce",
"shareWhatsapp": "WhatsApp",
"shareFacebook": "Facebook",
"shareCopyLink": "Copier le lien",
"shareCopied": "Lien copié !",
"shareText": "{title} - {rent} FCFA/mois. Voir sur Piol : {url}",
"lockedByTemplate": "Défini par le modèle"
```

**Step 3: Verify JSON validity**
```bash
node -e "JSON.parse(require('fs').readFileSync('apps/web/src/i18n/locales/en.json'))"
node -e "JSON.parse(require('fs').readFileSync('apps/web/src/i18n/locales/fr.json'))"
```

---

## Task 3: Create Template Data

**Files:**
- Create: `apps/web/src/lib/data/property-templates.ts`

**Step 1: Write file**

```typescript
import type { AmenityId, City, PropertyType } from '@/lib/validations';

export interface PropertyTemplate {
  id: string;
  propertyType: PropertyType;
  city: City;
  rentRange: { min: number; max: number };
  defaultRent: number;
  defaultCautionMonths: number;
  defaultUpfrontMonths: number;
  defaultAmenities: AmenityId[];
}

export const PROPERTY_TEMPLATES: PropertyTemplate[] = [
  // Studios
  {
    id: 'studio-douala',
    propertyType: 'studio',
    city: 'Douala',
    rentRange: { min: 25000, max: 50000 },
    defaultRent: 35000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247'],
  },
  {
    id: 'studio-yaounde',
    propertyType: 'studio',
    city: 'Yaoundé',
    rentRange: { min: 25000, max: 50000 },
    defaultRent: 35000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247'],
  },
  {
    id: 'studio-buea',
    propertyType: 'studio',
    city: 'Buea',
    rentRange: { min: 20000, max: 40000 },
    defaultRent: 30000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247'],
  },
  // 1 Bedroom
  {
    id: '1br-douala',
    propertyType: '1br',
    city: 'Douala',
    rentRange: { min: 40000, max: 75000 },
    defaultRent: 50000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247'],
  },
  {
    id: '1br-yaounde',
    propertyType: '1br',
    city: 'Yaoundé',
    rentRange: { min: 40000, max: 75000 },
    defaultRent: 50000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247'],
  },
  // 2 Bedrooms
  {
    id: '2br-douala',
    propertyType: '2br',
    city: 'Douala',
    rentRange: { min: 60000, max: 120000 },
    defaultRent: 75000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking'],
  },
  {
    id: '2br-yaounde',
    propertyType: '2br',
    city: 'Yaoundé',
    rentRange: { min: 60000, max: 120000 },
    defaultRent: 75000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking'],
  },
  {
    id: '2br-bafoussam',
    propertyType: '2br',
    city: 'Bafoussam',
    rentRange: { min: 40000, max: 80000 },
    defaultRent: 50000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247'],
  },
  // 3 Bedrooms
  {
    id: '3br-douala',
    propertyType: '3br',
    city: 'Douala',
    rentRange: { min: 100000, max: 200000 },
    defaultRent: 150000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security'],
  },
  {
    id: '3br-yaounde',
    propertyType: '3br',
    city: 'Yaoundé',
    rentRange: { min: 100000, max: 200000 },
    defaultRent: 150000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security'],
  },
  // Apartments
  {
    id: 'apartment-douala',
    propertyType: 'apartment',
    city: 'Douala',
    rentRange: { min: 75000, max: 150000 },
    defaultRent: 100000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security'],
  },
  {
    id: 'apartment-yaounde',
    propertyType: 'apartment',
    city: 'Yaoundé',
    rentRange: { min: 75000, max: 150000 },
    defaultRent: 100000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security'],
  },
  // Houses
  {
    id: 'house-douala',
    propertyType: 'house',
    city: 'Douala',
    rentRange: { min: 100000, max: 250000 },
    defaultRent: 150000,
    defaultCautionMonths: 3,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security', 'garden'],
  },
  {
    id: 'house-yaounde',
    propertyType: 'house',
    city: 'Yaoundé',
    rentRange: { min: 100000, max: 250000 },
    defaultRent: 150000,
    defaultCautionMonths: 3,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security', 'garden'],
  },
  {
    id: 'house-buea',
    propertyType: 'house',
    city: 'Buea',
    rentRange: { min: 60000, max: 150000 },
    defaultRent: 100000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'garden'],
  },
  // Villas
  {
    id: 'villa-douala',
    propertyType: 'villa',
    city: 'Douala',
    rentRange: { min: 200000, max: 500000 },
    defaultRent: 300000,
    defaultCautionMonths: 3,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security', 'ac', 'garden', 'furnished'],
  },
  {
    id: 'villa-yaounde',
    propertyType: 'villa',
    city: 'Yaoundé',
    rentRange: { min: 200000, max: 500000 },
    defaultRent: 300000,
    defaultCautionMonths: 3,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security', 'ac', 'garden', 'furnished'],
  },
];

/** Get templates filtered by city */
export function getTemplatesByCity(city: City): PropertyTemplate[] {
  return PROPERTY_TEMPLATES.filter((t) => t.city === city);
}

/** Generate a title from form data */
export function generateTitle(
  propertyTypeName: string,
  city: string,
  neighborhood?: string
): string {
  if (!propertyTypeName || !city) return '';
  return neighborhood
    ? `${propertyTypeName} à ${neighborhood}, ${city}`
    : `${propertyTypeName} à ${city}`;
}

/** Format number with dot separators (Cameroon style) */
function formatCFA(n: number): string {
  return n.toLocaleString('fr-FR');
}

/** Generate template label: "Studio à Douala · 25k-50k" */
export function getTemplateLabel(
  template: PropertyTemplate,
  propertyTypeName: string
): string {
  return `${propertyTypeName} à ${template.city}`;
}

/** Format rent range for display */
export function formatRentRange(range: { min: number; max: number }): string {
  return `${formatCFA(range.min)} - ${formatCFA(range.max)}`;
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

---

## Task 4: Update Validation Helpers

**Files:**
- Modify: `apps/web/src/lib/validations/property.ts`

**Step 1: Add PROPERTY_BLOCK_FIELDS after PROPERTY_STEP_FIELDS (line 113)**

```typescript
/** Fields validated per block — used with form.trigger(). */
export const PROPERTY_BLOCK_FIELDS: Record<string, (keyof PropertyFormValues)[]> = {
  propertyType: ['propertyType'],
  location: ['city', 'neighborhood', 'addressLine1', 'latitude', 'longitude'],
  pricing: ['rentAmount', 'cautionMonths', 'upfrontMonths'],
  amenities: ['selectedAmenities'],
  photos: [], // managed separately
  description: ['title', 'description'],
  landmarks: ['landmarks'],
};
```

**Step 2: Export from index**

Add to `apps/web/src/lib/validations/index.ts` exports:
```typescript
export { PROPERTY_BLOCK_FIELDS } from './property';
```

**Step 3: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

**Step 4: Commit data layer**
```bash
git add -A
git commit -m "feat(web): add template data, i18n keys, and block validation helpers"
```

---

## Task 5: Property Type Block

**Files:**
- Create: `apps/web/src/components/properties/blocks/property-type-block.tsx`

**Step 1: Write file**

```tsx
'use client';

import { cn } from '@/lib/utils';
import type { PropertyFormInput, PropertyType } from '@/lib/validations';
import { Building2, Home, Lock } from 'lucide-react';
import { useTranslations } from 'gt-next';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { PROPERTY_TYPES } from '@/lib/validations';
import type { LucideIcon } from 'lucide-react';

const TYPE_ICONS: Record<PropertyType, LucideIcon> = {
  studio: Home,
  '1br': Home,
  '2br': Home,
  '3br': Home,
  '4br': Home,
  house: Home,
  apartment: Building2,
  villa: Building2,
};

interface PropertyTypeBlockProps {
  form: UseFormReturn<PropertyFormInput>;
  locked?: boolean;
}

export function PropertyTypeBlock({ form, locked }: PropertyTypeBlockProps) {
  const t = useTranslations();
  const selected = form.watch('propertyType');

  const types = useMemo(
    () =>
      PROPERTY_TYPES.map((value) => ({
        value,
        label: t(`propertyTypes.${value}`),
        icon: TYPE_ICONS[value],
      })),
    [t]
  );

  return (
    <div className="space-y-3 p-1">
      {locked && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Lock className="w-3 h-3" />
          {t('newProperty.lockedByTemplate')}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {types.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            disabled={locked}
            onClick={() => form.setValue('propertyType', value, { shouldValidate: true })}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border-2 transition-colors min-h-[80px]',
              selected === value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50',
              locked && 'opacity-60 cursor-not-allowed'
            )}
          >
            <Icon className="w-6 h-6 shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

---

## Task 6: Location Block

**Files:**
- Create: `apps/web/src/components/properties/blocks/location-block.tsx`

**Step 1: Write file**

```tsx
'use client';

import { LocationPicker } from '@/components/properties/location-picker-wrapper';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CITIES, type PropertyFormInput } from '@/lib/validations';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'gt-next';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface LocationBlockProps {
  form: UseFormReturn<PropertyFormInput>;
}

export function LocationBlock({ form }: LocationBlockProps) {
  const t = useTranslations();
  const [showGps, setShowGps] = useState(false);
  const selectedCity = form.watch('city');

  return (
    <div className="space-y-4 p-1">
      {/* City chips */}
      <div className="space-y-2">
        <FormLabel>{t('newProperty.city')}</FormLabel>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => form.setValue('city', city, { shouldValidate: true })}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                selectedCity === city
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {city}
            </button>
          ))}
        </div>
        {form.formState.errors.city && (
          <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
        )}
      </div>

      {/* Neighborhood */}
      <FormField
        control={form.control}
        name="neighborhood"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('newProperty.neighborhood')}</FormLabel>
            <FormControl>
              <Input placeholder={t('newProperty.neighborhoodPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address */}
      <FormField
        control={form.control}
        name="addressLine1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('newProperty.address')}</FormLabel>
            <FormControl>
              <Input placeholder={t('newProperty.addressPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* GPS toggle */}
      <button
        type="button"
        onClick={() => setShowGps(!showGps)}
        className="flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <MapPin className="w-4 h-4" />
        {t('newProperty.addGpsPosition')}
      </button>

      {showGps && (
        <LocationPicker
          latitude={form.watch('latitude')}
          longitude={form.watch('longitude')}
          city={form.watch('city')}
          onLocationChange={(lat, lng) => {
            form.setValue('latitude', lat, { shouldValidate: true });
            form.setValue('longitude', lng, { shouldValidate: true });
          }}
        />
      )}
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

---

## Task 7: Pricing Block

**Files:**
- Create: `apps/web/src/components/properties/blocks/pricing-block.tsx`

**Step 1: Write file**

```tsx
'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { PropertyFormInput } from '@/lib/validations';
import { useTranslations } from 'gt-next';
import { parseAppLocale } from '@/i18n/config';
import { formatNumber } from '@/lib/i18n-format';
import { useLocale } from 'gt-next/client';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

const RENT_PRESETS = [25000, 50000, 75000, 100000, 150000, 200000];

interface PricingBlockProps {
  form: UseFormReturn<PropertyFormInput>;
  rentRange?: { min: number; max: number };
}

export function PricingBlock({ form, rentRange }: PricingBlockProps) {
  const t = useTranslations();
  const locale = parseAppLocale(useLocale());
  const rentAmount = form.watch('rentAmount');
  const cautionMonths = form.watch('cautionMonths');
  const upfrontMonths = form.watch('upfrontMonths');

  const totalEntry = useMemo(() => {
    const rent = Number(rentAmount) || 0;
    const caution = Number(cautionMonths) || 0;
    const advance = Number(upfrontMonths) || 0;
    return rent * (caution + advance);
  }, [rentAmount, cautionMonths, upfrontMonths]);

  return (
    <div className="space-y-4 p-1">
      {/* Rent presets */}
      <div className="space-y-2">
        <FormLabel>{t('newProperty.monthlyRent')}</FormLabel>
        <div className="flex flex-wrap gap-2">
          {RENT_PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => form.setValue('rentAmount', amount.toString(), { shouldValidate: true })}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border transition-colors',
                Number(rentAmount) === amount
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {formatNumber(amount, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom rent input */}
      <FormField
        control={form.control}
        name="rentAmount"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                type="number"
                placeholder={t('newProperty.customAmount')}
                {...field}
              />
            </FormControl>
            {rentRange && (
              <p className="text-xs text-muted-foreground">
                {t('newProperty.rentRangeHint', {
                  min: formatNumber(rentRange.min, locale),
                  max: formatNumber(rentRange.max, locale),
                })}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Caution & Advance */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cautionMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('newProperty.cautionMonths')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {t('newProperty.months')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="upfrontMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('newProperty.advanceMonths')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 6, 12].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {t('newProperty.months')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Total calculator */}
      {totalEntry > 0 && (
        <div className="rounded-lg bg-muted p-3 flex justify-between items-center">
          <span className="text-sm font-medium">{t('newProperty.totalEntry')}</span>
          <span className="text-lg font-bold text-primary font-mono tabular-nums">
            {formatNumber(totalEntry, locale)} FCFA
          </span>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

---

## Task 8: Amenities Block

**Files:**
- Create: `apps/web/src/components/properties/blocks/amenities-block.tsx`

**Step 1: Write file**

```tsx
'use client';

import { cn } from '@/lib/utils';
import type { AmenityId, PropertyFormInput } from '@/lib/validations';
import {
  Armchair,
  Car,
  Droplet,
  Shield,
  Sun,
  TreePine,
  Wifi,
  Wind,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'gt-next';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface AmenitiesBlockProps {
  form: UseFormReturn<PropertyFormInput>;
}

export function AmenitiesBlock({ form }: AmenitiesBlockProps) {
  const t = useTranslations();
  const selected = form.watch('selectedAmenities') ?? [];

  const amenities = useMemo(
    () =>
      [
        { id: 'wifi' as const, label: t('amenities.wifi'), icon: Wifi },
        { id: 'parking' as const, label: t('amenities.parking'), icon: Car },
        { id: 'ac' as const, label: t('amenities.ac'), icon: Wind },
        { id: 'security' as const, label: t('amenities.security'), icon: Shield },
        { id: 'water247' as const, label: t('amenities.water247'), icon: Droplet },
        { id: 'electricity247' as const, label: t('amenities.electricity247'), icon: Zap },
        { id: 'furnished' as const, label: t('amenities.furnished'), icon: Armchair },
        { id: 'balcony' as const, label: t('amenities.balcony'), icon: Sun },
        { id: 'garden' as const, label: t('amenities.garden'), icon: TreePine },
      ],
    [t]
  );

  const toggleAmenity = (id: AmenityId) => {
    const current = form.getValues('selectedAmenities') ?? [];
    if (current.includes(id)) {
      form.setValue('selectedAmenities', current.filter((a) => a !== id));
    } else {
      form.setValue('selectedAmenities', [...current, id]);
    }
  };

  return (
    <div className="p-1">
      <div className="grid grid-cols-3 gap-3">
        {amenities.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => toggleAmenity(id)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors min-h-[72px]',
              selected.includes(id)
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

---

## Task 9: Photos Block

**Files:**
- Create: `apps/web/src/components/properties/blocks/photos-block.tsx`

**Step 1: Write file**

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { Camera, ImagePlus, X } from 'lucide-react';
import { useTranslations } from 'gt-next';
import { useCallback } from 'react';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface PhotosBlockProps {
  images: File[];
  onAddImages: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
}

export function PhotosBlock({ images, onAddImages, onRemoveImage }: PhotosBlockProps) {
  const t = useTranslations();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onAddImages(e.target.files);
        e.target.value = '';
      }
    },
    [onAddImages]
  );

  return (
    <div className="space-y-4 p-1">
      {/* Upload buttons */}
      <div className="flex gap-3">
        <input
          type="file"
          multiple
          accept="image/*"
          capture="environment"
          className="hidden"
          id="photos-camera"
          onChange={handleFileChange}
        />
        <label htmlFor="photos-camera" className="flex-1">
          <Button variant="default" className="w-full" asChild>
            <span className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              {t('newProperty.selectPhotos')}
            </span>
          </Button>
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          id="photos-gallery"
          onChange={handleFileChange}
        />
        <label htmlFor="photos-gallery">
          <Button variant="outline" asChild>
            <span className="flex items-center gap-2">
              <ImagePlus className="w-4 h-4" />
            </span>
          </Button>
        </label>
      </div>

      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="text-[10px] text-muted-foreground mt-1 truncate">
                {formatFileSize(file.size)}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">{t('newProperty.photosHint')}</p>
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

---

## Task 10: Description Block

**Files:**
- Create: `apps/web/src/components/properties/blocks/description-block.tsx`

**Step 1: Write file**

```tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { PropertyFormInput } from '@/lib/validations';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'gt-next';
import type { UseFormReturn } from 'react-hook-form';

interface DescriptionBlockProps {
  form: UseFormReturn<PropertyFormInput>;
  suggestedTitle: string;
  suggestedDescription: string;
}

export function DescriptionBlock({
  form,
  suggestedTitle,
  suggestedDescription,
}: DescriptionBlockProps) {
  const t = useTranslations();

  const applyTitleSuggestion = () => {
    if (suggestedTitle) {
      form.setValue('title', suggestedTitle, { shouldValidate: true });
    }
  };

  const applyDescriptionSuggestion = () => {
    if (suggestedDescription) {
      form.setValue('description', suggestedDescription, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-4 p-1">
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>{t('newProperty.listingTitle')}</FormLabel>
              {suggestedTitle && field.value !== suggestedTitle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1"
                  onClick={applyTitleSuggestion}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t('newProperty.useSuggestion')}
                </Button>
              )}
            </div>
            <FormControl>
              <Input placeholder={t('newProperty.listingTitlePlaceholder')} {...field} />
            </FormControl>
            <p className="text-xs text-muted-foreground">{t('newProperty.autoTitleHint')}</p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>{t('newProperty.description')}</FormLabel>
              {suggestedDescription && field.value !== suggestedDescription && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1"
                  onClick={applyDescriptionSuggestion}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t('newProperty.useSuggestion')}
                </Button>
              )}
            </div>
            <FormControl>
              <Textarea
                placeholder={t('newProperty.descriptionPlaceholder')}
                className="min-h-[120px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

---

## Task 11: Landmarks Block

**Files:**
- Create: `apps/web/src/components/properties/blocks/landmarks-block.tsx`

**Step 1: Write file**

```tsx
'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { PropertyFormInput } from '@/lib/validations';
import { useTranslations } from 'gt-next';
import type { UseFormReturn } from 'react-hook-form';

interface LandmarksBlockProps {
  form: UseFormReturn<PropertyFormInput>;
}

export function LandmarksBlock({ form }: LandmarksBlockProps) {
  const t = useTranslations();

  return (
    <div className="p-1">
      <FormField
        control={form.control}
        name="landmarks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('newProperty.landmarks')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('newProperty.landmarksPlaceholder')}
                className="min-h-[80px] resize-none"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">{t('newProperty.landmarksHint')}</p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

**Step 3: Commit all block components**
```bash
git add apps/web/src/components/properties/blocks/
git commit -m "feat(web): add 7 block components for property creation form"
```

---

## Task 12: Block Form Orchestrator

**Files:**
- Create: `apps/web/src/components/properties/block-form.tsx`

**Step 1: Write file**

```tsx
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { PropertyTypeBlock } from './blocks/property-type-block';
import { LocationBlock } from './blocks/location-block';
import { PricingBlock } from './blocks/pricing-block';
import { AmenitiesBlock } from './blocks/amenities-block';
import { PhotosBlock } from './blocks/photos-block';
import { DescriptionBlock } from './blocks/description-block';
import { LandmarksBlock } from './blocks/landmarks-block';
import { generateTitle, type PropertyTemplate, formatRentRange } from '@/lib/data/property-templates';
import { cn } from '@/lib/utils';
import {
  type AmenityId,
  type PropertyFormInput,
  type PropertyFormValues,
  type PropertyType,
  createPropertySchema,
} from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useTranslations } from 'gt-next';
import { parseAppLocale } from '@/i18n/config';
import { formatNumber } from '@/lib/i18n-format';
import { useLocale } from 'gt-next/client';
import {
  Building2,
  Camera,
  Check,
  FileText,
  Home,
  Loader2,
  MapPin,
  Navigation,
  Tag,
  Wallet,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';

interface BlockConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  required: boolean;
  desktopColumn: 1 | 2;
  desktopRow: number;
  fullWidth?: boolean;
}

interface BlockFormProps {
  template: PropertyTemplate | null;
  onSuccess: (propertyId: Id<'properties'>) => void;
}

export function BlockForm({ template, onSuccess }: BlockFormProps) {
  const t = useTranslations();
  const locale = parseAppLocale(useLocale());

  const blocks: BlockConfig[] = useMemo(
    () => [
      { id: 'propertyType', label: t('newProperty.blockPropertyType'), icon: Home, required: true, desktopColumn: 1, desktopRow: 1 },
      { id: 'location', label: t('newProperty.blockLocation'), icon: MapPin, required: true, desktopColumn: 1, desktopRow: 2 },
      { id: 'pricing', label: t('newProperty.blockPricing'), icon: Wallet, required: true, desktopColumn: 2, desktopRow: 1 },
      { id: 'amenities', label: t('newProperty.blockAmenities'), icon: Tag, required: false, desktopColumn: 2, desktopRow: 2 },
      { id: 'photos', label: t('newProperty.blockPhotos'), icon: Camera, required: false, desktopColumn: 2, desktopRow: 3 },
      { id: 'description', label: t('newProperty.blockDescription'), icon: FileText, required: false, desktopColumn: 1, desktopRow: 4, fullWidth: true },
      { id: 'landmarks', label: t('newProperty.blockLandmarks'), icon: Navigation, required: false, desktopColumn: 1, desktopRow: 3 },
    ],
    [t]
  );

  // Form setup
  const schema = useMemo(() => createPropertySchema(t), [t]);

  const getDefaults = useCallback((): PropertyFormInput => {
    if (template) {
      const typeName = t(`propertyTypes.${template.propertyType}`);
      return {
        title: generateTitle(typeName, template.city),
        description: '',
        propertyType: template.propertyType,
        city: template.city,
        neighborhood: '',
        addressLine1: '',
        latitude: '',
        longitude: '',
        landmarks: '',
        rentAmount: template.defaultRent.toString(),
        cautionMonths: template.defaultCautionMonths.toString(),
        upfrontMonths: template.defaultUpfrontMonths.toString(),
        selectedAmenities: [...template.defaultAmenities],
      };
    }
    return {
      title: '',
      description: '',
      propertyType: undefined as unknown as PropertyFormValues['propertyType'],
      city: undefined as unknown as PropertyFormValues['city'],
      neighborhood: '',
      addressLine1: '',
      latitude: '',
      longitude: '',
      landmarks: '',
      rentAmount: '',
      cautionMonths: '2',
      upfrontMonths: '6',
      selectedAmenities: [],
    };
  }, [template, t]);

  const form = useForm<PropertyFormInput, unknown, PropertyFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: getDefaults(),
  });

  // Image state
  const [images, setImages] = useState<File[]>([]);
  const addImages = useCallback((files: FileList) => {
    setImages((prev) => [...prev, ...Array.from(files)]);
  }, []);
  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Accordion state
  const [openBlocks, setOpenBlocks] = useState<string[]>(
    template ? ['location'] : ['propertyType']
  );
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handleValueChange = (value: string[]) => {
    if (!isDesktop && value.length > openBlocks.length) {
      const newBlock = value.find((v) => !openBlocks.includes(v));
      setOpenBlocks(newBlock ? [newBlock] : []);
    } else {
      setOpenBlocks(value);
    }
  };

  // Auto-generate title
  const propertyType = form.watch('propertyType');
  const city = form.watch('city');
  const neighborhood = form.watch('neighborhood');
  const lastGeneratedTitle = useRef<string>('');

  useEffect(() => {
    if (!propertyType || !city) return;
    const typeName = t(`propertyTypes.${propertyType}`);
    const generated = generateTitle(typeName, city, neighborhood || undefined);
    const currentTitle = form.getValues('title');

    if (!currentTitle || currentTitle === lastGeneratedTitle.current) {
      form.setValue('title', generated);
      lastGeneratedTitle.current = generated;
    }
  }, [propertyType, city, neighborhood, t, form]);

  // Generate description suggestion
  const watchedFields = form.watch();
  const selectedAmenities = watchedFields.selectedAmenities ?? [];
  const amenityNames = useMemo(() => {
    const map: Record<string, string> = {
      wifi: t('amenities.wifi'),
      parking: t('amenities.parking'),
      ac: t('amenities.ac'),
      security: t('amenities.security'),
      water247: t('amenities.water247'),
      electricity247: t('amenities.electricity247'),
      furnished: t('amenities.furnished'),
      balcony: t('amenities.balcony'),
      garden: t('amenities.garden'),
    };
    return selectedAmenities.map((id) => map[id]).filter(Boolean);
  }, [selectedAmenities, t]);

  const suggestedTitle = useMemo(() => {
    if (!propertyType || !city) return '';
    const typeName = t(`propertyTypes.${propertyType}`);
    return generateTitle(typeName, city, neighborhood || undefined);
  }, [propertyType, city, neighborhood, t]);

  const suggestedDescription = useMemo(() => {
    if (!propertyType || !city) return '';
    const typeName = t(`propertyTypes.${propertyType}`);
    const location = neighborhood ? `${neighborhood}, ${city}` : city;
    const amenityText = amenityNames.length > 0 ? `${amenityNames.join(', ')}. ` : '';
    const rent = watchedFields.rentAmount ? formatNumber(Number(watchedFields.rentAmount), locale) : '';
    return t('newProperty.descriptionTemplate', {
      type: typeName,
      location,
      amenities: amenityText,
      rent: rent || '...',
      caution: watchedFields.cautionMonths || '2',
    });
  }, [propertyType, city, neighborhood, amenityNames, watchedFields.rentAmount, watchedFields.cautionMonths, t, locale]);

  // Completion tracking
  const blockCompletion = useMemo(
    () => ({
      propertyType: !!watchedFields.propertyType,
      location: !!watchedFields.city,
      pricing: !!watchedFields.rentAmount && Number(watchedFields.rentAmount) > 0,
      amenities: true,
      photos: true,
      description: true,
      landmarks: true,
    }),
    [watchedFields.propertyType, watchedFields.city, watchedFields.rentAmount]
  );

  const requiredComplete = [
    blockCompletion.propertyType,
    blockCompletion.location,
    blockCompletion.pricing,
  ].filter(Boolean).length;

  // Submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProperty = useMutation(api.properties.createProperty);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addPropertyImages = useMutation(api.properties.addPropertyImages);

  const uploadImages = async (propertyId: Id<'properties'>, files: File[]) => {
    const uploaded = [];
    for (const [index, file] of files.entries()) {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });
      if (!response.ok) throw new Error('Upload failed');
      const { storageId } = (await response.json()) as { storageId: Id<'_storage'> };
      uploaded.push({ storageId, order: index });
    }
    if (uploaded.length > 0) {
      await addPropertyImages({ propertyId, images: uploaded });
    }
  };

  const handleSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error(t('newProperty.errorCreate'));
      return;
    }

    setIsSubmitting(true);
    try {
      const data = form.getValues();
      const hasLat = (data.latitude ?? '').trim().length > 0;
      const hasLng = (data.longitude ?? '').trim().length > 0;
      const lat = Number(data.latitude);
      const lng = Number(data.longitude);
      const location =
        hasLat && hasLng && Number.isFinite(lat) && Number.isFinite(lng)
          ? { latitude: lat, longitude: lng }
          : undefined;

      const amenities: Record<string, boolean> = {};
      for (const id of ['wifi', 'parking', 'ac', 'security', 'water247', 'electricity247', 'furnished', 'balcony', 'garden']) {
        amenities[id] = (data.selectedAmenities ?? []).includes(id as AmenityId);
      }

      const propertyId = await createProperty({
        title: data.title,
        description: data.description || undefined,
        propertyType: data.propertyType as PropertyType,
        city: data.city,
        neighborhood: data.neighborhood || undefined,
        addressLine1: data.addressLine1 || undefined,
        landmarks: data.landmarks || undefined,
        rentAmount: Number(data.rentAmount),
        cautionMonths: Number(data.cautionMonths),
        upfrontMonths: Number(data.upfrontMonths),
        amenities,
        location,
      });

      if (images.length > 0) {
        try {
          await uploadImages(propertyId, images);
        } catch {
          toast.error(t('newProperty.errorImageUpload'));
        }
      }

      onSuccess(propertyId);
    } catch {
      toast.error(t('newProperty.errorCreate'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Block status helper
  const getBlockStatus = (block: BlockConfig) => {
    const complete = blockCompletion[block.id as keyof typeof blockCompletion];
    if (complete && block.required) return 'complete';
    if (!complete && block.required) return 'required';
    if (block.id === 'photos') return images.length > 0 ? 'complete' : 'recommended';
    return complete ? 'complete' : 'optional';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <Badge variant="default" className="bg-success text-success-foreground text-xs">
            <Check className="w-3 h-3 mr-0.5" />
            {t('newProperty.blockComplete')}
          </Badge>
        );
      case 'required':
        return (
          <Badge variant="destructive" className="text-xs">
            {t('newProperty.blockRequired')}
          </Badge>
        );
      case 'recommended':
        return (
          <Badge variant="secondary" className="text-xs">
            {t('newProperty.blockRecommended')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {t('newProperty.blockOptional')}
          </Badge>
        );
    }
  };

  // Collapsed summary for amenities & photos
  const getBlockSummary = (blockId: string) => {
    if (blockId === 'amenities' && selectedAmenities.length > 0) {
      return t('newProperty.blockAmenitiesCount', { count: selectedAmenities.length });
    }
    if (blockId === 'photos' && images.length > 0) {
      return t('newProperty.blockPhotosCount', { count: images.length });
    }
    return null;
  };

  const renderBlockContent = (blockId: string) => {
    switch (blockId) {
      case 'propertyType':
        return <PropertyTypeBlock form={form} locked={!!template} />;
      case 'location':
        return <LocationBlock form={form} />;
      case 'pricing':
        return <PricingBlock form={form} rentRange={template?.rentRange} />;
      case 'amenities':
        return <AmenitiesBlock form={form} />;
      case 'photos':
        return <PhotosBlock images={images} onAddImages={addImages} onRemoveImage={removeImage} />;
      case 'description':
        return (
          <DescriptionBlock
            form={form}
            suggestedTitle={suggestedTitle}
            suggestedDescription={suggestedDescription}
          />
        );
      case 'landmarks':
        return <LandmarksBlock form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <Form {...form}>
        <Accordion
          type="multiple"
          value={openBlocks}
          onValueChange={handleValueChange}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        >
          {blocks.map((block) => {
            const status = getBlockStatus(block);
            const summary = getBlockSummary(block.id);
            const Icon = block.icon;
            return (
              <AccordionItem
                key={block.id}
                value={block.id}
                className={cn(
                  'border rounded-xl bg-card px-4',
                  block.fullWidth && 'lg:col-span-2',
                  !block.fullWidth && block.desktopColumn === 1 && 'lg:col-start-1',
                  !block.fullWidth && block.desktopColumn === 2 && 'lg:col-start-2',
                )}
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-sm">{block.label}</span>
                    {summary && (
                      <span className="text-xs text-muted-foreground">{summary}</span>
                    )}
                    <div className="ml-auto mr-2">{getStatusBadge(status)}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  {renderBlockContent(block.id)}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Form>

      {/* Sticky bottom bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4 mt-4 flex items-center justify-between gap-4 z-10">
        <span className="text-sm text-muted-foreground">
          {t('newProperty.progressRequired', { count: requiredComplete, total: 3 })}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {t('newProperty.saveDraft')}
          </Button>
          <Button
            disabled={requiredComplete < 3 || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSubmitting ? t('newProperty.publishing') : t('newProperty.publish')}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

---

## Task 13: Template Picker

**Files:**
- Create: `apps/web/src/components/properties/template-picker.tsx`

**Step 1: Write file**

```tsx
'use client';

import { Card } from '@/components/ui/card';
import {
  PROPERTY_TEMPLATES,
  formatRentRange,
  getTemplateLabel,
  type PropertyTemplate,
} from '@/lib/data/property-templates';
import { cn } from '@/lib/utils';
import { Building2, Home, Plus } from 'lucide-react';
import { useTranslations } from 'gt-next';
import { useMemo } from 'react';
import type { PropertyType } from '@/lib/validations';
import type { LucideIcon } from 'lucide-react';

const TYPE_ICONS: Record<PropertyType, LucideIcon> = {
  studio: Home,
  '1br': Home,
  '2br': Home,
  '3br': Home,
  '4br': Home,
  house: Home,
  apartment: Building2,
  villa: Building2,
};

interface TemplatePickerProps {
  onSelect: (template: PropertyTemplate | null) => void;
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
  const t = useTranslations();

  const templates = useMemo(
    () =>
      PROPERTY_TEMPLATES.map((tmpl) => ({
        ...tmpl,
        label: getTemplateLabel(tmpl, t(`propertyTypes.${tmpl.propertyType}`)),
        rentRangeLabel: formatRentRange(tmpl.rentRange),
        icon: TYPE_ICONS[tmpl.propertyType],
      })),
    [t]
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('newProperty.templatePickerTitle')}</h2>
        <p className="text-muted-foreground">{t('newProperty.templatePickerSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map((tmpl) => {
          const Icon = tmpl.icon;
          return (
            <Card
              key={tmpl.id}
              className={cn(
                'p-4 cursor-pointer hover:border-primary/50 transition-colors',
                'flex items-start gap-3'
              )}
              onClick={() => onSelect(tmpl)}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm">{tmpl.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tmpl.rentRangeLabel} FCFA
                </p>
              </div>
            </Card>
          );
        })}

        {/* From scratch */}
        <Card
          className={cn(
            'p-4 cursor-pointer hover:border-primary/50 transition-colors',
            'flex items-start gap-3 border-dashed'
          )}
          onClick={() => onSelect(null)}
        >
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm">{t('newProperty.fromScratch')}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('newProperty.fromScratchDesc')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

**Step 3: Commit orchestrator + picker**
```bash
git add apps/web/src/components/properties/block-form.tsx apps/web/src/components/properties/template-picker.tsx
git commit -m "feat(web): add block form orchestrator and template picker"
```

---

## Task 14: Page Rewrite

**Files:**
- Modify: `apps/web/src/app/dashboard/properties/new/page.tsx`

**Step 1: Replace entire file**

```tsx
'use client';

import { BlockForm } from '@/components/properties/block-form';
import { ShareButtons } from '@/components/properties/share-buttons';
import { TemplatePicker } from '@/components/properties/template-picker';
import { Button } from '@/components/ui/button';
import type { PropertyTemplate } from '@/lib/data/property-templates';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useTranslations } from 'gt-next';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function NewPropertyPage() {
  const t = useTranslations();
  const router = useRouter();

  const [selectedTemplate, setSelectedTemplate] = useState<PropertyTemplate | null | undefined>(
    undefined
  );
  const [createdPropertyId, setCreatedPropertyId] = useState<Id<'properties'> | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-redirect on success
  useEffect(() => {
    if (createdPropertyId) {
      redirectTimerRef.current = setTimeout(() => {
        router.push('/dashboard/properties');
      }, 10000);
    }
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [createdPropertyId, router]);

  // Success state
  if (createdPropertyId) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-success" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('newProperty.successTitle')}</h1>
          <p className="text-muted-foreground mt-2">{t('newProperty.successDesc')}</p>
        </div>

        <ShareButtons propertyId={createdPropertyId} />

        <div className="flex justify-center gap-3">
          <Link href={`/dashboard/properties/${createdPropertyId}`}>
            <Button>{t('newProperty.submitForVerification')}</Button>
          </Link>
          <Link href="/dashboard/properties">
            <Button variant="outline">{t('newProperty.backToProperties')}</Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">{t('newProperty.autoRedirect')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties" className="text-muted-foreground hover:text-foreground">
          {t('newProperty.back')}
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{t('newProperty.title')}</h1>
      </div>

      {/* Template picker or block form */}
      {selectedTemplate === undefined ? (
        <TemplatePicker
          onSelect={(tmpl) => setSelectedTemplate(tmpl)}
        />
      ) : (
        <BlockForm
          template={selectedTemplate}
          onSuccess={(id) => setCreatedPropertyId(id)}
        />
      )}
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

> Note: This will fail until ShareButtons is created in Task 15. If needed, temporarily comment out the ShareButtons import/usage, or proceed to Task 15 first.

---

## Task 15: Share Buttons

**Files:**
- Create: `apps/web/src/components/properties/share-buttons.tsx`

**Step 1: Write file**

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { Copy, Facebook, MessageCircle } from 'lucide-react';
import { useTranslations } from 'gt-next';
import { toast } from 'sonner';
import { useCallback } from 'react';

interface ShareButtonsProps {
  propertyId: string;
  title?: string;
  rent?: number;
  className?: string;
}

export function ShareButtons({ propertyId, title, rent, className }: ShareButtonsProps) {
  const t = useTranslations();

  const propertyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${propertyId}`;

  const shareText = title
    ? t('newProperty.shareText', {
        title,
        rent: rent ? rent.toLocaleString('fr-FR') : '...',
        url: propertyUrl,
      })
    : propertyUrl;

  const handleWhatsApp = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title, text: shareText, url: propertyUrl }).catch(() => {});
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareText)}`,
        '_blank',
        'noopener'
      );
    }
  }, [title, shareText, propertyUrl]);

  const handleFacebook = useCallback(() => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
      '_blank',
      'noopener,width=600,height=400'
    );
  }, [propertyUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success(t('newProperty.shareCopied'));
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(t('newProperty.shareCopied'));
    }
  }, [shareText, t]);

  return (
    <div className={className}>
      <p className="text-sm font-medium mb-3">{t('newProperty.shareTitle')}</p>
      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="sm" onClick={handleWhatsApp}>
          <MessageCircle className="w-4 h-4 mr-2" />
          {t('newProperty.shareWhatsapp')}
        </Button>
        <Button variant="outline" size="sm" onClick={handleFacebook}>
          <Facebook className="w-4 h-4 mr-2" />
          {t('newProperty.shareFacebook')}
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          <Copy className="w-4 h-4 mr-2" />
          {t('newProperty.shareCopyLink')}
        </Button>
      </div>
    </div>
  );
}
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

**Step 3: Commit page rewrite + share**
```bash
git add -A
git commit -m "feat(web): rewrite property creation with bloc-a-bloc flow and share buttons"
```

---

## Task 16: Property Detail Share Integration

**Files:**
- Modify: `apps/web/src/app/properties/[id]/page.tsx`

**Step 1: Add import at top of file**

```typescript
import { ShareButtons } from '@/components/properties/share-buttons';
```

**Step 2: Replace the non-functional share button (lines 464-467)**

Replace:
```tsx
<Button variant="outline" size="sm" className="flex items-center gap-2 border-border">
  <Share2 className="w-4 h-4" />
  <span>Partager</span>
</Button>
```

With:
```tsx
<ShareButtons
  propertyId={property._id}
  title={property.title}
  rent={property.rentAmount}
  className="inline-flex"
/>
```

> Note: This is a minimal integration. The ShareButtons component renders multiple buttons, so you may need to adjust the layout. An alternative is to keep a single "Partager" button that opens a popover with the ShareButtons. Use judgment based on the surrounding layout.

**Step 3: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

**Step 4: Commit**
```bash
git add apps/web/src/app/properties/[id]/page.tsx
git commit -m "feat(web): add share buttons to property detail page"
```

---

## Task 17: Final Verification

**Step 1: Lint fix**
```bash
bunx biome check --write .
```

**Step 2: Typecheck**
```bash
cd apps/web && bunx tsc --noEmit
```

**Step 3: Visual testing checklist**

Start dev server: `bun run dev`

1. Navigate to `/dashboard/properties/new` — see template grid
2. Pick a template — verify blocks pre-filled, title auto-generated
3. Mobile (375px): single-column accordion, one block at a time, sticky bottom bar
4. Desktop (1024px+): 2-column grid, multiple blocks expandable
5. "Creer de zero": verify empty form, title generates when type + city selected
6. Fill required blocks, verify progress bar and "Publish" button enables
7. Submit — verify success screen with share buttons
8. WhatsApp/Facebook/Copy buttons work
9. Upload photos, verify they appear in grid
10. Check property detail page share button works

**Step 4: Final commit if any lint/format changes**
```bash
git add -A
git commit -m "chore(web): lint and format bloc-a-bloc property creation"
```

---

## Follow-up Tasks (Out of Scope)

1. **OG Meta Tags**: Requires splitting `apps/web/src/app/properties/[id]/page.tsx` into server component (for `generateMetadata`) + client component. Needs server-side Convex data fetching.
2. **Desktop Live Preview Sidebar**: Add a fixed 300px right sidebar using the existing `PropertyCard` component with live form data. Purely additive.
3. **Drag-to-reorder Photos**: Add `@dnd-kit/sortable` for photo reordering in the photos block.
4. **Draft Auto-save**: Periodically save form state to `localStorage` and restore on page load.
