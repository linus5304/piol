import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { Slot } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../i18n';

// Token cache for Clerk using SecureStore
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      console.error('SecureStore get error:', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore save error:', error);
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = publishableKey && !publishableKey.includes('REPLACE_WITH');

if (!isClerkConfigured) {
  console.warn('⚠️ Clerk not configured - running in demo mode without authentication');
}

// Initialize Convex client
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const isConvexConfigured = convexUrl && !convexUrl.includes('REPLACE_WITH');
const convex = isConvexConfigured ? new ConvexReactClient(convexUrl) : null;

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// Wrapper for Convex + Clerk integration
function DataProviders({ children }: { children: React.ReactNode }) {
  // No Convex configured
  if (!convex) {
    return <>{children}</>;
  }

  // Convex configured but no Clerk
  if (!isClerkConfigured) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
  }

  // Both configured
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

// Main app content
function AppContent() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DataProviders>
          <QueryClientProvider client={queryClient}>
            <Slot />
            <StatusBar style="auto" />
          </QueryClientProvider>
        </DataProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Initialize app-level services here (analytics, notifications, etc.)
  }, []);

  // If Clerk is not configured, render without ClerkProvider
  if (!isClerkConfigured) {
    return <AppContent />;
  }

  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      <ClerkLoaded>
        <AppContent />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
