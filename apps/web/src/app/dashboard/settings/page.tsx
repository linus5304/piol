'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OptionSelector } from '@/components/ui/option-selector';
import { PageHeader } from '@/components/ui/page-header';
import { SectionLabel } from '@/components/ui/section-label';
import { Switch } from '@/components/ui/switch';
import { useSafeUser } from '@/hooks/use-safe-auth';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Cameroon phone: 9 digits starting with 6 (mobile) or 2 (landline).
 * Accepts with or without +237 prefix, with or without spaces/dashes.
 */
const CM_PHONE_RE = /^(?:\+?237\s*)?([62]\d{8})$/;

/** Strip non-digit chars except leading + */
function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, '');
}

/** Check if a raw phone string is a valid Cameroon number (or empty). */
function isValidCmPhone(raw: string): boolean {
  if (!raw.trim()) return true; // empty is OK (optional field)
  return CM_PHONE_RE.test(normalizePhone(raw));
}

/** Format digits into +237 6XX XXX XXX display format */
function formatPhoneDisplay(raw: string): string {
  const normalized = normalizePhone(raw);
  // Extract the 9-digit local number
  const match = normalized.match(CM_PHONE_RE);
  if (match) {
    const digits = match[1];
    return `+237 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`.trim();
  }
  return raw;
}

/** Extract the 9-digit local number for storage */
function toStoragePhone(raw: string): string | undefined {
  if (!raw.trim()) return undefined;
  const normalized = normalizePhone(raw);
  const match = normalized.match(CM_PHONE_RE);
  if (match) return `+237${match[1]}`;
  return undefined;
}

export default function SettingsPage() {
  const { user, isLoaded } = useSafeUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProfile = useMutation(api.users.updateProfile);

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [role, setRole] = useState<'renter' | 'landlord'>(
    (user?.unsafeMetadata?.role as 'renter' | 'landlord') || 'renter'
  );
  const t = useTranslations();

  // Validation errors (set on submit attempt)
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = t('settings.firstNameRequired');
    if (!lastName.trim()) next.lastName = t('settings.lastNameRequired');
    if (!isValidCmPhone(phone)) next.phone = t('settings.phoneInvalid');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      // Update Clerk user
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role,
          onboardingCompleted: true,
        },
      });

      // Update Convex user with phone, language, and role
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: toStoragePhone(phone),
        languagePreference: language,
        role,
      });

      // Format the phone display after successful save
      if (phone.trim()) {
        setPhone(formatPhoneDisplay(phone));
      }

      toast.success('Profil mis à jour avec succès!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <SectionLabel>{t('settings.personalInfo')}</SectionLabel>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('settings.firstName')}</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
                }}
                placeholder="Votre prénom"
                className={cn(errors.firstName && 'border-destructive')}
              />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('settings.lastName')}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
                }}
                placeholder="Votre nom"
                className={cn(errors.lastName && 'border-destructive')}
              />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('settings.email')}</Label>
            <Input
              id="email"
              type="email"
              value={user?.primaryEmailAddress?.emailAddress || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">{t('settings.emailManagedByAuth')}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('settings.phone')}</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                +237
              </span>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                placeholder={t('settings.phonePlaceholder')}
                className={cn('rounded-l-none', errors.phone && 'border-destructive')}
              />
            </div>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
        </div>

        <hr className="border-border" />

        {/* Preferences */}
        <div className="space-y-4">
          <SectionLabel>{t('settings.preferences')}</SectionLabel>
          <div className="space-y-2">
            <Label>{t('settings.accountType')}</Label>
            <OptionSelector
              options={[
                { value: 'renter', label: t('settings.renterAccount') },
                { value: 'landlord', label: t('settings.landlordAccount') },
              ]}
              value={role}
              onChange={(v) => setRole(v as 'renter' | 'landlord')}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('settings.preferredLanguage')}</Label>
            <OptionSelector
              options={[
                { value: 'fr', label: 'Français' },
                { value: 'en', label: 'English' },
              ]}
              value={language}
              onChange={(v) => setLanguage(v as 'fr' | 'en')}
            />
          </div>
        </div>

        <hr className="border-border" />

        {/* Notifications */}
        <div className="space-y-4">
          <SectionLabel>{t('settings.notifications')}</SectionLabel>
          <div className="divide-y divide-border/50">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium">{t('settings.emailNotifications')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('settings.emailNotificationsDesc')}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{t('settings.propertyAlerts')}</p>
                <p className="text-sm text-muted-foreground">{t('settings.propertyAlertsDesc')}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3 last:pb-0">
              <div>
                <p className="text-sm font-medium">{t('settings.newsletter')}</p>
                <p className="text-sm text-muted-foreground">{t('settings.newsletterDesc')}</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('settings.saving') : t('settings.saveChanges')}
          </Button>
        </div>
      </form>

      {/* Danger Zone hidden until account deletion is implemented */}
    </div>
  );
}
