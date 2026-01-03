import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

// Conditionally import Clerk
let useAuth: any = () => ({ isSignedIn: false });
let useOAuth: any = () => ({ startOAuthFlow: async () => ({}) });

try {
  const clerk = require('@clerk/clerk-expo');
  useAuth = clerk.useAuth;
  useOAuth = clerk.useOAuth;
} catch (e) {
  console.warn('Clerk not available - running in demo mode');
}

const isClerkConfigured = !!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('REPLACE_WITH');

export default function WelcomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isSignedIn } = isClerkConfigured ? useAuth() : { isSignedIn: false };
  const { startOAuthFlow: startGoogleOAuth } = isClerkConfigured 
    ? useOAuth({ strategy: 'oauth_google' }) 
    : { startOAuthFlow: async () => ({}) };

  useEffect(() => {
    if (isSignedIn) {
      router.replace('/(tabs)');
    }
  }, [isSignedIn, router]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const handleGoogleSignIn = async () => {
    if (!isClerkConfigured) {
      // Demo mode - just go to tabs
      router.replace('/(tabs)');
      return;
    }
    
    try {
      const { createdSessionId, setActive } = await startGoogleOAuth();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error('OAuth error:', err);
    }
  };

  const handleGetStarted = () => {
    if (!isClerkConfigured) {
      // Demo mode - skip auth, go to tabs
      router.replace('/(tabs)');
    } else {
      router.push('/(auth)/sign-up');
    }
  };

  const handleSignIn = () => {
    if (!isClerkConfigured) {
      // Demo mode - skip auth, go to tabs
      router.replace('/(tabs)');
    } else {
      router.push('/(auth)/sign-in');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.languageToggle} onPress={toggleLanguage}>
        <Text style={styles.languageToggleText}>
          {i18n.language === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
        </Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🏠</Text>
          <Text style={styles.appName}>Piol</Text>
        </View>

        <Text style={styles.title}>{t('welcome.title')}</Text>
        <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>{t('welcome.feature1')}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>{t('welcome.feature2')}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>{t('welcome.feature3')}</Text>
          </View>
        </View>

        {!isClerkConfigured && (
          <View style={styles.demoMode}>
            <Text style={styles.demoModeText}>🔧 Demo Mode</Text>
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.primaryButton} onPress={handleGetStarted}>
          <Text style={styles.primaryButtonText}>{t('welcome.getStarted')}</Text>
        </Pressable>

        {isClerkConfigured && (
          <Pressable style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Text style={styles.googleButtonText}>🔵 {t('auth.continueWithGoogle')}</Text>
          </Pressable>
        )}

        <Pressable style={styles.secondaryButton} onPress={handleSignIn}>
          <Text style={styles.secondaryButtonText}>{t('welcome.alreadyHaveAccount')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  languageToggle: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
  },
  languageToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF385C',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  features: {
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '700',
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
  },
  demoMode: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  demoModeText: {
    fontSize: 14,
    color: '#92400e',
  },
  buttons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FF385C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#FF385C',
    fontWeight: '500',
  },
});
