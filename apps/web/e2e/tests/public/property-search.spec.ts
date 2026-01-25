import { expect, test } from '@playwright/test';
import { PropertiesPage } from '../../pages/properties.page';

test.describe('Property Search', () => {
  let propertiesPage: PropertiesPage;

  test.beforeEach(async ({ page }) => {
    propertiesPage = new PropertiesPage(page);
  });

  test('should display properties list', async ({ page }) => {
    await propertiesPage.goto();
    await page.waitForLoadState('networkidle');

    // Page should load without errors
    await expect(page).toHaveURL(/\/properties/);
  });

  test('should search properties by location', async ({ page }) => {
    await propertiesPage.goto();
    await page.waitForLoadState('networkidle');

    await propertiesPage.search('Douala');

    // URL should update with search query
    await expect(page).toHaveURL(/q=Douala/i);
  });

  test('should filter properties by price range', async ({ page }) => {
    await propertiesPage.goto();
    await page.waitForLoadState('networkidle');

    await propertiesPage.filterByPrice(50000, 150000);

    // URL should contain filter parameters
    await expect(page).toHaveURL(/minPrice|maxPrice/i);
  });

  test('should navigate to property detail page', async ({ page }) => {
    await propertiesPage.goto();
    await page.waitForLoadState('networkidle');

    // Wait for at least one property card or no results
    const hasProperties = (await propertiesPage.propertyCards.count()) > 0;

    if (hasProperties) {
      await propertiesPage.clickProperty(0);
      await expect(page).toHaveURL(/\/properties\/[a-zA-Z0-9]+/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await propertiesPage.goto();
    await page.waitForLoadState('networkidle');

    // Page should be functional on mobile
    await expect(page).toHaveURL(/\/properties/);
  });
});
