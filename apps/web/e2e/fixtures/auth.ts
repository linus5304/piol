import fs from 'node:fs';
import path from 'node:path';
import { test as base, expect } from '@playwright/test';

export type AuthRole = 'renter' | 'landlord' | 'admin' | 'verifier';

const ROLE_STORAGE_STATE_ENV: Record<AuthRole, string> = {
  renter: 'PLAYWRIGHT_STORAGE_STATE_RENTER',
  landlord: 'PLAYWRIGHT_STORAGE_STATE_LANDLORD',
  admin: 'PLAYWRIGHT_STORAGE_STATE_ADMIN',
  verifier: 'PLAYWRIGHT_STORAGE_STATE_VERIFIER',
};

function resolveRoleStorageState(role: AuthRole): string | null {
  const explicitPath = process.env[ROLE_STORAGE_STATE_ENV[role]];
  if (explicitPath) {
    return explicitPath;
  }

  const authDir = process.env.PLAYWRIGHT_AUTH_DIR;
  if (!authDir) {
    return null;
  }

  return path.join(authDir, `${role}.json`);
}

type AuthFixtures = {
  authRole: AuthRole;
  authenticatedPage: import('@playwright/test').Page;
};

export const test = base.extend<AuthFixtures>({
  authRole: ['renter', { option: true }],

  authenticatedPage: async ({ browser, authRole }, use, testInfo) => {
    const storageStatePath = resolveRoleStorageState(authRole);

    if (!storageStatePath || !fs.existsSync(storageStatePath)) {
      testInfo.skip(
        `Missing storage state for role "${authRole}". Set ${ROLE_STORAGE_STATE_ENV[authRole]} or PLAYWRIGHT_AUTH_DIR.`
      );
      return;
    }

    const context = await browser.newContext({ storageState: storageStatePath });
    const page = await context.newPage();

    await use(page);
    await context.close();
  },
});

export { expect };
