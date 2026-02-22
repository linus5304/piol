'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCurrentUserRole } from '@/hooks/use-current-user-role';
import { useSafeUser } from '@/hooks/use-safe-auth';
import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA, formatDate, formatNumber } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import {
  ArrowUpRight,
  Building2,
  Eye,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Client-only greeting key to avoid SSR/client time mismatch.
 * Returns a generic key on first render, then updates after mount.
 */
function useGreetingKey() {
  const [key, setKey] = useState('dashboard.welcome');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setKey('dashboard.greetingMorning');
    else if (hour < 18) setKey('dashboard.greetingAfternoon');
    else setKey('dashboard.greetingEvening');
  }, []);
  return key;
}

function formatDashboardDate(timestamp: number, locale: string): string {
  return formatDate(timestamp, locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDashboardCurrency(amount: number, locale: string): string {
  return formatCurrencyFCFA(amount, locale);
}

function formatCompact(amount: number, locale: string): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}k`;
  return formatNumber(amount, locale);
}

const paymentStatusColors: Record<string, string> = {
  completed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  processing: 'bg-primary/10 text-primary',
  failed: 'bg-destructive/10 text-destructive',
  refunded: 'bg-muted text-muted-foreground',
};

const paymentStatusKeys: Record<string, string> = {
  completed: 'dashboard.statusPaid',
  pending: 'dashboard.statusPending',
  processing: 'dashboard.statusProcessing',
  failed: 'dashboard.statusFailed',
  refunded: 'dashboard.statusRefunded',
};

const paymentMethodLabels: Record<string, string> = {
  mtn_momo: 'MTN MoMo',
  orange_money: 'Orange Money',
  bank_transfer: 'Virement',
  cash: 'Espèces',
};

const propertyStatusColors: Record<string, string> = {
  active: 'bg-success',
  draft: 'bg-muted-foreground',
  pending_verification: 'bg-warning',
  verified: 'bg-success',
  inactive: 'bg-muted-foreground',
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-64" />
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}

/**
 * Inline skeleton that renders a <span> instead of <div>,
 * safe to use inside <p> and other phrasing content elements.
 */
function InlineSkeleton({ className }: { className?: string }) {
  return (
    <span
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md inline-block', className)}
    />
  );
}

export default function DashboardPage() {
  const t = useTranslations();
  const locale = parseAppLocale(useLocale());
  const { user, isLoaded } = useSafeUser();
  const { role: convexRole } = useCurrentUserRole();
  const router = useRouter();

  const role = convexRole || 'renter';

  const dashboardStats = useQuery(api.users.getDashboardStats);
  const { results: transactions, status: txStatus } = usePaginatedQuery(
    api.transactions.getMyTransactions,
    {},
    { initialNumItems: 5 }
  );
  const { results: myProperties, status: propStatus } = usePaginatedQuery(
    api.properties.getMyProperties,
    role === 'landlord' ? {} : 'skip',
    { initialNumItems: 5 }
  );

  // Redirect admin/verifier to their dedicated dashboards
  useEffect(() => {
    if (role === 'admin') {
      router.replace('/dashboard/admin');
    } else if (role === 'verifier') {
      router.replace('/dashboard/verify');
    }
  }, [role, router]);

  if (!isLoaded || role === 'admin' || role === 'verifier') {
    return <DashboardSkeleton />;
  }

  const firstName = user?.firstName || t('dashboard.defaultUser');

  if (role === 'landlord') {
    return (
      <LandlordDashboard
        firstName={firstName}
        locale={locale}
        stats={dashboardStats}
        transactions={transactions}
        properties={myProperties}
        t={t}
      />
    );
  }

  return (
    <RenterDashboard
      firstName={firstName}
      locale={locale}
      stats={dashboardStats}
      transactions={transactions}
      t={t}
    />
  );
}

/* ─── Landlord Dashboard (V4 Vercel Analytics) ─── */

function LandlordDashboard({
  firstName,
  locale,
  stats,
  transactions,
  properties,
  t,
}: {
  firstName: string;
  locale: string;
  stats: ReturnType<typeof useQuery<typeof api.users.getDashboardStats>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any[];
  t: ReturnType<typeof useTranslations>;
}) {
  const greetingKey = useGreetingKey();
  const revenue = stats && stats.role === 'landlord' ? stats.totalRevenue : 0;
  const activeProperties = stats && stats.role === 'landlord' ? stats.activeProperties : 0;
  const unreadMessages = stats?.unreadMessages ?? 0;
  const totalProperties = stats && stats.role === 'landlord' ? stats.totalProperties : 0;
  const pendingPayments = stats && stats.role === 'landlord' ? stats.pendingPayments : 0;

  // Take first 5 properties for grid
  const displayProperties = properties.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">
            {t(greetingKey)}, {firstName}
          </h1>
          <p className="text-xs text-muted-foreground">{t('dashboard.activityOverview')}</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            {t('dashboard.newProperty')}
          </Button>
        </Link>
      </div>

      <div className="flex-1 px-4 lg:px-6 pb-8 space-y-6">
        {/* Top: Revenue Card + KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Hero Card */}
          <Card className="lg:col-span-2 border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-card via-card to-primary/5 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="h-4 w-4 text-primary" />
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t('dashboard.totalRevenue')}
                      </p>
                    </div>
                    {stats === undefined ? (
                      <Skeleton className="h-10 w-48 mt-1" />
                    ) : (
                      <p className="text-4xl font-bold tracking-tight font-mono tabular-nums">
                        {formatDashboardCurrency(revenue, locale)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Summary stats row inside hero card */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border/30">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {t('dashboard.propertiesTotal')}
                    </p>
                    {stats === undefined ? (
                      <InlineSkeleton className="h-6 w-8 mt-0.5" />
                    ) : (
                      <p className="text-lg font-bold font-mono tabular-nums mt-0.5">
                        {totalProperties}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {t('dashboard.activeLabel')}
                    </p>
                    {stats === undefined ? (
                      <InlineSkeleton className="h-6 w-8 mt-0.5" />
                    ) : (
                      <p className="text-lg font-bold font-mono tabular-nums text-success mt-0.5">
                        {activeProperties}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {t('dashboard.pendingPaymentsLabel')}
                    </p>
                    {stats === undefined ? (
                      <InlineSkeleton className="h-6 w-8 mt-0.5" />
                    ) : (
                      <p className="text-lg font-bold font-mono tabular-nums text-warning mt-0.5">
                        {pendingPayments}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards Stack */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2.5 bg-success/10">
                    <Building2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    {stats === undefined ? (
                      <Skeleton className="h-7 w-8" />
                    ) : (
                      <p className="text-2xl font-bold leading-none">{activeProperties}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('dashboard.activeProperties')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2.5 bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    {stats === undefined ? (
                      <Skeleton className="h-7 w-8" />
                    ) : (
                      <p className="text-2xl font-bold leading-none">{unreadMessages}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('dashboard.unreadMessages')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 col-span-2 lg:col-span-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2.5 bg-muted">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold leading-none">{formatCompact(0, locale)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('dashboard.totalViews')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Properties Grid */}
        {displayProperties.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('dashboard.propertyPortfolio')}
              </h2>
              <Link
                href="/dashboard/properties"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                {t('dashboard.viewAllArrow')} <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {displayProperties.map((prop: (typeof displayProperties)[number]) => {
                const imageUrl = prop.images?.[0]?.url ?? null;
                return (
                  <Link key={prop._id} href={`/dashboard/properties/${prop._id}`}>
                    <Card className="border-border/50 overflow-hidden hover:border-primary/30 transition-colors cursor-pointer group">
                      <div className="aspect-[4/3] bg-muted overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm font-medium truncate">{prop.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {prop.neighborhood ? `${prop.neighborhood}, ${prop.city}` : prop.city}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-primary font-mono tabular-nums">
                            {formatCompact(prop.rentAmount, locale)}
                          </span>
                          <span
                            className={cn(
                              'h-2 w-2 rounded-full',
                              propertyStatusColors[prop.status] ?? 'bg-muted-foreground'
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Full-width Transactions Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              {t('dashboard.recentTransactions')}
            </CardTitle>
            <Link
              href="/dashboard/payments"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              {t('dashboard.viewAllArrow')} <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {t('dashboard.tableTenant')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {t('dashboard.tableProperty')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {t('dashboard.tableMethod')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {t('dashboard.tableDate')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {t('dashboard.tableStatus')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-right">
                      {t('dashboard.tableAmount')}
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx: (typeof transactions)[number]) => (
                    <TableRow
                      key={tx._id}
                      className="border-border/50 hover:bg-muted/50 cursor-pointer"
                    >
                      <TableCell className="font-medium text-sm">
                        {tx.otherParty
                          ? `${tx.otherParty.firstName ?? ''} ${tx.otherParty.lastName ?? ''}`.trim()
                          : t('dashboard.unknownRenter')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {tx.property?.title ?? '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {paymentMethodLabels[tx.paymentMethod] ?? tx.paymentMethod}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDashboardDate(tx._creationTime, locale)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                            paymentStatusColors[tx.paymentStatus] ?? 'bg-muted'
                          )}
                        >
                          {paymentStatusKeys[tx.paymentStatus]
                            ? t(paymentStatusKeys[tx.paymentStatus])
                            : tx.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold font-mono tabular-nums text-sm">
                        {formatDashboardCurrency(tx.amount, locale)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t('dashboard.noTransactions')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ─── Renter Dashboard ─── */

function RenterDashboard({
  firstName,
  locale,
  stats,
  transactions,
  t,
}: {
  firstName: string;
  locale: string;
  stats: ReturnType<typeof useQuery<typeof api.users.getDashboardStats>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: any[];
  t: ReturnType<typeof useTranslations>;
}) {
  const greetingKey = useGreetingKey();
  const savedProperties = stats && stats.role === 'renter' ? stats.savedProperties : 0;
  const unreadMessages = stats?.unreadMessages ?? 0;
  const totalSpent = stats && stats.role === 'renter' ? stats.totalSpent : 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">
            {t(greetingKey)}, {firstName}
          </h1>
          <p className="text-xs text-muted-foreground">{t('dashboard.activityOverview')}</p>
        </div>
        <Link href="/properties">
          <Button size="sm" variant="outline">
            <Search className="h-4 w-4 mr-1.5" />
            {t('dashboard.discoverProperties')}
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2.5 bg-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  {stats === undefined ? (
                    <Skeleton className="h-7 w-8" />
                  ) : (
                    <p className="text-2xl font-bold leading-none">{savedProperties}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('dashboard.savedProperties')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2.5 bg-success/10">
                  <MessageSquare className="h-5 w-5 text-success" />
                </div>
                <div>
                  {stats === undefined ? (
                    <Skeleton className="h-7 w-8" />
                  ) : (
                    <p className="text-2xl font-bold leading-none">{unreadMessages}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('dashboard.unreadMessages')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2.5 bg-muted">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  {stats === undefined ? (
                    <Skeleton className="h-7 w-24" />
                  ) : (
                    <p className="text-2xl font-bold leading-none">
                      {formatCompact(totalSpent, locale)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{t('dashboard.totalSpent')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 lg:px-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">{t('dashboard.recentActivity')}</CardTitle>
            <Link
              href="/dashboard/payments"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              {t('dashboard.viewAllArrow')} <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {t('dashboard.tableDate')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {t('dashboard.tableType')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {t('dashboard.tableStatus')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-right">
                      {t('dashboard.tableAmount')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 3).map((tx: (typeof transactions)[number]) => (
                    <TableRow
                      key={tx._id}
                      className="border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="text-muted-foreground">
                        {formatDashboardDate(tx._creationTime, locale)}
                      </TableCell>
                      <TableCell className="font-medium capitalize">{tx.transactionType}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                            paymentStatusColors[tx.paymentStatus] ?? 'bg-muted'
                          )}
                        >
                          {paymentStatusKeys[tx.paymentStatus]
                            ? t(paymentStatusKeys[tx.paymentStatus])
                            : tx.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold font-mono tabular-nums">
                        {formatDashboardCurrency(tx.amount, locale)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t('dashboard.noActivity')}</p>
                <Link href="/properties" className="text-primary hover:underline mt-2 inline-block">
                  {t('dashboard.discoverProperties')}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
