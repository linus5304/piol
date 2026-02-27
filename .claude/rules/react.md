---
paths:
  - "apps/web/src/**/*.{ts,tsx}"
---

# React Rules

- NEVER use `useMemo` to create blob URLs (`URL.createObjectURL`) with a separate `useEffect` cleanup. React Strict Mode double-fires effects, revoking cached URLs while `useMemo` returns stale references. Use `useState` + `useEffect` instead.
- Prefer server components by default. Use `'use client'` only when state/effects/browser APIs are needed.
- Loading states: always provide Skeleton or Suspense boundaries.
- Error states: always handle with error boundaries or try/catch.
