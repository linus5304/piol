import { expect, test } from '../../fixtures/auth';

test.describe('Authenticated Role Smoke', () => {
  test.describe('Admin', () => {
    test.use({ authRole: 'admin' });

    test('admin can access users management', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/admin/users');
      await authenticatedPage.waitForLoadState('networkidle');
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/admin\/users/);
    });
  });

  test.describe('Verifier', () => {
    test.use({ authRole: 'verifier' });

    test('verifier can access verification dashboard', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/verify');
      await authenticatedPage.waitForLoadState('networkidle');
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/verify/);
    });
  });

  test.describe('Landlord', () => {
    test.use({ authRole: 'landlord' });

    test('landlord can access new property form', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/properties/new');
      await authenticatedPage.waitForLoadState('networkidle');
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/properties\/new/);
    });
  });

  test.describe('Renter Payments Staging', () => {
    test.use({ authRole: 'renter' });

    test('payments history remains visible while checkout action is gated', async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.goto('/dashboard/payments');
      await authenticatedPage.waitForLoadState('networkidle');

      await expect(authenticatedPage.getByRole('heading', { name: 'Paiements' })).toBeVisible();

      const checkoutAction = authenticatedPage.getByTestId('payments-checkout-action');
      const isPaymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true';

      if (isPaymentsEnabled) {
        await expect(checkoutAction).toBeVisible();
      } else {
        await expect(checkoutAction).toHaveCount(0);
        await expect(authenticatedPage.getByTestId('payments-staged-banner')).toBeVisible();
      }
    });
  });
});
