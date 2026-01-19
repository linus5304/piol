import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Debug in development
  debug: process.env.NODE_ENV === 'development',

  // Environment
  environment: process.env.NODE_ENV,

  // Only enable when DSN is set
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});
