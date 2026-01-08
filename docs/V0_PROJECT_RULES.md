# Piol — v0 Project Rules

> Copy these rules into your v0 project settings to ensure consistent, high-quality UI generation.

---

## 🎯 How to Set Up in v0

1. Go to https://v0.dev
2. Create a new project called "Piol"
3. Click **Settings** (gear icon)
4. Go to **Rules** tab
5. Paste the rules below into the **Instructions** field
6. Optionally upload source files (schema, types, etc.)

---

## 📋 Project Rules (Copy This Entire Block)

```
# Piol - Cameroon Housing Marketplace

## Project Context
You are building UI for Piol, a housing rental marketplace for Cameroon. The platform connects renters with landlords, featuring property verification, secure payments via mobile money (MTN MoMo, Orange Money), and messaging.

## Tech Stack
- Next.js 16 with App Router
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui components (use these by default)
- Lucide React icons
- Convex for backend (real-time database)

## Design System

### Colors
- Primary: Emerald green (#10b981 / emerald-500)
- Primary hover: #059669 (emerald-600)
- Background: White (#ffffff) and slate-50 (#f8fafc)
- Text primary: slate-900 (#0f172a)
- Text secondary: slate-600 (#475569)
- Text muted: slate-400 (#94a3b8)
- Border: slate-200 (#e2e8f0)
- Success: green-500
- Warning: yellow-500
- Error: red-500
- Info: blue-500

### Typography
- Font family: Geist Sans (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- Headings: font-semibold or font-bold
- Body: font-normal

### Spacing & Sizing
- Border radius: rounded-lg (8px) for cards, rounded-md (6px) for buttons/inputs
- Card padding: p-4 or p-6
- Section spacing: space-y-6 or space-y-8
- Container max-width: max-w-7xl mx-auto

### Shadows
- Cards: shadow-sm (default), shadow-md (hover)
- Modals/Sheets: shadow-lg
- Dropdowns: shadow-md

### Component Patterns
- Cards: Use shadcn Card with rounded-lg border border-slate-200 bg-white
- Buttons: Use shadcn Button, primary variant for main actions
- Inputs: Use shadcn Input with proper labels
- Badges: Use shadcn Badge for status indicators
- Always include hover and focus states
- Use transitions for smooth interactions: transition-all duration-200

## Content & Localization

### Language
- Primary language: French
- All UI text in French by default
- Support for English toggle (FR/EN)

### Currency
- Format: "150 000 FCFA" (with space as thousand separator)
- Monthly rent: "150 000 FCFA/mois"
- Always show currency clearly

### Locations
- Cities: Yaoundé, Douala, Bafoussam, Bamenda, Garoua
- Neighborhoods examples: Bastos, Akwa, Bonamoussadi, Omnisport

### Property Types (French)
- Studio
- 1 chambre
- 2 chambres
- 3 chambres
- 4+ chambres
- Appartement
- Maison
- Villa

### Common UI Labels (French)
- Search: "Rechercher"
- Filter: "Filtrer"
- Sort: "Trier par"
- Save: "Enregistrer"
- Cancel: "Annuler"
- Submit: "Soumettre"
- Next: "Suivant"
- Previous: "Précédent"
- View all: "Voir tout"
- Contact: "Contacter"
- Sign in: "Se connecter"
- Sign up: "S'inscrire"
- Log out: "Déconnexion"
- Profile: "Profil"
- Settings: "Paramètres"
- Messages: "Messages"
- Properties: "Propriétés"
- Dashboard: "Tableau de bord"
- Verified: "Vérifié"
- Published: "Publié"
- Pending: "En attente"
- Active: "Actif"
- Favorites: "Favoris"
- Payment: "Paiement"

## Responsive Design

### Breakpoints
- Mobile first approach
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

### Mobile Considerations
- 70% of traffic is mobile
- Touch-friendly tap targets (min 44px)
- Bottom navigation for mobile dashboards
- Full-screen sheets for mobile filters
- Sticky headers and CTAs

## Accessibility
- Use semantic HTML (nav, main, article, section, aside)
- Include aria-labels for icon-only buttons
- Ensure color contrast meets WCAG AA
- Keyboard navigable with visible focus rings
- Use sr-only for screen reader text

## Component Usage Guidelines

### shadcn/ui Components to Use
- Button (all variants)
- Card, CardHeader, CardContent, CardFooter
- Input, Label, Textarea
- Select, SelectTrigger, SelectContent, SelectItem
- Dialog, DialogTrigger, DialogContent
- Sheet (for mobile sidebars/filters)
- Dropdown Menu
- Avatar
- Badge
- Skeleton (for loading states)
- Tabs
- Separator
- ScrollArea
- Form (with react-hook-form)
- Toast/Sonner for notifications

### Icons (Lucide React)
- Use appropriate icons from lucide-react
- Size: 16px (small), 20px (default), 24px (large)
- Common icons: Search, Home, Heart, MessageSquare, Settings, User, Bell, Plus, ChevronRight, MapPin, Building, Eye, Check, X, Filter, ArrowLeft

## State Handling

### Loading States
- Always show skeleton loaders matching the content shape
- Use shimmer animation for loading cards
- Show loading spinners for button actions

### Empty States
- Include illustration or icon
- Clear message in French
- Action button when applicable

### Error States
- Red color for error messages
- Clear, actionable error text
- Retry buttons when possible

## Code Quality
- Use TypeScript interfaces for props
- Prefer functional components
- Use "use client" directive only when needed
- Keep components focused and single-purpose
- Extract reusable logic into hooks
```

