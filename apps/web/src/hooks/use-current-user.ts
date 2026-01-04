'use client';

import { useQuery, useMutation } from 'convex/react';
import { useUser, useAuth } from '@clerk/nextjs';
import { api } from '../../convex/_generated/api';
import { useEffect, useCallback } from 'react';

/**
 * Hook to get the current user from Convex, with automatic sync from Clerk.
 * This handles the race condition where a user might sign up but their
 * Convex record hasn't been created yet by the webhook.
 */
export function useCurrentUser() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { isSignedIn } = useAuth();
  
  // Query for the current user in Convex
  const convexUser = useQuery(
    api.users.getCurrentUser,
    isSignedIn ? {} : 'skip'
  );

  // Mutation to ensure user exists (called if webhook didn't fire yet)
  const ensureUser = useMutation(api.users.ensureCurrentUser);

  // If signed in but no Convex user, try to create one
  useEffect(() => {
    const syncUser = async () => {
      if (
        clerkLoaded &&
        isSignedIn &&
        clerkUser &&
        convexUser === null
      ) {
        try {
          // Try to create user if webhook hasn't fired yet
          await ensureUser({
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            firstName: clerkUser.firstName || undefined,
            lastName: clerkUser.lastName || undefined,
            profileImageUrl: clerkUser.imageUrl || undefined,
            phone: clerkUser.primaryPhoneNumber?.phoneNumber || undefined,
            role: (clerkUser.unsafeMetadata?.role as 'renter' | 'landlord') || 'renter',
          });
        } catch (error) {
          // User might already exist (webhook caught up) - that's fine
          console.log('User sync check completed');
        }
      }
    };

    syncUser();
  }, [clerkLoaded, isSignedIn, clerkUser, convexUser, ensureUser]);

  return {
    user: convexUser,
    clerkUser,
    isLoading: !clerkLoaded || (isSignedIn && convexUser === undefined),
    isSignedIn: isSignedIn ?? false,
  };
}

