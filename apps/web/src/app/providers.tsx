'use client';

import { env, isClerkConfigured, isConvexConfigured } from '@/lib/env';
import { useAuth } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ThemeProvider } from 'next-themes';
import { type ReactNode, useMemo, useState } from 'react';

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
    if (!isConvexConfigured) {
      console.warn('⚠️ NEXT_PUBLIC_CONVEX_URL not set - Convex features disabled');
      return null;
    }
    return new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL!);
  }, []);

  // If no Convex URL, render without Convex provider
  if (!convex) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    );
  }

  // If Clerk is not configured, use plain ConvexProvider without auth
  if (!isClerkConfigured) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ConvexProvider client={convex}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ConvexProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ConvexProviderWithClerk>
    </ThemeProvider>
  );
}
