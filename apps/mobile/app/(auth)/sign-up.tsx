import { useSignUp, useAuth } from '@clerk/clerk-expo';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'renter' | 'landlord'>(
    (params.role as 'renter' | 'landlord') || 'renter'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (isSignedIn) {
      router.replace('/(tabs)');
    }
  }, [isSignedIn, router]);

  const handleSignUp = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        unsafeMetadata: { role },
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.errors?.[0]?.message || t('auth.signUpError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || t('auth.verificationError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>📧</Text>
            <Text style={styles.title}>{t('auth.verifyEmail')}</Text>
            <Text style={styles.subtitle}>{t('auth.verifyEmailSubtitle')}</Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.verificationCode')}</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <Pressable
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleVerification}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>{t('auth.verify')}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← {t('common.back')}</Text>
          </Pressable>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.logo}>🏠</Text>
              <Text style={styles.title}>{t('auth.createAccount')}</Text>
              <Text style={styles.subtitle}>{t('auth.createAccountSubtitle')}</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <Pressable
                style={[styles.roleButton, role === 'renter' && styles.roleButtonActive]}
                onPress={() => setRole('renter')}
              >
                <Text style={styles.roleIcon}>🔍</Text>
                <Text style={[styles.roleText, role === 'renter' && styles.roleTextActive]}>
                  {t('auth.iAmRenter')}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.roleButton, role === 'landlord' && styles.roleButtonActive]}
                onPress={() => setRole('landlord')}
              >
                <Text style={styles.roleIcon}>🔑</Text>
                <Text style={[styles.roleText, role === 'landlord' && styles.roleTextActive]}>
                  {t('auth.iAmLandlord')}
                </Text>
              </Pressable>
            </View>

            <View style={styles.form}>
              <View style={styles.nameRow}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.label}>{t('auth.firstName')}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Jean"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoComplete="given-name"
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.label}>{t('auth.lastName')}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Kamga"
                    value={lastName}
                    onChangeText={setLastName}
                    autoComplete="family-name"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('auth.email')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('auth.password')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="new-password"
                />
                <Text style={styles.passwordHint}>{t('auth.passwordRequirements')}</Text>
              </View>

              <Pressable
                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signUpButtonText}>{t('auth.signUp')}</Text>
                )}
              </Pressable>
            </View>

            <Text style={styles.terms}>
              {t('auth.bySigningUp')}{' '}
              <Text style={styles.termsLink}>{t('auth.termsOfService')}</Text>
              {' '}{t('common.and')}{' '}
              <Text style={styles.termsLink}>{t('auth.privacyPolicy')}</Text>
            </Text>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{t('auth.alreadyHaveAccount')}</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text style={styles.footerLink}>{t('auth.signIn')}</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#FF385C',
    backgroundColor: '#fef2f2',
  },
  roleIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  roleTextActive: {
    color: '#FF385C',
  },
  form: {
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  passwordHint: {
    fontSize: 12,
    color: '#9ca3af',
  },
  signUpButton: {
    backgroundColor: '#FF385C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  terms: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  termsLink: {
    color: '#FF385C',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  footerLink: {
    fontSize: 14,
    color: '#FF385C',
    fontWeight: '600',
  },
});

