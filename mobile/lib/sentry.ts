import * as Sentry from '@sentry/react-native';

export function initSentry() {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: __DEV__ ? 1.0 : 0.1,

    // Debug in development
    debug: __DEV__,

    // Environment
    environment: __DEV__ ? 'development' : 'production',

    // Only enable in production
    enabled: !__DEV__,

    // Enable automatic instrumentation
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,

    // Capture unhandled promise rejections
    enableNativeNagger: true,
  });
}

export { Sentry };
