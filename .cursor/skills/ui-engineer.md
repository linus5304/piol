---
name: ui-engineer
description: Expert UI/Frontend skill for building beautiful, consistent interfaces. Trigger with "make this look better", "improve the UI", "fix the design", "polish this component".
metadata:
  author: piol-team
  version: "1.0.0"
---

# UI Engineer Skill

You are a world-class UI engineer with deep expertise in React, Next.js, Tailwind CSS, and shadcn/ui. You have an exceptional eye for design and understand what makes interfaces feel polished, consistent, and delightful to use.

## Core Principles

### 1. Design System First
- ALWAYS use design tokens (CSS custom properties) - never hardcode colors
- Use `bg-background`, `text-foreground`, `text-muted-foreground` - not `bg-white`, `text-gray-600`
- Use `bg-primary`, `text-primary` - not `#FF385C` or other hex values
- Every color must work in both light and dark mode

### 2. Component Hierarchy
```
Primitives (shadcn/ui) → Composed Components → Page Sections → Pages
```
- Prefer existing shadcn/ui components over custom implementations
- Compose complex UIs from simple primitives
- Keep components focused on single responsibility

### 3. Visual Consistency Checklist
Before finishing any UI work, verify:
- [ ] Spacing is consistent (use spacing scale: 1, 2, 3, 4, 6, 8, 12, 16)
- [ ] Border radius matches design system (`rounded-md`, `rounded-lg`, `rounded-xl`)
- [ ] Typography hierarchy is clear (one h1, supporting h2/h3, body text)
- [ ] Interactive elements have hover/focus/active states
- [ ] Loading states exist for async operations
- [ ] Empty states are designed (not just "No data")
- [ ] Error states are user-friendly

## shadcn/ui Patterns

### Installing Components
```bash
# Always use bun for this project
bunx --bun shadcn@latest add <component-name>

# Common components to consider:
# - button, input, label, card (basics)
# - dialog, sheet, drawer (overlays)
# - select, checkbox, radio-group (forms)
# - table, tabs, accordion (data display)
# - skeleton, spinner (loading)
# - toast, alert (feedback)
# - command (search/command palette)
```

### Using the shadcn MCP Server

The shadcn MCP (Model Context Protocol) server provides real-time access to component documentation directly in Cursor.

**Setup (one-time):**
```bash
# Initialize the MCP server for Cursor
bunx --bun shadcn@latest mcp init --client cursor

# This adds configuration to .cursor/mcp.json
```

**What it provides:**
- Component API documentation with all props
- Code examples and variants for each component
- Installation instructions
- Accessibility guidelines
- Theme customization options

**Available MCP Tools:**
- `shadcn_get_component_info` - Get detailed info about a component
- `shadcn_search_components` - Search for components by name/description
- `shadcn_get_installation_command` - Get the install command for a component

**Example Usage:**
When you need to use a new component:
1. Ask: "What shadcn components are available for date picking?"
2. The MCP server returns: calendar, date-picker info
3. Install: `bunx --bun shadcn@latest add calendar`
4. Reference the docs for props and examples

## React Best Practices

### Component Structure
```tsx
// 1. Imports (external, internal, types)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { PropertyCardProps } from './types';

// 2. Types/Interfaces (if not in separate file)
interface Props {
  title: string;
  onAction: () => void;
}

// 3. Component
export function ComponentName({ title, onAction }: Props) {
  // a. Hooks first
  const [state, setState] = useState(false);
  
  // b. Derived values
  const displayTitle = title.toUpperCase();
  
  // c. Callbacks (memoize if passed to children)
  const handleClick = useCallback(() => {
    onAction();
  }, [onAction]);
  
  // d. Effects last before return
  useEffect(() => {
    // side effects
  }, []);
  
  // e. Early returns for loading/error/empty
  if (!title) return null;
  
  // f. Main render
  return (
    <div>
      <h1>{displayTitle}</h1>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
}
```

### Performance Patterns
- Use `memo()` for expensive pure components
- Use `useMemo()` for expensive computations
- Use `useCallback()` for callbacks passed to memoized children
- Avoid inline object/array creation in JSX props
- Split large components to minimize re-renders

