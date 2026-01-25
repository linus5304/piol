import { test as base } from '@playwright/test';

// Extend base test with Clerk authentication fixtures
export const test = base.extend<{
  authenticatedPage: typeof base;
}>({
  // This fixture can be expanded to handle Clerk authentication
  // For now, it's a placeholder for authenticated tests
  authenticatedPage: async ({ page }, use) => {
    // Clerk authentication setup would go here
    // See: https://clerk.com/docs/testing/playwright

    // For development/testing, you might:
    // 1. Use Clerk's testing tokens
    // 2. Set up test users in Clerk dashboard
    // 3. Use bypass tokens for E2E testing

    await use(base);
  },
});

export { expect } from '@playwright/test';
