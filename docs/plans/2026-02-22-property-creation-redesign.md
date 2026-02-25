# Property Creation Redesign: Bloc-a-Bloc + Template Quick-Start

**Date:** 2026-02-22
**Status:** Approved

## Problem

The current 798-line monolithic 3-step wizard overwhelms landlords. Too many fields per step, no guidance on title/description, confusing location picker. 80%+ of users are on mobile.

## Solution

Template Picker -> Pre-filled Block Form -> Publish -> Share

### Flow

1. **Template Picker**: Grid of ~15-20 template cards (e.g., "Studio a Douala 25-50k"). Landlord taps one. "Creer de zero" option for blank form.
2. **Block Form**: 7 collapsible card blocks, each focused on one topic. Pre-filled from template. Accordion behavior on mobile, multi-expand on desktop. Progress bar + sticky submit.
3. **Success Screen**: Confirmation + WhatsApp/Facebook/Copy share buttons.

### The 7 Blocks

| # | Block | Required | Pre-filled |
|---|-------|----------|------------|
| 1 | Type de logement | Yes | Locked from template |
| 2 | Localisation | City: Yes | City pre-filled |
| 3 | Loyer et conditions | Yes | Rent range + defaults |
| 4 | Equipements | No | Common defaults |
| 5 | Photos | No (recommended) | Empty |
| 6 | Description | No | Title + description auto-generated |
| 7 | Reperes | No | Empty |

### Key Design Decisions

- **Title pre-fills on template select** and updates live as blocks change (e.g., "{type} a {neighborhood}, {city}")
- **Description pre-fills** from template with placeholders resolved
- **Accordion on mobile** (one block at a time), **multi-expand on desktop**
- **Desktop**: 2-column card grid + 300px fixed right sidebar with live PropertyCard preview
- **Mobile**: Single column, 56px collapsed cards, 44px+ touch targets, sticky bottom bar
- **Smart suggestions (zero AI cost)**: Template string interpolation only

### Mobile Layout (375px)

- Cards stacked vertically, 12px gap
- Collapsed card: 56px (icon + label + status badge)
- One card expanded at a time
- Sticky bottom bar: progress ("3/3 requis") + "Publier" button
- Property type tiles: 2-column grid, 80px+
- Amenity toggles: 3-column grid

### Desktop Layout (1024px+)

- 2-column card grid (left: Type, Location, Landmarks; right: Pricing, Amenities, Photos)
- Description spans full width at bottom
- Fixed right sidebar (300px): live PropertyCard preview
- Multiple blocks expandable simultaneously
- Progress bar in sticky top header

### Template Data Structure

```typescript
type PropertyTemplate = {
  id: string;
  label: string;
  propertyType: PropertyType;
  city: City;
  rentRange: { min: number; max: number };
  defaultRent: number;
  defaultCautionMonths: number;
  defaultUpfrontMonths: number;
  defaultAmenities: AmenityId[];
  descriptionTemplate: string;
  titleTemplate: string;
};
```

### Social Sharing

- WhatsApp: `navigator.share()` with fallback to `https://wa.me/?text=...`
- Facebook: Share dialog
- Copy link: Formatted text with Piol link

## Codebase Validation

- **No backend changes needed**: createProperty mutation accepts all fields
- **PropertyCard component exists**: Reusable for desktop preview (vertical/horizontal variants)
- **LocationPicker exists**: Ready to embed in Location block
- **Accordion not installed**: Need `bunx --bun shadcn@latest add accordion`
- **~30 new i18n keys needed**: Template picker, block labels, share buttons, calculator
- **Zod schema reusable**: Same validation, restructured by block

## Files to Create

- `apps/web/src/lib/data/property-templates.ts` - Template definitions
- `apps/web/src/components/properties/template-picker.tsx` - Template grid
- `apps/web/src/components/properties/blocks/property-type-block.tsx`
- `apps/web/src/components/properties/blocks/location-block.tsx`
- `apps/web/src/components/properties/blocks/pricing-block.tsx`
- `apps/web/src/components/properties/blocks/amenities-block.tsx`
- `apps/web/src/components/properties/blocks/photos-block.tsx`
- `apps/web/src/components/properties/blocks/description-block.tsx`
- `apps/web/src/components/properties/blocks/landmarks-block.tsx`
- `apps/web/src/components/properties/block-form.tsx` - Orchestrator
- `apps/web/src/components/properties/share-buttons.tsx`

## Files to Modify

- `apps/web/src/app/dashboard/properties/new/page.tsx` - Replace monolith
- `apps/web/src/lib/validations/property.ts` - Per-block validation helpers
- `apps/web/src/app/properties/[id]/page.tsx` - Add share buttons + OG meta
- `apps/web/src/i18n/locales/en.json` - New keys
- `apps/web/src/i18n/locales/fr.json` - New keys
