'use client';

import { useSafeUser } from '@/hooks/use-safe-auth';
import { api } from '@repo/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useEffect, useRef } from 'react';

/**
 * Syncs Clerk user to Convex users table.
 * Runs once per session when user accesses dashboard.
 */
export function UserSync() {
  const { user, isLoaded } = useSafeUser();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const currentUser = useQuery(api.users.getCurrentUser);
  const syncAttempted = useRef(false);

  useEffect(() => {
    // Only run once, when user is loaded and we've checked Convex
    if (!isLoaded || !user || syncAttempted.current) return;
    if (currentUser !== null) return; // User already exists in Convex

    // User is authenticated but doesn't exist in Convex - sync them
    const role = (user.unsafeMetadata?.role as 'renter' | 'landlord') ?? 'renter';

    syncAttempted.current = true;
    ensureCurrentUser({
      email: user.primaryEmailAddress?.emailAddress ?? '',
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      profileImageUrl: user.imageUrl ?? undefined,
      role,
    }).catch((error) => {
      console.error('Failed to sync user to Convex:', error);
    });
  }, [isLoaded, user, currentUser, ensureCurrentUser]);

  return null; // This component doesn't render anything
}
