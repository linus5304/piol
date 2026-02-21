'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OptionSelector } from '@/components/ui/option-selector';
import { PageHeader } from '@/components/ui/page-header';
import { SectionLabel } from '@/components/ui/section-label';
import { Switch } from '@/components/ui/switch';
import { useSafeUser } from '@/hooks/use-safe-auth';
import {
  type SettingsFormInput,
  type SettingsFormValues,
  createSettingsSchema,
  formatPhoneDisplay,
  toStoragePhone,
} from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@repo/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, isLoaded } = useSafeUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProfile = useMutation(api.users.updateProfile);
  const t = useTranslations();

  const schema = useMemo(() => createSettingsSchema(t), [t]);
  const form = useForm<SettingsFormInput, unknown, SettingsFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: '',
      role: (user?.unsafeMetadata?.role as 'renter' | 'landlord') || 'renter',
      language: 'fr',
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSubmitting(true);
    try {
      await user?.update({
        firstName: data.firstName,
        lastName: data.lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: data.role,
          onboardingCompleted: true,
        },
      });

      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: toStoragePhone(data.phone ?? ''),
        languagePreference: data.language,
        role: data.role,
      });

      if (data.phone?.trim()) {
        form.setValue('phone', formatPhoneDisplay(data.phone));
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <SectionLabel>{t('settings.personalInfo')}</SectionLabel>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings.firstName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings.lastName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.phone')}</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                        +237
                      </span>
                      <Input
                        type="tel"
                        placeholder={t('settings.phonePlaceholder')}
                        className="rounded-l-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                value={form.watch('role')}
                onChange={(v) => form.setValue('role', v as 'renter' | 'landlord')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.preferredLanguage')}</Label>
              <OptionSelector
                options={[
                  { value: 'fr', label: 'Français' },
                  { value: 'en', label: 'English' },
                ]}
                value={form.watch('language')}
                onChange={(v) => form.setValue('language', v as 'fr' | 'en')}
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
                  <p className="text-sm text-muted-foreground">
                    {t('settings.propertyAlertsDesc')}
                  </p>
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
      </Form>

      {/* Danger Zone hidden until account deletion is implemented */}
    </div>
  );
}
