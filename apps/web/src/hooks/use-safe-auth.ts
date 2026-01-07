'use client';

import { env, isClerkConfigured } from '@/lib/env';
import {
  useAuth as useClerkAuth,
  useClerk as useClerkInstance,
  useUser as useClerkUser,
} from '@clerk/nextjs';

// Re-export the config check
export { isClerkConfigured };

/**
 * Safe wrapper around Clerk's useAuth that handles cases when Clerk isn't configured.
 */
export function useSafeAuth() {
  if (!isClerkConfigured) {
    return {
      isSignedIn: false,
      isLoaded: true,
      userId: null,
      sessionId: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      signOut: async () => {},
      getToken: async () => null,
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useClerkAuth();
}

/**
 * Safe wrapper around Clerk's useUser that handles cases when Clerk isn't configured.
 */
export function useSafeUser() {
  if (!isClerkConfigured) {
    return {
      isSignedIn: false,
      isLoaded: true,
      user: null,
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useClerkUser();
}

/**
 * Safe wrapper around Clerk's useClerk that handles cases when Clerk isn't configured.
 */
export function useSafeClerk() {
  if (!isClerkConfigured) {
    return {
      signOut: async () => {},
      openSignIn: () => {},
      openSignUp: () => {},
      openUserProfile: () => {},
      session: null,
      user: null,
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useClerkInstance();
}
