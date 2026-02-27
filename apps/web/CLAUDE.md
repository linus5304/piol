# Web App (Next.js 16)

App Router in `src/app/`. Components in `src/components/` (49 shadcn primitives in `ui/`).

## Key Directories
- `src/app/dashboard/` — authenticated area (properties, admin, verify, messages, payments, settings)
- `src/components/properties/` — domain components (17 files)
- `src/hooks/` — custom hooks (permissions, auth, forms, mobile detection)
- `src/lib/validations/` — Zod schemas (8 files)
- `src/i18n/` — internationalization

## Testing
```bash
cd apps/web && jest          # Unit tests
cd apps/web && bunx playwright test  # E2E
```

## Design Tokens
All in `src/app/globals.css`. Never bypass with raw hex/rgb values.