---

## 📝 Optional Custom Instructions (Account-Level)

Create these as reusable Instructions in v0 that you can apply with @mention:

### 1. Mobile First
```
Title: Mobile First
Instruction: Always design for mobile screens first (375px width), then adapt the layout for larger screens. Use single column layouts on mobile, expanding to 2-3 columns on tablet/desktop. Ensure touch targets are at least 44px and use bottom sheets instead of dropdowns on mobile.
```

### 2. French UI
```
Title: French UI
Instruction: Generate all user-facing text in French. Use proper French conventions for dates (15 janvier 2026), numbers (1 000,50), and currency (150 000 FCFA). Include appropriate French UI patterns and vocabulary.
```

### 3. Property Card
```
Title: Property Card Style
Instruction: For property cards, use: 16:9 image aspect ratio with object-cover, heart save button top-right of image, verified badge top-left if applicable, title truncated to 2 lines, price in emerald color with FCFA/mois, location with MapPin icon, feature pills (bedrooms, bathrooms), hover state with shadow-md lift.
```

### 4. Dashboard Layout
```
Title: Dashboard Layout
Instruction: For dashboard pages, use a sidebar layout on desktop (256px width) that collapses to a hamburger menu on mobile. Include a sticky header with breadcrumbs, user menu, and notifications. Main content should have p-6 padding and max-w-7xl container. Use off-white background (slate-50) for the main area.
```

### 5. Form Patterns
```
Title: Form Patterns
Instruction: For forms, use shadcn Form with react-hook-form. Group related fields visually. Show inline validation errors below inputs. Use proper French labels. Include loading state on submit button. Add confirmation dialogs for destructive actions.
```

---

## 📁 Recommended Source Files to Upload

Upload these files to your v0 project for better context:

1. **schema.ts** - Your Convex database schema (helps v0 understand data structure)
2. **types/index.ts** - TypeScript type definitions
3. **globals.css** - Your Tailwind CSS custom styles
4. **Example component** - One well-styled component as reference

---

## 🔧 v0 Project Integrations

Consider connecting these in v0 Project Settings → Integrations:

| Integration | Purpose |
|-------------|---------|
| GitHub | Sync generated code directly to your repo |
| Vercel | Preview deployments for generated pages |

---

## 💡 Quick Reference Cheatsheet

### When Prompting v0

**Always include:**
- What you're building (specific components, data, actions)
- Who uses it and when (context of use)
- Constraints (mobile-first, French, emerald primary)

**Example prompt structure:**
```
Build [component/page] with:
- [List of elements and data]

Used by [user type],
in [context/moment],
to [decision/outcome].

Constraints:
- Mobile-first
- French language
- Emerald primary (#10b981)
- shadcn/ui components
```

### Common Follow-ups

| Need | Prompt |
|------|--------|
| Add loading | "Add skeleton loaders with shimmer animation" |
| Add empty state | "Add empty state with illustration and 'Aucun résultat' message" |
| Make responsive | "Make mobile-first: 1 column mobile, 2 tablet, 3 desktop" |
| Add hover | "Add hover:shadow-md with scale-[1.02] transition" |
| Fix colors | "Use emerald-500 for primary buttons" |
| Add French | "Translate all labels to French" |
