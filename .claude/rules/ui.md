---
paths:
  - "apps/web/src/components/**/*.{ts,tsx}"
  - "apps/web/src/app/**/*.{ts,tsx}"
---

# UI & Design Rules

- Design tokens live in `apps/web/src/app/globals.css`. Reference via Tailwind classes (`bg-primary`, `text-muted-foreground`).
- For new colors, add CSS variables to globals.css first, then reference via Tailwind.
- Check existing `apps/web/src/components/ui/` before creating components.
- Mobile-first responsive: sm:640px, md:768px, lg:1024px, xl:1280px.
- All user-facing text through i18n: `const { t } = useTranslation()`.
- Add hover/focus states to all interactive elements.
- Property images: use 4:3 or 16:9 aspect ratios.
