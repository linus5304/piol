'use client';

import type { UserRole } from '@/lib/permissions';
import { isValidRole } from '@/lib/permissions';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useSafeUser } from './use-safe-auth';

/**
 * Returns the user's role from Convex DB (source of truth).
 * Falls back to Clerk unsafeMetadata while the Convex query loads.
 */
export function useCurrentUserRole(): {
  role: UserRole | undefined;
  isLoaded: boolean;
} {
  const { user: clerkUser, isLoaded: clerkLoaded } = useSafeUser();
  const convexUser = useQuery(api.users.getCurrentUser);

  // Convex query resolved — use DB role
  if (convexUser !== undefined) {
    return {
      role: convexUser?.role as UserRole | undefined,
      isLoaded: clerkLoaded,
    };
  }

  // Still loading from Convex — fall back to Clerk metadata to avoid flash
  const rawRole = clerkUser?.unsafeMetadata?.role;
  return {
    role: isValidRole(rawRole) ? rawRole : undefined,
    isLoaded: clerkLoaded,
  };
}
