---
name: piol-design-system
description: Piol housing marketplace design system. Use for all UI work, component creation, styling.
---

# Piol Design System

> For core UI/design token rules, see `.claude/rules/ui.md` (loaded automatically when editing components).

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

## Component Patterns
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

## Checklist Before Committing UI
- [ ] Used existing shadcn component (or installed new one)
- [ ] No hardcoded colors - all tokens
- [ ] No hardcoded strings - all i18n
- [ ] Responsive at all breakpoints
- [ ] Loading states exist
- [ ] Error states handled
- [ ] Hover/focus states present
- [ ] Accessible (labels, ARIA, keyboard nav)
