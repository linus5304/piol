import { withSentryConfig } from '@sentry/nextjs';
import { withGTConfig } from 'gt-next/config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '*.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
    deviceSizes: [320, 420, 640, 768, 1024, 1280],
    imageSizes: [16, 32, 48, 64, 96, 128, 192],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

const withGeneralTranslation = withGTConfig(nextConfig, {
  config: './gt.config.json',
  loadDictionaryPath: './src/loadDictionary.ts',
  headersAndCookies: {
    localeCookieName: 'NEXT_LOCALE',
  },
  // Keep support for both env variable names during rollout.
  projectId: process.env.GT_PROJECT_ID ?? process.env.NEXT_PUBLIC_GT_PROJECT_ID,
  apiKey: process.env.GT_API_KEY,
});

export default withSentryConfig(withGeneralTranslation, {
  // Suppress source map upload logs in CI
  silent: true,

  // Upload source maps for better stack traces
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps when auth token is set
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Disable Sentry telemetry
  telemetry: false,
});
