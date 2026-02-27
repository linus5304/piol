'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { RequireRole, usePermissions } from '@/hooks/use-permissions';
import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA, formatDate } from '@/lib/i18n-format';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useLocale, useTranslations } from 'gt-next/client';
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  User,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function formatVerificationDate(timestamp: number, locale: string): string {
  return formatDate(timestamp, locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatVerificationCurrency(amount: number, locale: string): string {
  return formatCurrencyFCFA(amount, locale);
}

const statusConfig = {
  pending: {
    labelKey: 'verify.statusPending',
    icon: Clock,
    color: 'bg-warning/10 text-warning',
  },
  in_progress: {
    labelKey: 'verify.statusInProgress',
    icon: Shield,
    color: 'bg-primary/10 text-primary',
  },
  approved: {
    labelKey: 'verify.statusApproved',
    icon: CheckCircle,
    color: 'bg-success/10 text-success',
  },
  rejected: {
    labelKey: 'verify.statusRejected',
    icon: XCircle,
    color: 'bg-destructive/10 text-destructive',
  },
};

function VerifyDashboardContent() {
  const locale = parseAppLocale(useLocale());
  const t = useTranslations();
  const router = useRouter();
  const { isVerifier, isLoaded, role } = usePermissions();
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Redirect if not verifier
  useEffect(() => {
    if (isLoaded && !isVerifier) {
      router.push('/dashboard');
    }
  }, [isLoaded, isVerifier, router]);

  // Fetch pending verifications
  const pendingProperties = useQuery(api.verifications.getPendingVerifications, {
    city: cityFilter !== 'all' ? cityFilter : undefined,
  });

  // Fetch my verifications
  const myVerifications = useQuery(api.verifications.getMyVerifications, {});

  // Fetch verification stats (admin only)
  const stats = useQuery(api.verifications.getVerificationStats);

  // Get unique cities for filter
  const cities = [...new Set(pendingProperties?.map((p) => p.city) ?? [])].sort();

  if (!isLoaded || !isVerifier) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t('verify.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('verify.subtitle')}</p>
        </div>
        <Badge className="bg-accent text-accent-foreground w-fit">
          <Shield className="w-3 h-3 mr-1" />
          {t('verify.verifierBadge')}
        </Badge>
      </div>

      {/* Stats Cards (Admin only) */}
      {stats && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('verify.statsPending')}</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tabular-nums text-warning">
                {stats.propertiesPendingVerification}
              </div>
              <p className="text-xs text-muted-foreground">{t('verify.statsPropertiesToVerify')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('verify.statsInProgress')}</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tabular-nums">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                {t('verify.statsVerificationsInProgress')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('verify.statsApproved')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tabular-nums text-success">
                {stats.approved}
              </div>
              <p className="text-xs text-muted-foreground">{t('verify.statsThisMonth')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('verify.statsRejected')}</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tabular-nums text-destructive">
                {stats.rejected}
              </div>
              <p className="text-xs text-muted-foreground">{t('verify.statsThisMonth')}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending Verifications */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                {t('verify.pendingTitle')}
              </CardTitle>
              <CardDescription>{t('verify.pendingDesc')}</CardDescription>
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('verify.allCities')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('verify.allCities')}</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {pendingProperties === undefined ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : pendingProperties.length > 0 ? (
            <div className="space-y-3">
              {pendingProperties.map((property) => (
                <div
                  key={property._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium truncate">{property.title}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.neighborhood}, {property.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {property.landlord?.firstName || t('verify.unknownLandlord')}{' '}
                        {property.landlord?.lastName || ''}
                      </span>
                      <span className="font-mono tabular-nums">
                        {formatVerificationCurrency(property.rentAmount, locale)}/mois
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('verify.submittedOn', {
                        date: formatVerificationDate(property._creationTime, locale),
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {property.existingVerification ? (
                      <Badge
                        className={
                          statusConfig[
                            property.existingVerification.status as keyof typeof statusConfig
                          ]?.color || ''
                        }
                      >
                        {statusConfig[
                          property.existingVerification.status as keyof typeof statusConfig
                        ]?.labelKey
                          ? t(
                              statusConfig[
                                property.existingVerification.status as keyof typeof statusConfig
                              ].labelKey
                            )
                          : property.existingVerification.status}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">{t('verify.notAssigned')}</Badge>
                    )}
                    <Link href={`/dashboard/verify/${property._id}`}>
                      <Button size="sm">{t('admin.verify')}</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success opacity-50" />
              <h3 className="text-lg font-medium mb-1">{t('verify.noPendingVerifications')}</h3>
              <p>{t('verify.allPropertiesProcessed')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Verifications */}
      {myVerifications && myVerifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('verify.myRecentVerifications')}</CardTitle>
            <CardDescription>{t('verify.myVerificationsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myVerifications.slice(0, 5).map((verification) => {
                const config = statusConfig[verification.status as keyof typeof statusConfig];
                const StatusIcon = config?.icon || Clock;
                return (
                  <div
                    key={verification._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config?.color || 'bg-muted'}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{verification.property?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {verification.property?.city} •{' '}
                          {formatVerificationDate(verification._creationTime, locale)}
                        </p>
                      </div>
                    </div>
                    <Badge className={config?.color || ''}>
                      {config?.labelKey ? t(config.labelKey) : verification.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function VerifyAccessDeniedFallback() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">{t('common.accessDenied')}</h2>
      <p className="text-muted-foreground mb-4">{t('common.accessDeniedDesc')}</p>
      <Link href="/dashboard">
        <Button>{t('common.backToDashboard')}</Button>
      </Link>
    </div>
  );
}

export default function VerifyDashboardPage() {
  return (
    <RequireRole roles={['admin', 'verifier']} fallback={<VerifyAccessDeniedFallback />}>
      <VerifyDashboardContent />
    </RequireRole>
  );
}
