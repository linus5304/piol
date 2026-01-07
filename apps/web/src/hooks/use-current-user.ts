'use client';

import { useQuery } from 'convex/react';
import { useSafeAuth, useSafeUser } from './use-safe-auth';

export function useCurrentUser() {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useSafeUser();
  const { isLoaded: isAuthLoaded } = useSafeAuth();

  // If using Convex, you'd query the user from Convex here
  // const convexUser = useQuery(api.users.getCurrentUser);

  return {
    user: isSignedIn ? user : null,
    isLoaded: isUserLoaded && isAuthLoaded,
    isSignedIn: isSignedIn ?? false,
  };
}
