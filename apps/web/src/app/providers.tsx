'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexReactClient, ConvexProvider } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs';
import { type ReactNode, useMemo, useState } from 'react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = clerkKey && !clerkKey.includes('REPLACE_WITH');

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 2,
          },
        },
      })
  );

  const convex = useMemo(() => {
    if (!convexUrl || convexUrl.includes('REPLACE_WITH')) {
      console.warn('NEXT_PUBLIC_CONVEX_URL not set - Convex features disabled');
      return null;
    }
    return new ConvexReactClient(convexUrl);
  }, []);

  // If no Convex URL, render without Convex provider
  if (!convex) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  // If Clerk is not configured, use plain ConvexProvider without auth
  if (!isClerkConfigured) {
    return (
      <ConvexProvider client={convex}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ConvexProvider>
    );
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexProviderWithClerk>
  );
}
