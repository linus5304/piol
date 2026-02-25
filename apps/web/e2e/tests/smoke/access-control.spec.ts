import { expect, test } from '@playwright/test';

const protectedRoutes = [
  '/dashboard',
  '/dashboard/admin',
  '/dashboard/verify',
  '/dashboard/properties/new',
];

test.describe('Guest Access Control', () => {
  for (const route of protectedRoutes) {
    test(`guest cannot stay on protected route ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      await expect(page).not.toHaveURL(new RegExp(`${route}$`));

      const url = page.url();
      expect(url).toMatch(/\/sign-in|\/dashboard(\/onboarding)?/);
    });
  }
});
