import path from 'node:path';
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['__tests__/**/*.test.ts'],
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      // Redirect _generated/server imports to our test setup
      './_generated/server': path.resolve(__dirname, '__tests__/setup.ts'),
    },
  },
});
