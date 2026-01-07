/**
 * Shared environment variable utilities
 * @repo/env
 */

import { z } from 'zod';

// Common schemas that can be reused
export const clerkSchemas = {
  // Server-side Clerk
  CLERK_SECRET_KEY: z.string().optional(),
  CLERK_WEBHOOK_SECRET: z.string().optional(),

  // Client-side Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default('/dashboard'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default('/dashboard/onboarding'),
};

export const convexSchemas = {
  // Server-side
  CONVEX_DEPLOYMENT: z.string().optional(),

  // Client-side
  NEXT_PUBLIC_CONVEX_URL: z.string().url().optional(),
};

export const sentrySchemas = {
  SENTRY_AUTH_TOKEN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
};

export const appSchemas = {
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Piol'),
};

// Helper functions
export function isConfigured(value: string | undefined): boolean {
  return Boolean(value && !value.includes('REPLACE_WITH') && !value.includes('YOUR_'));
}

// Re-export zod for convenience
export { z };
