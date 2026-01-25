---
name: piol-design-system
description: Piol housing marketplace design system. Use for all UI work, component creation, styling.
---

# Piol Design System

Piol is a Cameroon housing marketplace. UI should feel modern, trustworthy, and accessible to both urban renters and property owners.

## Design Philosophy
- **Trust**: Clean layouts, clear information hierarchy
- **Local relevance**: Support for mobile-first (most users on phones)
- **Accessibility**: Works for all literacy levels

## AVOID These Defaults (Distributional Convergence)
Claude tends toward these - actively choose differently:
- ❌ Purple gradients → Use Piol brand colors
- ❌ Inter font → Use distinctive typography
- ❌ Minimal/flat everything → Add depth, shadows, micro-interactions
- ❌ Generic hero sections → Contextualize for housing/Cameroon

## Typography
Use fonts that feel trustworthy but modern:
- Headlines: Bold, clear hierarchy
- Body: Readable on mobile screens
- Never default to system fonts without intention

## Color System (Design Tokens)
Reference `apps/web/src/app/globals.css`:
```css
--primary       /* Brand color - main actions */
--secondary     /* Supporting elements */
--destructive   /* Errors, delete, warnings */
--muted         /* Disabled, subtle text */
--accent        /* Highlights, badges */
--background    /* Page backgrounds */
--foreground    /* Primary text */
--card          /* Card backgrounds */
--border        /* Borders, dividers */
```

**Rules:**
- NEVER use hex codes directly (`#FF385C`)
- ALWAYS use tokens: `bg-primary`, `text-muted-foreground`
- For new colors, add to CSS variables first

## Component Library (shadcn/ui)
Check existing before creating:
```bash
ls apps/web/src/components/ui/
```

Install new components:
```bash
bunx --bun shadcn@latest add <component-name>
```

### Component Patterns
| Need | Component | Notes |
|------|-----------|-------|
| Primary actions | `<Button>` | default variant |
| Dangerous actions | `<Button variant="destructive">` | confirmations required |
| Property cards | `<Card>` with image, price, location | |
| Forms | `<Form>` + `<FormField>` | with validation feedback |
| Mobile nav | `<Sheet>` | slides from bottom |
| Modals | `<Dialog>` | centered, backdrop blur |
| Loading | `<Skeleton>` | match content shapes |
| Notifications | `<Toast>` | via sonner |

## Motion & Interactions
Add life, don't be flat:
- Hover states on interactive elements
- Smooth transitions (150-300ms)
- Loading skeletons that shimmer
- Subtle scale on card hover (1.02)
- Use Tailwind: `transition-all duration-200`

## Backgrounds & Depth
- Cards should have subtle shadows
- Use `bg-muted/50` for section backgrounds
- Consider subtle gradients for hero sections
- Property images need proper aspect ratios (4:3 or 16:9)

## Responsive Design
Mobile-first (most Piol users on phones):
```
sm:  640px   /* Larger phones */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
```

## i18n
No hardcoded strings - all user-facing text through i18n:
```typescript
const { t } = useTranslation();
<p>{t('property.price')}</p>
```

## Checklist Before Committing UI
- [ ] Used existing shadcn component (or installed new one)
- [ ] No hardcoded colors - all tokens
- [ ] No hardcoded strings - all i18n
- [ ] Responsive at all breakpoints
- [ ] Loading states exist
- [ ] Error states handled
- [ ] Hover/focus states present
- [ ] Accessible (labels, ARIA, keyboard nav)
