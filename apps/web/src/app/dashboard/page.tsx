'use client';

import { SectionCards } from '@/components/section-cards';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSafeUser } from '@/hooks/use-safe-auth';
import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA, formatDate } from '@/lib/i18n-format';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'dashboard.greetingMorning';
  if (hour < 18) return 'dashboard.greetingAfternoon';
  return 'dashboard.greetingEvening';
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

export default function DashboardPage() {
  const t = useTranslations();
  const locale = parseAppLocale(useLocale());
  const { user, isLoaded } = useSafeUser();

  // Fetch dashboard stats
  const dashboardStats = useQuery(api.users.getDashboardStats);

  // Fetch recent transactions (for landlords)
  const transactions = useQuery(api.transactions.getMyTransactions, { limit: 5 });

  if (!isLoaded) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const role = (user?.unsafeMetadata?.role as string) || 'renter';
  const firstName = user?.firstName || t('dashboard.defaultUser');

  // Prepare stats for SectionCards based on role
  const stats =
    dashboardStats?.role === 'landlord'
      ? {
          revenue: dashboardStats.totalRevenue ?? 0,
          properties: dashboardStats.activeProperties ?? 0,
          messages: dashboardStats.unreadMessages ?? 0,
          views: 0, // We don't track views yet
        }
      : {
          favorites: dashboardStats?.savedProperties ?? 0,
          searches: 0, // We don't track searches yet
          messages: dashboardStats?.unreadMessages ?? 0,
          views: 0, // We don't track views yet
        };

  return (
    <div className="space-y-8 pb-8">
      {/* Greeting + Time Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t(getGreetingKey())}, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">{t('dashboard.activityOverview')}</p>
        </div>
        <Select defaultValue="last-week">
          <SelectTrigger className="w-[180px] bg-card">
            <SelectValue placeholder={t('dashboard.period')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-week">{t('dashboard.last7Days')}</SelectItem>
            <SelectItem value="last-month">{t('dashboard.last30Days')}</SelectItem>
            <SelectItem value="last-quarter">{t('dashboard.last3Months')}</SelectItem>
            <SelectItem value="last-year">{t('dashboard.thisYear')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="px-4 lg:px-6">
        <SectionCards role={role as 'renter' | 'landlord'} stats={stats} />
      </div>

      {/* Recent Transactions Table (Landlord) */}
      {role === 'landlord' && (
        <div className="px-4 lg:px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-section-label">{t('dashboard.recentTransactions')}</h2>
            <Link
              href="/dashboard/payments"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t('dashboard.viewAllArrow')}
            </Link>
          </div>
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
            {transactions === undefined ? (
              // Loading skeleton
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      {t('dashboard.tableDate')}
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      {t('dashboard.tableTenant')}
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      {t('dashboard.tableType')}
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      {t('dashboard.tableStatus')}
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-right">
                      {t('dashboard.tableAmount')}
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction: (typeof transactions)[number]) => (
                    <TableRow
                      key={transaction._id}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="text-muted-foreground">
                        {formatDashboardDate(transaction._creationTime, locale)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.renter
                          ? `${transaction.renter.firstName} ${transaction.renter.lastName ?? ''}`.trim()
                          : t('dashboard.unknownRenter')}
                      </TableCell>
                      <TableCell className="capitalize">{transaction.type}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${paymentStatusColors[transaction.paymentStatus] ?? 'bg-muted'}`}
                        >
                          {paymentStatusKeys[transaction.paymentStatus]
                            ? t(paymentStatusKeys[transaction.paymentStatus])
                            : transaction.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold font-mono tabular-nums">
                        {formatDashboardCurrency(transaction.amount, locale)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
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
          </div>
        </div>
      )}

      {/* Renter: Recent Activity */}
      {role === 'renter' && (
        <div className="px-4 lg:px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-section-label">{t('dashboard.recentActivity')}</h2>
            <Link
              href="/dashboard/payments"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t('dashboard.viewAllArrow')}
            </Link>
          </div>
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
            {transactions === undefined ? (
              // Loading skeleton
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      {t('dashboard.tableDate')}
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      {t('dashboard.tableType')}
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      {t('dashboard.tableStatus')}
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-right">
                      {t('dashboard.tableAmount')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 3).map((transaction: (typeof transactions)[number]) => (
                    <TableRow
                      key={transaction._id}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="text-muted-foreground">
                        {formatDashboardDate(transaction._creationTime, locale)}
                      </TableCell>
                      <TableCell className="font-medium capitalize">{transaction.type}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${paymentStatusColors[transaction.paymentStatus] ?? 'bg-muted'}`}
                        >
                          {paymentStatusKeys[transaction.paymentStatus]
                            ? t(paymentStatusKeys[transaction.paymentStatus])
                            : transaction.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold font-mono tabular-nums">
                        {formatDashboardCurrency(transaction.amount, locale)}
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
          </div>
        </div>
      )}
    </div>
  );
}
