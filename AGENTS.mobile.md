# Mobile Agent Instructions — Expo/React Native

> For AI agents and developers working on `apps/mobile`

## Architecture Overview

```
apps/mobile/
├── app/                    # Expo Router (file-based routing)
│   ├── _layout.tsx         # Root layout (providers, fonts)
│   ├── index.tsx           # Entry redirect
│   ├── (auth)/             # Auth stack
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/             # Main tab navigator
│   │   ├── _layout.tsx     # Tab bar configuration
│   │   ├── index.tsx       # Home (property feed)
│   │   ├── search.tsx      # Search
│   │   ├── saved.tsx       # Saved properties
│   │   ├── messages.tsx    # Conversations
│   │   └── profile.tsx     # User profile
│   └── property/
│       └── [id].tsx        # Property detail (dynamic route)
├── components/             # Reusable components
├── hooks/                  # Custom hooks
├── stores/                 # Zustand stores
├── lib/                    # Utilities
├── i18n/                   # Internationalization
│   ├── index.ts            # i18next setup
│   └── locales/            # Translation files
└── assets/                 # Images, fonts
```

## Core Principles

### 1. Expo Router Navigation

File-based routing similar to Next.js:

```typescript
// app/(tabs)/_layout.tsx - Tab navigator
import { Tabs } from 'expo-router';
import { Home, Search, Heart, MessageCircle, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF385C',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      {/* More tabs... */}
    </Tabs>
  );
}
```

### 2. Dynamic Routes

```typescript
// app/property/[id].tsx
import { useLocalSearchParams, Stack } from 'expo-router';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Fetch property data
  const property = useQuery(api.properties.getProperty, { 
    propertyId: id as Id<'properties'> 
  });
  
  return (
    <>
      <Stack.Screen options={{ title: property?.title ?? 'Property' }} />
      {/* Screen content */}
    </>
  );
}
```

### 3. Navigation Patterns

```typescript
import { useRouter, Link } from 'expo-router';

// Imperative navigation
const router = useRouter();
router.push('/property/123');
router.replace('/sign-in');
router.back();

// Declarative navigation
<Link href="/property/123" asChild>
  <Pressable>
    <Text>View Property</Text>
  </Pressable>
</Link>
```

## Data Layer

### Convex Integration

```typescript
// app/_layout.tsx - Provider setup
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Stack />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

### Using Queries

```typescript
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function HomeScreen() {
  const result = useQuery(api.properties.listProperties, { limit: 20 });
  
  // Loading state
  if (result === undefined) {
    return <LoadingScreen />;
  }
  
  return (
    <FlashList
      data={result.properties}
      renderItem={({ item }) => <PropertyCard property={item} />}
      estimatedItemSize={280}
    />
  );
}
```

### Using Mutations

```typescript
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export function ContactLandlordButton({ landlordId, propertyId }) {
  const sendMessage = useMutation(api.messages.sendMessage);
  const [loading, setLoading] = useState(false);
  
  const handlePress = async () => {
    setLoading(true);
    try {
      await sendMessage({
        recipientId: landlordId,
        propertyId,
        messageText: 'Hello, I am interested in this property.',
      });
      router.push('/messages');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Pressable 
      onPress={handlePress} 
      disabled={loading}
      style={styles.button}
    >
      <Text>{loading ? 'Sending...' : 'Contact Landlord'}</Text>
    </Pressable>
  );
}
```

## State Management

### Zustand for Global State

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: user !== null,
        isLoading: false,
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
```

### Usage Pattern

```typescript
// In components
import { useAuthStore } from '../stores/authStore';

export function ProfileScreen() {
  const { user, logout } = useAuthStore();
  
  if (!user) {
    return <SignInPrompt />;
  }
  
  return (
    <View>
      <Text>Welcome, {user.firstName}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

## Component Patterns

### StyleSheet Organization

```typescript
import { StyleSheet, View, Text, Pressable } from 'react-native';

export function PropertyCard({ property, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: property.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.location}>
          {property.neighborhood}, {property.city}
        </Text>
        <Text style={styles.price}>
          {formatCurrency(property.rentAmount)} FCFA/mois
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF385C',
    marginTop: 8,
  },
});
```

### Design Tokens

```typescript
// lib/tokens.ts
export const colors = {
  primary: '#FF385C',
  primaryDark: '#E31C5F',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  success: '#008A05',
  error: '#dc2626',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '600' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
};

