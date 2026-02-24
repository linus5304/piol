'use client';

import { LandlordApplicationForm } from '@/components/landlord-application-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { cn } from '@/lib/utils';
import {
  type SettingsFormInput,
  type SettingsFormValues,
  createSettingsSchema,
  formatPhoneDisplay,
  toStoragePhone,
} from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@repo/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useTranslations } from 'gt-next';
import { AlertTriangle, Building2, CheckCircle, Clock, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr] md:gap-8">
      <div className="space-y-1">
        <SectionLabel>{title}</SectionLabel>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const options = [
    { value: 'light', label: t('settings.themeLight'), icon: Sun },
    { value: 'dark', label: t('settings.themeDark'), icon: Moon },
    { value: 'system', label: t('settings.themeSystem'), icon: Monitor },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
            mounted && theme === value
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const { user, isLoaded } = useSafeUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const updateProfile = useMutation(api.users.updateProfile);
  const t = useTranslations();

  const myApplication = useQuery(api.landlordApplications.getMyLandlordApplication);
  const convexUser = useQuery(api.users.getCurrentUser);
  const currentRole = (user?.unsafeMetadata?.role as string) || 'renter';

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
          onboardingCompleted: true,
        },
      });

      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: toStoragePhone(data.phone ?? ''),
        languagePreference: data.language,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
          {/* Personal Information */}
          <SettingsSection
            title={t('settings.personalInfo')}
            description={t('settings.updateInfo')}
          >
            <div className="space-y-4">
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
          </SettingsSection>

          <hr className="border-border" />

          {/* Preferences */}
          <SettingsSection
            title={t('settings.preferences')}
            description={t('settings.customizeExperience')}
          >
            <div className="space-y-4">
              {/* Account Type / Landlord Application Status */}
              <div className="space-y-2">
                <Label>{t('settings.accountType')}</Label>

                {currentRole === 'landlord' ? (
                  <Card>
                    <CardContent className="flex items-center gap-3 py-3 px-4">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t('settings.landlordAccount')}</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        {t('settings.accountType')}
                      </Badge>
                    </CardContent>
                  </Card>
                ) : myApplication?.status === 'pending' ? (
                  <Card className="border-warning/50 bg-warning/5">
                    <CardContent className="flex items-center gap-3 py-3 px-4">
                      <Clock className="h-5 w-5 text-warning" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {t('landlordApplication.statusPending')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('landlordApplication.statusPendingDesc')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : myApplication?.status === 'rejected' ? (
                  <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="py-3 px-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {t('landlordApplication.statusRejected')}
                          </p>
                          {myApplication.rejectionReason && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {myApplication.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            {t('landlordApplication.reapply')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{t('landlordApplication.title')}</DialogTitle>
                          </DialogHeader>
                          <LandlordApplicationForm
                            onComplete={() => {
                              setApplicationDialogOpen(false);
                              toast.success(t('landlordApplication.successTitle'));
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <Card>
                      <CardContent className="flex items-center gap-3 py-3 px-4">
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm flex-1">{t('settings.renterAccount')}</p>
                      </CardContent>
                    </Card>
                    <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Building2 className="h-4 w-4 mr-2" />
                          {t('landlordApplication.applyButton')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{t('landlordApplication.title')}</DialogTitle>
                        </DialogHeader>
                        <LandlordApplicationForm
                          onComplete={() => {
                            setApplicationDialogOpen(false);
                            toast.success(t('landlordApplication.successTitle'));
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
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
          </SettingsSection>

          <hr className="border-border" />

          {/* Appearance */}
          <SettingsSection
            title={t('settings.appearance')}
            description={t('settings.appearanceDesc')}
          >
            <AppearanceSection />
          </SettingsSection>

          <hr className="border-border" />

          {/* Notifications */}
          <SettingsSection
            title={t('settings.notifications')}
            description={t('settings.manageNotifications')}
          >
            <div className="divide-y divide-border/50">
              <div className="flex items-center justify-between py-3 first:pt-0">
                <div>
                  <p className="text-sm font-medium">{t('settings.inAppNotifications')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.inAppNotificationsDesc')}
                  </p>
                </div>
                <Switch
                  checked={convexUser?.notificationsEnabled !== false}
                  onCheckedChange={(checked) => updateProfile({ notificationsEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-3 opacity-50 pointer-events-none">
                <div>
                  <p className="text-sm font-medium">{t('settings.emailNotifications')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.emailNotificationsDesc')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{t('settings.comingSoon')}</Badge>
                  <Switch disabled />
                </div>
              </div>
              <div className="flex items-center justify-between py-3 opacity-50 pointer-events-none">
                <div>
                  <p className="text-sm font-medium">{t('settings.propertyAlerts')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.propertyAlertsDesc')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{t('settings.comingSoon')}</Badge>
                  <Switch disabled />
                </div>
              </div>
              <div className="flex items-center justify-between py-3 last:pb-0 opacity-50 pointer-events-none">
                <div>
                  <p className="text-sm font-medium">{t('settings.newsletter')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings.newsletterDesc')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{t('settings.comingSoon')}</Badge>
                  <Switch disabled />
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('settings.saving') : t('settings.saveChanges')}
            </Button>
          </div>
        </form>
      </Form>

      <hr className="max-w-3xl border-border" />

      {/* Danger Zone */}
      <div className="max-w-3xl">
        <SettingsSection
          title={t('settings.dangerZone')}
          description={t('settings.dangerZoneDesc')}
        >
          <Card className="border-destructive/50">
            <CardContent className="flex items-center justify-between py-4 px-4">
              <div>
                <p className="text-sm font-medium">{t('settings.deleteAccount')}</p>
                <p className="text-xs text-muted-foreground">{t('settings.comingSoon')}</p>
              </div>
              <Button variant="destructive" size="sm" disabled>
                {t('settings.deleteAccount')}
              </Button>
            </CardContent>
          </Card>
        </SettingsSection>
      </div>
    </div>
  );
}
