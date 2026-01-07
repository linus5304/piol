import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Check if Clerk is configured
const isClerkConfigured =
  !!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('REPLACE_WITH');

// Conditionally get Clerk auth state
let useClerkAuth: any = null;
if (isClerkConfigured) {
  try {
    const clerk = require('@clerk/clerk-expo');
    useClerkAuth = clerk.useAuth;
  } catch (e) {
    console.warn('Clerk not available');
  }
}

export default function Index() {
  const [isReady, setIsReady] = useState(false);

  // Use Clerk auth if available
  const clerkAuth = useClerkAuth ? useClerkAuth() : { isSignedIn: false, isLoaded: true };
  const { isSignedIn, isLoaded } = clerkAuth;

  useEffect(() => {
    // Small delay to ensure everything is initialized
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking auth
  if (!isReady || !isLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF385C" />
      </View>
    );
  }

  // In demo mode (no Clerk), always show welcome
  if (!isClerkConfigured) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // With Clerk configured, check if signed in
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
