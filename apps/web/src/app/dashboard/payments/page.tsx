'use client';

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
import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA, formatDate } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useLocale } from 'gt-next/client';
import { CreditCard, Smartphone } from 'lucide-react';
import { useMemo, useState } from 'react';

const statusLabels: Record<string, { label: string; color: string }> = {
  completed: { label: 'Complété', color: 'bg-success/10 text-success' },
  pending: { label: 'En attente', color: 'bg-warning/10 text-warning' },
  processing: { label: 'En cours', color: 'bg-primary/10 text-primary' },
  failed: { label: 'Échoué', color: 'bg-destructive/10 text-destructive' },
  refunded: { label: 'Remboursé', color: 'bg-muted text-muted-foreground' },
};

const typeLabels: Record<string, string> = {
  rent_payment: 'Paiement de loyer',
  deposit: 'Caution',
  commission: 'Commission',
  refund: 'Remboursement',
};

const methodLabels: Record<string, string> = {
  mtn_momo: 'MTN MoMo',
  orange_money: 'Orange Money',
  bank_transfer: 'Virement bancaire',
  cash: 'Espèces',
};

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paiements</h1>
        <p className="text-muted-foreground mt-1">Historique et gestion de vos paiements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total payé</CardDescription>
            <CardTitle className="text-2xl text-success font-mono tabular-nums">
              {formatPaymentCurrency(totalPaid, locale)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En attente</CardDescription>
            <CardTitle className="text-2xl text-warning font-mono tabular-nums">
              {formatPaymentCurrency(pendingAmount, locale)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Prochaine échéance</CardDescription>
            <CardTitle className="text-2xl font-mono tabular-nums">
              {pendingAmount > 0 ? formatPaymentCurrency(pendingAmount, locale) : '-'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter and Actions */}
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les paiements</SelectItem>
            <SelectItem value="completed">Complétés</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="processing">En cours</SelectItem>
            <SelectItem value="failed">Échoués</SelectItem>
            <SelectItem value="refunded">Remboursés</SelectItem>
          </SelectContent>
        </Select>

        {/* Export button hidden until feature is ready */}
      </div>

      {/* Payments List */}
      <div className="bg-background rounded-lg border">
        <div className="px-4 py-3 border-b bg-muted">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-4">Transaction</div>
            <div className="col-span-3">Propriété</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Montant</div>
            <div className="col-span-1">Statut</div>
          </div>
        </div>

        {transactions === undefined ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-1">Aucun paiement</h3>
            <p className="text-muted-foreground">Vos transactions apparaîtront ici</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredPayments.map((payment) => (
              <div key={payment._id} className="px-4 py-4 hover:bg-muted">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <p className="font-medium text-foreground">
                      {typeLabels[payment.transactionType]}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {payment.transactionReference}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      via {methodLabels[payment.paymentMethod] ?? payment.paymentMethod}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-muted-foreground truncate">
                      {payment.property?.title ?? 'Propriété supprimée'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">
                      {formatPaymentDate(payment._creationTime, locale)}
                    </p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-medium text-foreground font-mono tabular-nums">
                      {formatPaymentCurrency(payment.amount, locale)}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        statusLabels[payment.paymentStatus]?.color
                      )}
                    >
                      {statusLabels[payment.paymentStatus]?.label ?? payment.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Méthodes de paiement</CardTitle>
          <CardDescription>Nous acceptons les paiements via Mobile Money</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
              <Smartphone className="w-6 h-6 text-muted-foreground" />
              <span className="font-medium">MTN MoMo</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
              <Smartphone className="w-6 h-6 text-muted-foreground" />
              <span className="font-medium">Orange Money</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
