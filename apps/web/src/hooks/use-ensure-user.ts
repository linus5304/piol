'use client';

import { useAuth } from '@clerk/nextjs';
import { api } from '@repo/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useEffect, useRef } from 'react';

/**
 * Hook that ensures the current user exists in Convex.
 * Call this once in a high-level component (e.g., layout) to auto-create
 * the user if they don't exist (fallback for webhook race conditions).
 */
export function useEnsureUser() {
  const { isSignedIn, isLoaded } = useAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreateCurrentUser);
  const hasEnsured = useRef(false);

  useEffect(() => {
    // Only run once when user is signed in
    if (isLoaded && isSignedIn && !hasEnsured.current) {
      hasEnsured.current = true;
      getOrCreateUser()
        .then((user) => {
          if (user) {
            console.log('[useEnsureUser] User ensured:', user._id);
          }
        })
        .catch((error) => {
          console.error('[useEnsureUser] Failed to ensure user:', error);
          // Reset flag so it can retry
          hasEnsured.current = false;
        });
    }
  }, [isLoaded, isSignedIn, getOrCreateUser]);
}
