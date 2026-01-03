import { expect, test } from '@playwright/test';

test.describe('Properties Page', () => {
  test('should display properties page', async ({ page }) => {
    await page.goto('/properties');
    await expect(page.getByRole('heading', { name: /propriétés disponibles/i })).toBeVisible();
  });

  test('should have filter controls', async ({ page }) => {
    await page.goto('/properties');

    // Check for filter elements
    await expect(page.getByRole('combobox').first()).toBeVisible();
    await expect(page.getByPlaceholder(/prix min/i)).toBeVisible();
    await expect(page.getByPlaceholder(/prix max/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /réinitialiser/i })).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    await page.goto('/properties');
    // Either loading state or properties should be visible
    const hasContent = await page
      .locator('[class*="animate-pulse"], [data-testid="property-card"]')
      .count();
    expect(hasContent).toBeGreaterThan(0);
  });
});
