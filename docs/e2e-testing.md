# E2E Testing

This document covers the Playwright end-to-end testing setup, patterns, and conventions used in Piol.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Auth Fixtures](#auth-fixtures)
- [Page Object Pattern](#page-object-pattern)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Debugging](#debugging)

## Overview

E2E tests use [Playwright](https://playwright.dev/) to test the application in real browsers. Tests are located in `apps/web/e2e/` and cover:

- **Public routes** (property search, listings)
- **Access control** (protected route redirects)
- **Role-based smoke tests** (admin, landlord, verifier, renter)

## Project Structure

```
apps/web/e2e/
├── fixtures/
│   └── auth.ts               # Auth fixture for role-based testing
├── pages/
│   └── properties.page.ts    # Page object for properties page
└── tests/
    ├── public/
    │   └── property-search.spec.ts    # Public route tests
    └── smoke/
        ├── access-control.spec.ts              # Guest access control
        └── authenticated-role-smoke.spec.ts    # Role-based smoke tests
```

## Configuration

Playwright is configured in `apps/web/playwright.config.ts`:

```ts
export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], process.env.CI ? ['github'] : ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

Key settings:
- Tests run against `http://localhost:3000`
- Two projects: Desktop Chrome and Pixel 5 (mobile)
- Dev server auto-starts if not already running
- Traces captured on first retry, screenshots on failure
- Fully parallel execution in local mode, single worker in CI

## Auth Fixtures

The auth fixture (`apps/web/e2e/fixtures/auth.ts`) provides role-based browser contexts with pre-authenticated state.

### How It Works

1. Each role (`renter`, `landlord`, `admin`, `verifier`) has a corresponding Playwright storage state file
2. Storage state files contain Clerk session cookies and local storage data
3. The fixture creates a new browser context with the storage state loaded

### Setup

Provide storage state files via environment variables or a directory:

**Option A: Per-role environment variables**
```bash
export PLAYWRIGHT_STORAGE_STATE_RENTER=/path/to/renter.json
export PLAYWRIGHT_STORAGE_STATE_LANDLORD=/path/to/landlord.json
export PLAYWRIGHT_STORAGE_STATE_ADMIN=/path/to/admin.json
export PLAYWRIGHT_STORAGE_STATE_VERIFIER=/path/to/verifier.json
```

**Option B: Auth directory**
```bash
export PLAYWRIGHT_AUTH_DIR=/path/to/auth-states/
# Expects: renter.json, landlord.json, admin.json, verifier.json
```

### Generating Storage State Files

To generate a storage state file for a role:

1. Run Playwright with `--headed` and sign in manually:
   ```bash
   cd apps/web && bunx playwright test --headed --debug
   ```

2. After signing in, save the storage state:
   ```ts
   await page.context().storageState({ path: './auth-states/admin.json' });
   ```

Or create a setup project in `playwright.config.ts` that signs in and saves state.

### Usage in Tests

```ts
import { expect, test } from '../../fixtures/auth';

test.describe('Admin Features', () => {
  test.use({ authRole: 'admin' });

  test('admin can access users page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/admin/users');
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/admin\/users/);
  });
});
```

If the storage state file is missing, the test is automatically **skipped** (not failed).

## Page Object Pattern

Page objects encapsulate page-specific selectors and interactions, keeping test files clean.

### Example: PropertiesPage

```ts
// apps/web/e2e/pages/properties.page.ts
import type { Locator, Page } from '@playwright/test';

export class PropertiesPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly propertyCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('property-search-input');
    this.propertyCards = page.getByTestId('property-card');
  }

  async goto() {
    await this.page.goto('/properties');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async getPropertyCount(): Promise<number> {
    return await this.propertyCards.count();
  }
}
```

### Conventions

- One page object per major route/feature
- Store in `apps/web/e2e/pages/`
- Use `data-testid` attributes for selectors (e.g., `getByTestId('property-card')`)
- Encapsulate multi-step interactions as methods
- Use readonly Locator properties for element references

### Adding a New Page Object

1. Create `apps/web/e2e/pages/my-feature.page.ts`
2. Define selectors as `readonly` Locator properties in the constructor
3. Add interaction methods (e.g., `goto()`, `fillForm()`, `submit()`)
4. Import and use in test files

## Writing Tests

### File Structure

```
apps/web/e2e/tests/
├── public/          # Tests for unauthenticated routes
│   └── *.spec.ts
└── smoke/           # Smoke tests for authenticated routes
    └── *.spec.ts
```

### Conventions

- File names: `feature-name.spec.ts`
- Use `test.describe()` to group related tests
- Use page objects for page interactions
- Wait for `networkidle` after navigation for Convex data to load
- Handle conditional content (e.g., check if properties exist before clicking)

### Example: Public Route Test

```ts
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
    await expect(page).toHaveURL(/\/properties/);
  });

  test('should search properties by location', async ({ page }) => {
    await propertiesPage.goto();
    await page.waitForLoadState('networkidle');
    await propertiesPage.search('Douala');
    await expect(page).toHaveURL(/q=Douala/i);
  });
});
```

### Example: Access Control Test

```ts
import { expect, test } from '@playwright/test';

const protectedRoutes = ['/dashboard', '/dashboard/admin', '/dashboard/verify'];

test.describe('Guest Access Control', () => {
  for (const route of protectedRoutes) {
    test(`guest cannot stay on ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page).not.toHaveURL(new RegExp(`${route}$`));
    });
  }
});
```

### Example: Authenticated Role Test

```ts
import { expect, test } from '../../fixtures/auth';

test.describe('Landlord Features', () => {
  test.use({ authRole: 'landlord' });

  test('can access new property form', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/properties/new');
    await authenticatedPage.waitForLoadState('networkidle');
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/properties\/new/);
  });
});
```

## Running Tests

### Local Development

```bash
cd apps/web

# Run all E2E tests
bunx playwright test

# Run specific test file
bunx playwright test e2e/tests/public/property-search.spec.ts

# Run with UI mode (interactive)
bunx playwright test --ui

# Run in headed mode (see the browser)
bunx playwright test --headed

# Run specific project (desktop or mobile)
bunx playwright test --project=chromium
bunx playwright test --project=mobile

# Run with debug mode (step through tests)
bunx playwright test --debug
```

The dev server starts automatically if not already running (configured in `playwright.config.ts`).

### View Test Report

After running tests:

```bash
bunx playwright show-report
```

Opens an HTML report with test results, traces, and screenshots.

## Debugging

### Traces

Traces are captured on first retry. View them in the HTML report or:

```bash
bunx playwright show-trace path/to/trace.zip
```

Traces show:
- Step-by-step screenshots
- Network requests
- Console logs
- DOM snapshots

### Screenshots

Screenshots are taken on test failure. Find them in `apps/web/test-results/`.

### Common Issues

**Tests skip with "Missing storage state":**
- Auth storage state files are not configured
- Set `PLAYWRIGHT_AUTH_DIR` or individual `PLAYWRIGHT_STORAGE_STATE_*` env vars
- See [Auth Fixtures](#auth-fixtures) for setup

**Tests fail with timeout waiting for element:**
- Convex data may not be loaded yet
- Add `await page.waitForLoadState('networkidle')` after navigation
- Increase timeout if the dev server is slow to start

**Dev server fails to start:**
- Check that `bun run dev` works manually
- Ensure port 3000 is not already in use
- The web server has a 120-second timeout configured in `playwright.config.ts`
