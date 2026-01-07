import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Conditionally import Convex
let api: any = null;
let useQuery: any = () => null;
let useMutation: any = () => async () => {};

try {
  api = require('../../convex/_generated/api').api;
  const convex = require('convex/react');
  useQuery = convex.useQuery;
  useMutation = convex.useMutation;
} catch (e) {
  console.warn('Convex not available');
}

// Check if Clerk is configured
const isClerkConfigured =
  !!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY &&
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

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Use Clerk signOut if available
  const clerkAuth = useClerkAuth ? useClerkAuth() : { signOut: null };

  // Use Convex if available
  const currentUser = api ? useQuery(api.users.getCurrentUser) : null;
  const updateProfile = api ? useMutation(api.users.updateProfile) : async () => {};

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    await i18n.changeLanguage(newLang);
    if (currentUser && api) {
      try {
        await updateProfile({ languagePreference: newLang as 'fr' | 'en' });
      } catch (e) {
        console.warn('Failed to update language preference');
      }
    }
  };

  const handleLogout = async () => {
    if (clerkAuth.signOut) {
      try {
        await clerkAuth.signOut();
      } catch (e) {
        console.warn('Clerk signOut failed');
      }
    }
    router.replace('/(auth)/welcome');
  };

  // Demo user for when Convex is not available
  const displayUser = currentUser ?? {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@piol.app',
    role: 'renter',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.title')}</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayUser.firstName?.[0] ?? '?'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {displayUser.firstName} {displayUser.lastName}
            </Text>
            <Text style={styles.profileEmail}>{displayUser.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{t(`roles.${displayUser.role ?? 'renter'}`)}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('profile.account')}</Text>

          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/edit' as any)}>
            <Text style={styles.menuItemText}>{t('profile.editProfile')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>

          {displayUser.role === 'landlord' && (
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/profile/my-properties' as any)}
            >
              <Text style={styles.menuItemText}>{t('profile.myProperties')}</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/profile/transactions' as any)}
          >
            <Text style={styles.menuItemText}>{t('profile.transactions')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('profile.settings')}</Text>

          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>{t('profile.language')}</Text>
            <View style={styles.languageSwitch}>
              <Text style={styles.languageLabel}>{i18n.language === 'fr' ? 'FR' : 'EN'}</Text>
              <Switch
                value={i18n.language === 'en'}
                onValueChange={toggleLanguage}
                trackColor={{ false: '#e5e7eb', true: '#FF385C' }}
              />
            </View>
          </View>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/profile/notifications' as any)}
          >
            <Text style={styles.menuItemText}>{t('profile.notifications')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('profile.support')}</Text>

          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/help' as any)}>
            <Text style={styles.menuItemText}>{t('profile.help')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/about' as any)}>
            <Text style={styles.menuItemText}>{t('profile.about')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
        </Pressable>

        <Text style={styles.version}>v0.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: '#fce7f3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF385C',
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuItemText: {
    fontSize: 16,
    color: '#111827',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
  languageSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  logoutButton: {
    backgroundColor: '#fee2e2',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 24,
    marginBottom: 40,
  },
});
