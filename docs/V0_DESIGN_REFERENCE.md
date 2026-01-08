# Piol — v0 Design Reference (from Landing Page)

> Design patterns extracted from the v0-generated landing page for consistency across all pages.

---

## 🎨 Color System

**Note:** The design uses **dark/black primary** (not emerald green). This is a neutral, professional palette.

```css
:root {
  --primary: oklch(0.205 0 0);           /* Dark/black */
  --primary-foreground: oklch(0.985 0 0); /* White */
  --background: oklch(1 0 0);             /* White */
  --foreground: oklch(0.145 0 0);         /* Near black */
  --muted-foreground: oklch(0.556 0 0);   /* Gray */
  --border: oklch(0.922 0 0);             /* Light gray */
  --radius: 0.625rem;                      /* 10px */
}
```

**Usage:**
- `bg-primary` = Dark/black buttons
- `text-primary` = Dark accent text
- `bg-primary/10` = Light tinted backgrounds
- `bg-slate-50` = Section backgrounds
- `bg-slate-950/90` = Dark overlays

---

## 📝 Typography Patterns

```tsx
// Section heading
<h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:mt-6 sm:text-3xl md:text-4xl">
  Heading with <span className="text-primary">accent</span>
</h2>

// Subtitle
<p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
  Subtitle text here
</p>

// Hero heading (large)
<h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">

// Body text
<p className="text-pretty text-base text-slate-300 sm:text-lg md:text-xl">
```

---

## 🏷️ Badge/Pill Pattern

Used for section intros:

```tsx
<span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm">
  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
  Label text
</span>
```

---

## 📦 Card Patterns

### Standard Card
```tsx
<div className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:rounded-2xl sm:p-6">
  {/* Background gradient on hover */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  
  <div className="relative">
    {/* Content */}
  </div>
</div>
```

### Property Card
```tsx
<article className="group cursor-pointer">
  {/* Image container */}
  <div className="relative aspect-[4/3] overflow-hidden rounded-lg sm:rounded-xl">
    {/* Image carousel */}
    {/* Favorite button - top right */}
    {/* Verified badge - top left */}
    {/* Carousel dots - bottom center */}
  </div>
  
  {/* Details */}
  <div className="mt-2 sm:mt-3">
    {/* Location + Rating row */}
    {/* Title */}
    {/* Distance + Bedrooms (desktop) */}
    {/* Price */}
  </div>
</article>
```

---

## 🔘 Button Patterns

### Primary Button
```tsx
<Button className="h-12 w-full gap-2 rounded-lg text-sm font-semibold sm:h-11 sm:rounded-xl sm:text-base" size="lg">
  <Icon className="h-4 w-4" />
  <span>Label</span>
</Button>
```

### Outline Button (rounded full)
```tsx
<Button variant="outline" className="gap-2 rounded-full bg-transparent">
  Label
  <Icon className="h-4 w-4" />
</Button>
```

### Ghost Link Button
```tsx
<Button variant="ghost" size="sm">
  Se connecter
</Button>
```

---

## 🖼️ Hero Section Pattern

```tsx
<section className="relative overflow-hidden">
  {/* Background Image with Overlay */}
  <div className="absolute inset-0 z-0">
    <img src="..." className="h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" />
  </div>

  <div className="container relative z-10 mx-auto px-4 py-16 sm:py-20 md:py-28 lg:py-36">
    <div className="max-w-2xl">
      {/* Badge pill */}
      {/* Heading */}
      {/* Subtitle */}
      {/* Search card (white, shadow-2xl) */}
      {/* Stats row */}
      {/* Quick filter tags */}
    </div>
  </div>
</section>
```

---

## 📐 Section Layout Pattern

```tsx
<section className="bg-slate-50 py-16 sm:py-20 md:py-24">
  <div className="container mx-auto px-4">
    {/* Header with badge + title + subtitle */}
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {/* Badge pill */}
        {/* Title */}
        {/* Subtitle */}
      </div>
      {/* Optional CTA button (desktop) */}
    </div>

    {/* Content grid */}
    <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">
      {/* Items */}
    </div>

    {/* Mobile CTA */}
    <div className="mt-8 flex justify-center sm:hidden">
      {/* Button */}
    </div>
  </div>
</section>
```

---

## 🃏 Icon Box Pattern

```tsx
<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary sm:mb-4 sm:h-12 sm:w-12 sm:rounded-xl">
  <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground sm:h-6 sm:w-6" />
</div>
```

---

## 💰 Price Display Pattern

```tsx
<p className="mt-1.5 sm:mt-2">
  <span className="text-sm font-semibold text-foreground sm:text-base">{price} FCFA</span>
  <span className="text-xs text-muted-foreground sm:text-sm"> /mois</span>
</p>
```

---

## ❤️ Favorite Button Pattern

```tsx
<button
  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white sm:right-3 sm:top-3 sm:h-8 sm:w-8"
  aria-label="Ajouter aux favoris"
>
  <Heart className="h-3.5 w-3.5 text-foreground sm:h-4 sm:w-4" />
</button>
```

---

## ✅ Verified Badge Pattern

```tsx
<Badge className="absolute left-2 top-2 gap-1 bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground shadow-md sm:left-3 sm:top-3 sm:px-2 sm:py-1 sm:text-xs">
  <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
  <span className="hidden sm:inline">Vérifié</span>
</Badge>
```

---

## 📱 Responsive Breakpoints

| Prefix | Width | Use Case |
|--------|-------|----------|
| (none) | 0px+ | Mobile default |
| `sm:` | 640px+ | Large phones / small tablets |
| `md:` | 768px+ | Tablets |
| `lg:` | 1024px+ | Desktop |

**Common patterns:**
- Text size: `text-xs sm:text-sm` or `text-sm sm:text-base`
- Spacing: `mt-2 sm:mt-3` or `p-4 sm:p-6`
- Columns: `grid-cols-2 lg:grid-cols-3` or `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Visibility: `hidden sm:flex` or `sm:hidden`
- Border radius: `rounded-lg sm:rounded-xl` or `rounded-xl sm:rounded-2xl`

---

## 🎬 Animation/Transition Patterns

```css
/* Standard transition */
transition-all duration-300

/* Hover scale */
hover:scale-110
hover:scale-[1.02]

/* Shadow on hover */
hover:shadow-lg hover:shadow-primary/5

/* Border highlight on hover */
hover:border-primary/30

/* Opacity transition */
opacity-0 group-hover:opacity-100
```

---

## 📍 Header Pattern

- Sticky: `sticky top-0 z-50`
- Height: `h-14 sm:h-16`
- Border bottom: `border-b border-border`
- Logo: Dark square with "P" letter
- Mobile menu: Full screen overlay with solid background

---

## 🦶 Footer Pattern

- Background: `bg-slate-50 border-t border-border`
- Grid: `grid gap-8 sm:grid-cols-2 lg:grid-cols-4`
- Social icons: Rounded buttons with hover to primary
- Payment badges: Colored tint backgrounds (yellow for MTN, orange for Orange Money)

---

## 🔑 Key Takeaways for v0 Prompts

1. **Primary color is DARK/BLACK**, not emerald
2. **Rounded corners scale up**: `rounded-lg` → `rounded-xl` → `rounded-2xl`
3. **Always use responsive text**: `text-sm sm:text-base`
4. **Cards have hover gradients** and border highlights
5. **Section backgrounds alternate**: white ↔ slate-50
6. **Icons in tinted boxes**: `bg-primary/10` with hover to `bg-primary`
7. **Transitions everywhere**: `transition-all duration-300`
8. **Mobile-first with detailed sm: breakpoints**
