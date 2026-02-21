'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionLabel } from '@/components/ui/section-label';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/ui/stat-card';
import { StatusDot, paymentStatusConfig } from '@/components/ui/status-dot';
import { parseAppLocale } from '@/i18n/config';
import { isPaymentsEnabled } from '@/lib/env';
import { formatCurrencyFCFA, formatDate } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import { CreditCard, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const statusKeys: Record<string, string> = {
  completed: 'payments.statusCompleted',
  pending: 'payments.statusPending',
  processing: 'payments.statusProcessing',
  failed: 'payments.statusFailed',
  refunded: 'payments.statusRefunded',
};

const typeKeys: Record<string, string> = {
  rent_payment: 'payments.rentPayment',
  deposit: 'payments.deposit',
  commission: 'payments.commission',
  refund: 'payments.refund',
};

const methodLabels: Record<string, string> = {
  mtn_momo: 'MTN MoMo',
  orange_money: 'Orange Money',
  bank_transfer: 'Virement bancaire',
  cash: 'Espèces',
};

const amountColorByStatus: Record<string, string> = {
  completed: 'text-success',
  pending: 'text-warning',
  processing: 'text-warning',
  failed: 'text-destructive',
  refunded: 'text-foreground',
};

const filterOptions = [
  { value: 'all', key: 'payments.all' },
  { value: 'completed', key: 'payments.completed' },
  { value: 'pending', key: 'payments.statusPending' },
  { value: 'processing', key: 'payments.statusProcessing' },
  { value: 'failed', key: 'payments.failed' },
  { value: 'refunded', key: 'payments.refunded' },
] as const;

function formatPaymentCurrency(amount: number, locale: string): string {
  return formatCurrencyFCFA(amount, locale);
}

function formatPaymentDate(timestamp: number, locale: string): string {
  return formatDate(timestamp, locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function PaymentsPage() {
  const t = useTranslations();
  const locale = parseAppLocale(useLocale());
  const [filter, setFilter] = useState<string>('all');
  const transactions = useQuery(api.transactions.getMyTransactions, { limit: 100 });

  const filteredPayments = useMemo(() => {
    if (!transactions) return [];
    if (filter === 'all') return transactions;
    return transactions.filter((payment) => payment.paymentStatus === filter);
  }, [transactions, filter]);

  const totalPaid = (transactions ?? [])
    .filter((p) => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = (transactions ?? [])
    .filter((p) => p.paymentStatus === 'pending' || p.paymentStatus === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);

  // Build translated status config for StatusDot
  const translatedPaymentStatusConfig = useMemo(() => {
    const config: Record<string, { dot: string; label: string }> = {};
    for (const [key, entry] of Object.entries(paymentStatusConfig)) {
      config[key] = {
        dot: entry.dot,
        label: statusKeys[key] ? t(statusKeys[key]) : entry.label,
      };
    }
    return config;
  }, [t]);

  return (
    <div className="space-y-6">
      {/* Header area */}
      <div className="space-y-4">
        <PageHeader
          title={t('payments.title')}
          subtitle={t('payments.subtitle')}
          action={
            isPaymentsEnabled
              ? {
                  label: t('payments.initiatePayment'),
                  href: '/properties',
                }
              : undefined
          }
        />

        {/* Staged Banner */}
        {!isPaymentsEnabled && (
          <Card data-testid="payments-staged-banner">
            <CardHeader>
              <CardTitle className="text-base">{t('payments.stagedBannerTitle')}</CardTitle>
              <CardDescription>{t('payments.stagedBannerDesc')}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label={t('payments.totalPaid')}
            value={formatPaymentCurrency(totalPaid, locale)}
            variant="success"
          />
          <StatCard
            label={t('payments.pending')}
            value={formatPaymentCurrency(pendingAmount, locale)}
            variant="warning"
          />
          <StatCard
            label={t('payments.nextDue')}
            value={pendingAmount > 0 ? formatPaymentCurrency(pendingAmount, locale) : '-'}
            variant="default"
          />
        </div>
      </div>

      {/* Transaction section */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <SectionLabel>{t('payments.transaction')}</SectionLabel>
          <div className="flex flex-wrap items-center gap-1.5">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  filter === option.value
                    ? 'bg-foreground text-background'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                {t(option.key)}
              </button>
            ))}
          </div>
        </div>

        {transactions === undefined ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <CreditCard className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium text-foreground">{t('payments.noPayments')}</h3>
            <p className="text-muted-foreground">{t('payments.transactionsWillAppear')}</p>
          </div>
        ) : (
          <div className="divide-y rounded-lg border bg-card">
            {filteredPayments.map((payment) => (
              <div
                key={payment._id}
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
              >
                {/* Left: Type + Property + Status */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {typeKeys[payment.transactionType]
                        ? t(typeKeys[payment.transactionType])
                        : payment.transactionType}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {payment.property?.title ?? t('payments.deletedProperty')}
                    </p>
                  </div>
                </div>

                {/* Right: Amount + Status + Meta */}
                <div className="flex shrink-0 items-center gap-4">
                  <StatusDot
                    status={payment.paymentStatus}
                    config={translatedPaymentStatusConfig}
                    size="sm"
                  />
                  <div className="text-right">
                    <p
                      className={cn(
                        'text-sm font-semibold font-mono tabular-nums',
                        amountColorByStatus[payment.paymentStatus] ?? 'text-foreground'
                      )}
                    >
                      {formatPaymentCurrency(payment.amount, locale)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {methodLabels[payment.paymentMethod] ?? payment.paymentMethod}
                      {' \u00B7 '}
                      {formatPaymentDate(payment._creationTime, locale)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <SectionLabel>{t('payments.paymentMethods')}</SectionLabel>
        <p className="text-sm text-muted-foreground">{t('payments.paymentMethodsDesc')}</p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 shadow-sm">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">MTN MoMo</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 shadow-sm">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Orange Money</span>
          </div>
        </div>
      </div>
    </div>
  );
}
