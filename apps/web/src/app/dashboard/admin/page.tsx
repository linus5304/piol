'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RequireRole, usePermissions } from '@/hooks/use-permissions';
import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA, formatDate } from '@/lib/i18n-format';
import { ROLE_COLORS, ROLE_KEYS, type UserRole } from '@/lib/permissions';
import { api } from '@repo/convex/_generated/api';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { useLocale, useTranslations } from 'gt-next/client';
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  FileCheck,
  MessageSquare,
  Shield,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function formatAdminDate(timestamp: number, locale: string): string {
  return formatDate(timestamp, locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatAdminCurrency(amount: number, locale: string): string {
  return formatCurrencyFCFA(amount, locale);
}

function AdminDashboardContent() {
  const locale = parseAppLocale(useLocale());
  const t = useTranslations();
  const router = useRouter();
  const { isAdmin, isLoaded, role } = usePermissions();

  // Redirect non-admins
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      router.push('/dashboard');
    }
  }, [isLoaded, isAdmin, router]);

  // Fetch admin stats
  const adminStats = useQuery(api.users.getAdminStats);

  // Fetch recent users
  const { results: recentUsers, status: usersStatus } = usePaginatedQuery(
    api.users.listUsers,
    {},
    { initialNumItems: 5 }
  );

  // Fetch properties pending verification
  const pendingProperties = useQuery(api.properties.getPendingVerification);

  // Fetch pending landlord applications
  const pendingApplications = useQuery(api.landlordApplications.getPendingApplications);

  if (!isLoaded || !isAdmin) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
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
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t('admin.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.subtitle')}</p>
        </div>
        <Badge className={ROLE_COLORS.admin}>
          <Shield className="w-3 h-3 mr-1" />
          {t(ROLE_KEYS.admin)}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.statsUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              {adminStats?.totalUsers ?? '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('admin.statsNewThisMonth', { count: adminStats?.newUsersThisMonth ?? 0 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.statsProperties')}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              {adminStats?.totalProperties ?? '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('admin.statsActive', { count: adminStats?.activeProperties ?? 0 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.statsApplications')}</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-warning">
              {adminStats?.pendingApplications ?? '-'}
            </div>
            <p className="text-xs text-muted-foreground">{t('admin.statsPendingReview')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.statsVerifications')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-warning">
              {adminStats?.pendingVerifications ?? '-'}
            </div>
            <p className="text-xs text-muted-foreground">{t('admin.statsPropertiesToVerify')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.statsTransactions')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              {adminStats?.totalTransactions
                ? formatAdminCurrency(adminStats.totalTransactions, locale)
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground">{t('admin.statsTotalVolume')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('admin.recentUsers')}</CardTitle>
                <CardDescription>{t('admin.recentUsersDesc')}</CardDescription>
              </div>
              <Link href="/dashboard/admin/users">
                <Button variant="outline" size="sm">
                  {t('common.viewAll')}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {usersStatus === 'LoadingFirstPage' ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.tableUser')}</TableHead>
                    <TableHead>{t('admin.tableRole')}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {t('admin.tableRegistered')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={ROLE_COLORS[user.role as UserRole] || ''}
                        >
                          {ROLE_KEYS[user.role as UserRole]
                            ? t(ROLE_KEYS[user.role as UserRole])
                            : user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {formatAdminDate(user._creationTime, locale)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>{t('admin.noUsers')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('admin.recentApplications')}</CardTitle>
                <CardDescription>{t('admin.recentApplicationsDesc')}</CardDescription>
              </div>
              <Link href="/dashboard/admin/applications">
                <Button variant="outline" size="sm">
                  {t('common.viewAll')}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {pendingApplications === undefined ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : pendingApplications.length > 0 ? (
              <div className="space-y-3">
                {pendingApplications.slice(0, 5).map((app) => (
                  <div
                    key={app._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {app.user?.firstName?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {app.user?.firstName} {app.user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatAdminDate(app._creationTime, locale)}
                        </p>
                      </div>
                    </div>
                    <Link href={`/dashboard/admin/applications/${app._id}`}>
                      <Button variant="ghost" size="sm">
                        {t('admin.view')}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>{t('admin.noPendingApplications')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('admin.pendingVerifications')}</CardTitle>
                <CardDescription>{t('admin.statsPropertiesToVerify')}</CardDescription>
              </div>
              <Link href="/dashboard/verify">
                <Button variant="outline" size="sm">
                  {t('common.viewAll')}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {pendingProperties === undefined ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : pendingProperties && pendingProperties.length > 0 ? (
              <div className="space-y-3">
                {pendingProperties.slice(0, 5).map((property) => (
                  <div
                    key={property._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{property.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {property.city} •{' '}
                        {property.landlord?.firstName || t('admin.unknownLandlord')}
                      </p>
                    </div>
                    <Link href={`/dashboard/verify/${property._id}`}>
                      <Button variant="ghost" size="sm">
                        {t('admin.verify')}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success opacity-50" />
                <p>{t('admin.noPendingVerifications')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.quickActions')}</CardTitle>
          <CardDescription>{t('admin.quickActionsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <Users className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{t('admin.statsUsers')}</div>
                  <div className="text-xs text-muted-foreground">{t('admin.manageAccounts')}</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/admin/applications">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <FileCheck className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{t('admin.statsApplications')}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('admin.reviewApplications')}
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/verify">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <CheckCircle className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{t('admin.statsVerifications')}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('admin.validateProperties')}
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/properties">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <Building2 className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{t('admin.statsProperties')}</div>
                  <div className="text-xs text-muted-foreground">{t('admin.manageListings')}</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/messages">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <MessageSquare className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{t('dashboard.messages')}</div>
                  <div className="text-xs text-muted-foreground">{t('admin.trackMessages')}</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AccessDeniedFallback() {
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

export default function AdminDashboardPage() {
  return (
    <RequireRole requiredRole="admin" fallback={<AccessDeniedFallback />}>
      <AdminDashboardContent />
    </RequireRole>
  );
}
