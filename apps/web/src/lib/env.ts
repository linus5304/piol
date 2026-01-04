import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Type-safe environment variables configuration
 * Following next-forge patterns for robust env handling
 * 
 * @see https://www.next-forge.com/docs
 * @see https://env.t3.gg/docs/nextjs
 */
export const env = createEnv({
  /**
   * Server-side environment variables schema
   * These are only available on the server and will throw if accessed on the client
   */
  server: {
    // Node environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    
    // Clerk Authentication (Server)
    CLERK_SECRET_KEY: z.string().optional(),
    CLERK_WEBHOOK_SECRET: z.string().optional(),
    
    // Convex Backend
    CONVEX_DEPLOYMENT: z.string().optional(),
    
    // Sentry Error Tracking
    SENTRY_AUTH_TOKEN: z.string().optional(),
    
    // Analytics (optional)
    ANALYTICS_SECRET: z.string().optional(),
  },

  /**
   * Client-side environment variables schema
   * These are exposed to the client and must be prefixed with NEXT_PUBLIC_
   */
  client: {
    // Clerk Authentication (Client)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default('/dashboard'),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default('/dashboard/onboarding'),
    
    // Convex Backend (Client)
    NEXT_PUBLIC_CONVEX_URL: z.string().url().optional(),
    
    // Sentry Error Tracking (Client)
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
    
    // App Configuration
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_APP_NAME: z.string().default('Piol'),
  },

  /**
   * Runtime environment variables
   * This is where we actually read the environment variables
   */
  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    ANALYTICS_SECRET: process.env.ANALYTICS_SECRET,
    
    // Client
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },

  /**
   * Skip validation in certain environments
   * Useful for Docker builds where env vars aren't available at build time
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined
   * This makes it easier to handle optional env vars
   */
  emptyStringAsUndefined: true,
});

/**
 * Helper to check if Clerk is configured
 */
export const isClerkConfigured = Boolean(
  env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('REPLACE_WITH')
);

/**
 * Helper to check if Convex is configured
 */
export const isConvexConfigured = Boolean(
  env.NEXT_PUBLIC_CONVEX_URL && 
  !env.NEXT_PUBLIC_CONVEX_URL.includes('REPLACE_WITH')
);

/**
 * Helper to check if Sentry is configured
 */
export const isSentryConfigured = Boolean(env.NEXT_PUBLIC_SENTRY_DSN);

/**
 * Get configuration status for debugging
 */
export function getConfigStatus() {
  return {
    clerk: isClerkConfigured,
    convex: isConvexConfigured,
    sentry: isSentryConfigured,
    environment: env.NODE_ENV,
  };
}