// Usage
const styles = StyleSheet.create({
  title: {
    ...typography.h2,
    color: colors.text,
  },
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
});
```

### Reusable Components

```typescript
// components/Button.tsx
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../lib/tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.background,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: colors.text,
  },
  outlineText: {
    color: colors.text,
  },
});
```

## Lists & Performance

### FlashList for Large Lists

```typescript
import { FlashList } from '@shopify/flash-list';

export function PropertyList({ properties }) {
  const renderItem = useCallback(({ item }) => (
    <PropertyCard 
      property={item} 
      onPress={() => router.push(`/property/${item._id}`)} 
    />
  ), []);
  
  const keyExtractor = useCallback((item) => item._id, []);
  
  return (
    <FlashList
      data={properties}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={280} // Approximate item height
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<EmptyState message="No properties found" />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
}
```

### Pull to Refresh

```typescript
export function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const result = useQuery(api.properties.listProperties, { limit: 20 });
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Convex auto-refetches, just show indicator
    setTimeout(() => setRefreshing(false), 1000);
  }, []);
  
  return (
    <FlashList
      data={result?.properties ?? []}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
      // ...
    />
  );
}
```

### Pagination

```typescript
export function PropertyList() {
  const [cursor, setCursor] = useState<string | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  
  const result = useQuery(api.properties.listProperties, { 
    limit: 20,
    cursor: cursor ?? undefined,
  });
  
  useEffect(() => {
    if (result?.properties) {
      setAllProperties(prev => 
        cursor ? [...prev, ...result.properties] : result.properties
      );
    }
  }, [result, cursor]);
  
  const loadMore = useCallback(() => {
    if (result?.nextCursor) {
      setCursor(result.nextCursor);
    }
  }, [result?.nextCursor]);
  
  return (
    <FlashList
      data={allProperties}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        result?.nextCursor ? <ActivityIndicator style={{ padding: 16 }} /> : null
      }
      // ...
    />
  );
}
```

## Internationalization

### i18next Setup

```typescript
// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import fr from './locales/fr.json';

const resources = { en: { translation: en }, fr: { translation: fr } };

// Get device language, default to French
const deviceLang = Localization.locale.split('-')[0];
const defaultLang = ['en', 'fr'].includes(deviceLang) ? deviceLang : 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang,
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
  });

export default i18n;
```

### Using Translations

```typescript
import { useTranslation } from 'react-i18next';

export function HomeScreen() {
  const { t } = useTranslation();
  
  return (
    <SafeAreaView>
      <Text style={styles.title}>{t('home.title')}</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      
      {/* With interpolation */}
      <Text>{t('common.price', { amount: formatCurrency(150000) })}</Text>
    </SafeAreaView>
  );
}
```

### Translation Files

```json
// i18n/locales/fr.json
{
  "home": {
    "title": "Trouvez votre logement",
    "subtitle": "Annonces vérifiées au Cameroun",
    "noProperties": "Aucune annonce disponible"
  },
  "common": {
    "loading": "Chargement...",
    "price": "{{amount}} FCFA/mois",
    "save": "Sauvegarder",
    "contact": "Contacter"
  },
  "filters": {
    "all": "Tous",
    "verified": "Vérifiés",
    "nearMe": "Près de moi"
  },
  "propertyTypes": {
    "studio": "Studio",
    "1br": "1 Chambre",
    "2br": "2 Chambres",
    "house": "Maison",
    "villa": "Villa"
  }
}
```

## Authentication with Clerk

### Sign In Screen

```typescript
// app/(auth)/sign-in.tsx
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSignIn = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Error', error.errors?.[0]?.message ?? 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <Button 
        title="Sign In" 
        onPress={handleSignIn} 
        loading={loading}
      />
      
      <Link href="/sign-up" asChild>
        <Pressable>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
