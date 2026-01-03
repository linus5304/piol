import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../../stores/authStore';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { logout } = useAuthStore();

  const currentUser = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    await i18n.changeLanguage(newLang);
    if (currentUser) {
      await updateProfile({ languagePreference: newLang as 'fr' | 'en' });
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
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
            <Text style={styles.avatarText}>{currentUser?.firstName?.[0] ?? '?'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {currentUser?.firstName} {currentUser?.lastName}
            </Text>
            <Text style={styles.profileEmail}>{currentUser?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {t(`roles.${currentUser?.role ?? 'renter'}`)}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('profile.account')}</Text>

          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/edit')}>
            <Text style={styles.menuItemText}>{t('profile.editProfile')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>

          {currentUser?.role === 'landlord' && (
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push('/profile/my-properties')}
            >
              <Text style={styles.menuItemText}>{t('profile.myProperties')}</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </Pressable>
          )}

          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/transactions')}>
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
                trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
              />
            </View>
          </View>

          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/notifications')}>
            <Text style={styles.menuItemText}>{t('profile.notifications')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('profile.support')}</Text>

          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/help')}>
            <Text style={styles.menuItemText}>{t('profile.help')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/about')}>
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
    backgroundColor: '#2563eb',
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
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563eb',
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
