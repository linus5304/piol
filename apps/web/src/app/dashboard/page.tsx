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
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}

const paymentStatusLabels: Record<string, { label: string; color: string }> = {
  completed: { label: 'Payé', color: 'bg-success/10 text-success' },
  pending: { label: 'En attente', color: 'bg-warning/10 text-warning' },
  processing: { label: 'En cours', color: 'bg-primary/10 text-primary' },
  failed: { label: 'Échoué', color: 'bg-destructive/10 text-destructive' },
  refunded: { label: 'Remboursé', color: 'bg-muted text-muted-foreground' },
};

export default function DashboardPage() {
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
  const firstName = user?.firstName || 'Utilisateur';

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
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">Voici un aperçu de votre activité</p>
        </div>
        <Select defaultValue="last-week">
          <SelectTrigger className="w-[180px] bg-card">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-week">7 derniers jours</SelectItem>
            <SelectItem value="last-month">30 derniers jours</SelectItem>
            <SelectItem value="last-quarter">3 derniers mois</SelectItem>
            <SelectItem value="last-year">Cette année</SelectItem>
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
            <h2 className="text-section-label">Transactions récentes</h2>
            <Link
              href="/dashboard/payments"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Voir tout →
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
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      Locataire
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      Type
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      Statut
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-right">
                      Montant
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
                        {formatDate(transaction._creationTime)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.renter
                          ? `${transaction.renter.firstName} ${transaction.renter.lastName ?? ''}`.trim()
                          : 'Inconnu'}
                      </TableCell>
                      <TableCell className="capitalize">{transaction.type}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${paymentStatusLabels[transaction.paymentStatus]?.color ?? 'bg-muted'}`}
                        >
                          {paymentStatusLabels[transaction.paymentStatus]?.label ??
                            transaction.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold font-mono tabular-nums">
                        {formatCurrency(transaction.amount)}
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
                <p>Aucune transaction pour le moment</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Renter: Recent Activity */}
      {role === 'renter' && (
        <div className="px-4 lg:px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-section-label">Activité récente</h2>
            <Link
              href="/dashboard/payments"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Voir tout →
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
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      Type
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                      Statut
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-right">
                      Montant
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
                        {formatDate(transaction._creationTime)}
                      </TableCell>
                      <TableCell className="font-medium capitalize">{transaction.type}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${paymentStatusLabels[transaction.paymentStatus]?.color ?? 'bg-muted'}`}
                        >
                          {paymentStatusLabels[transaction.paymentStatus]?.label ??
                            transaction.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold font-mono tabular-nums">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Aucune activité pour le moment</p>
                <Link href="/properties" className="text-primary hover:underline mt-2 inline-block">
                  Découvrir les propriétés
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