```

### Protected Routes

```typescript
// app/(tabs)/_layout.tsx
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <LoadingScreen />;
  }
  
  if (!isSignedIn) {
    return <Redirect href="/welcome" />;
  }
  
  return <Tabs>{/* ... */}</Tabs>;
}
```

## Forms & Input

### Input Validation

```typescript
import { useState } from 'react';

export function ContactForm({ recipientId, propertyId }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const sendMessage = useMutation(api.messages.sendMessage);
  
  const validate = () => {
    if (message.trim().length < 10) {
      setError('Message must be at least 10 characters');
      return false;
    }
    setError(null);
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      await sendMessage({
        recipientId,
        propertyId,
        messageText: message.trim(),
      });
      setMessage('');
      // Navigate or show success
    } catch (err) {
      setError('Failed to send message');
    }
  };
  
  return (
    <View>
      <TextInput
        value={message}
        onChangeText={(text) => {
          setMessage(text);
          if (error) setError(null);
        }}
        placeholder="Write your message..."
        multiline
        style={[styles.input, error && styles.inputError]}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Send" onPress={handleSubmit} />
    </View>
  );
}
```

### Debounced Search

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage in search
export function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  const results = useQuery(
    api.properties.searchProperties,
    debouncedQuery.length >= 2 
      ? { searchQuery: debouncedQuery } 
      : 'skip'
  );
  
  return (
    <SafeAreaView>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search properties..."
        style={styles.searchInput}
      />
      {results === undefined ? (
        <ActivityIndicator />
      ) : (
        <FlashList data={results} /* ... */ />
      )}
    </SafeAreaView>
  );
}
```

## Images

### Expo Image

```typescript
import { Image } from 'expo-image';

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export function PropertyImage({ uri, style }) {
  return (
    <Image
      source={{ uri }}
      style={style}
      placeholder={blurhash}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
    />
  );
}
```

### Image with Fallback

```typescript
export function PropertyImage({ uri, style }) {
  const [error, setError] = useState(false);
  
  if (error || !uri) {
    return (
      <View style={[style, styles.placeholder]}>
        <ImageOff size={32} color={colors.textSecondary} />
      </View>
    );
  }
  
  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit="cover"
      onError={() => setError(true)}
    />
  );
}
```

## Accessibility

### Touch Targets

```typescript
// ✅ Good: 44x44 minimum touch target
<Pressable
  onPress={handlePress}
  style={styles.iconButton}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  accessibilityLabel="Save property"
  accessibilityRole="button"
>
  <Heart size={24} />
</Pressable>

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### Screen Reader Support

```typescript
<View
  accessible={true}
  accessibilityLabel={`${property.title}, ${formatCurrency(property.rentAmount)} per month in ${property.city}`}
>
  <Text>{property.title}</Text>
  <Text>{formatCurrency(property.rentAmount)} FCFA/mois</Text>
</View>
```

## Testing

### Component Tests

```typescript
// __tests__/PropertyCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PropertyCard } from '../components/PropertyCard';

const mockProperty = {
  _id: '1',
  title: 'Test Property',
  propertyType: '2br',
  rentAmount: 150000,
  city: 'Douala',
  neighborhood: 'Bonapriso',
};

describe('PropertyCard', () => {
  it('renders property title', () => {
    render(<PropertyCard property={mockProperty} onPress={jest.fn()} />);
    expect(screen.getByText('Test Property')).toBeTruthy();
  });
  
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<PropertyCard property={mockProperty} onPress={onPress} />);
    
    fireEvent.press(screen.getByText('Test Property'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## Checklist for New Screens

- [ ] SafeAreaView wrapping content
- [ ] Loading state with skeleton/spinner
- [ ] Error handling with user-friendly messages
- [ ] Empty state when no data
- [ ] Pull-to-refresh for lists
- [ ] Translations used (no hardcoded strings)
- [ ] Proper keyboard handling (KeyboardAvoidingView)
- [ ] Touch targets at least 44x44
- [ ] Accessibility labels on interactive elements
- [ ] Navigation title set via Stack.Screen
- [ ] Android back button handled (if needed)
- [ ] Tested on both iOS and Android