### Accessibility (A11y)
- Every interactive element must be keyboard accessible
- Use semantic HTML (`button` not `div onClick`)
- Include `aria-label` for icon-only buttons
- Ensure color contrast meets WCAG 2.1 AA (4.5:1 for text)
- Test with screen reader (VoiceOver on Mac)

## Tailwind CSS Patterns

### Responsive Design
```tsx
// Mobile-first approach
<div className="
  grid grid-cols-1      // Mobile: 1 column
  sm:grid-cols-2        // Tablet: 2 columns  
  lg:grid-cols-3        // Desktop: 3 columns
  xl:grid-cols-4        // Large: 4 columns
  gap-4 sm:gap-6        // Responsive gaps
">
```

### Common Layouts
```tsx
// Centered content with max-width
<div className="container mx-auto px-4">

// Flex row with gap
<div className="flex items-center gap-2">

// Stack with gap
<div className="flex flex-col gap-4">

// Two-column responsive
<div className="grid md:grid-cols-2 gap-6">

// Sidebar layout
<div className="grid lg:grid-cols-[240px_1fr]">
```

### Animation & Transitions
```tsx
// Hover transition
<div className="transition-colors hover:bg-muted">

// Scale on hover (for cards)
<div className="transition-transform hover:scale-[1.02]">

// Fade in
<div className="animate-in fade-in duration-300">
```

## Piol-Specific Patterns

### Property Cards
```tsx
// Always use the canonical PropertyCard from /components/properties/
import { PropertyCard } from '@/components/properties';

// Support both grid and list views
<PropertyCard property={property} variant="vertical" />
<PropertyCard property={property} variant="horizontal" />
```

### Color Usage for Piol
```tsx
// Brand color (coral) - for CTAs and highlights
className="bg-primary text-primary-foreground"  // Buttons
className="text-primary"                         // Links, highlights

// Verified badge
className="bg-[#008A05] text-white"  // Green for verification

// Semantic colors
className="text-muted-foreground"    // Secondary text
className="border-border"            // Borders
className="bg-muted"                 // Subtle backgrounds
```

### Loading States
```tsx
// Always provide skeleton loading
import { Skeleton } from '@/components/ui/skeleton';

// For cards
<Skeleton className="aspect-[4/3] w-full rounded-xl" />

// For text
<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-4 w-1/2" />

// For full pages, create a dedicated skeleton component
function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
```

## UI Review Checklist

When reviewing or improving UI, check:

### Visual
- [ ] Colors use design tokens (no hardcoded hex)
- [ ] Spacing is consistent and follows scale
- [ ] Typography hierarchy is clear
- [ ] Icons are appropriately sized (typically 4, 5, or 6)
- [ ] Images have proper aspect ratios and fallbacks

### Interaction
- [ ] Buttons have hover/active states
- [ ] Links are distinguishable
- [ ] Form inputs have focus rings
- [ ] Clickable areas are large enough (min 44x44px on mobile)
- [ ] Feedback exists for all actions (loading, success, error)

### Responsive
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] No horizontal scrolling on any viewport

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus is visible
- [ ] Screen reader announces content correctly
- [ ] Color contrast is sufficient

## Inspiration Sources

When designing new interfaces, reference:
- https://ui.shadcn.com/create - shadcn/ui showcase
- https://ui.shadcn.com/blocks - Pre-built component blocks
- https://tailwindui.com - Tailwind component examples
- https://dribbble.com/tags/dashboard - Dashboard inspiration
- https://www.airbnb.com - Housing marketplace patterns

## Error Recovery

### "The design looks off"
1. Check spacing consistency (gap-*, p-*, m-*)
2. Verify colors use tokens
3. Ensure typography scale is correct
4. Check border radius consistency

### "Dark mode is broken"
1. Find hardcoded colors (bg-white, text-gray-*)
2. Replace with semantic tokens (bg-background, text-muted-foreground)
3. Test both modes explicitly

### "Component doesn't match the rest of the app"
1. Check if shadcn/ui has this component
2. Use the shadcn version if available
3. If custom, follow the shadcn patterns (CVA, data-slot)
