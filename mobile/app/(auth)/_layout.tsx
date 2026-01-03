import { Redirect, Stack } from 'expo-router';

// Check if Clerk is configured
const isClerkConfigured = !!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('REPLACE_WITH');

// Conditionally import Clerk
let useClerkAuth: any = null;
if (isClerkConfigured) {
  try {
    const clerk = require('@clerk/clerk-expo');
    useClerkAuth = clerk.useAuth;
  } catch (e) {
    console.warn('Clerk not available');
  }
}

export default function AuthLayout() {
  // Use Clerk auth if available
  const auth = useClerkAuth ? useClerkAuth() : { isSignedIn: false, isLoaded: true };
  const { isSignedIn, isLoaded } = auth;

  // If the user is signed in, redirect to the main app
  if (isLoaded && isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
