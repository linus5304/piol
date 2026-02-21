'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OptionSelector } from '@/components/ui/option-selector';
import { PageHeader } from '@/components/ui/page-header';
import { SectionLabel } from '@/components/ui/section-label';
import { Switch } from '@/components/ui/switch';
import { useSafeUser } from '@/hooks/use-safe-auth';
import { api } from '@repo/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useState } from 'react';
import { toast } from 'sonner';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update Clerk user
      await user?.update({
        firstName,
        lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role,
          onboardingCompleted: true,
        },
      });

      // Update Convex user with phone and language preference
      await updateProfile({
        firstName,
        lastName,
        phone: phone || undefined,
        languagePreference: language,
      });

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
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Votre prénom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('settings.lastName')}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Votre nom"
              />
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
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+237 6XX XXX XXX"
            />
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
