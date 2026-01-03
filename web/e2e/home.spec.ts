import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /trouvez votre/i })).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    // Click on properties link
    await page
      .getByRole('link', { name: /propriétés/i })
      .first()
      .click();
    await expect(page).toHaveURL('/properties');

    // Go back home
    await page.getByRole('link', { name: /piol/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /s'inscrire/i })
      .first()
      .click();
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /connexion/i })
      .first()
      .click();
    await expect(page).toHaveURL('/login');
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/propriétés vérifiées/i)).toBeVisible();
    await expect(page.getByText(/paiement mobile money/i)).toBeVisible();
    await expect(page.getByText(/support bilingue/i)).toBeVisible();
  });
});
