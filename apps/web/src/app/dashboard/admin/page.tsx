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
import { ROLE_COLORS, ROLE_LABELS, type UserRole } from '@/lib/permissions';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  MoreHorizontal,
  Shield,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

function AdminDashboardContent() {
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
  const recentUsers = useQuery(api.users.listUsers, { limit: 5 });

  // Fetch properties pending verification
  const pendingProperties = useQuery(api.properties.getPendingVerification);

  if (!isLoaded || !isAdmin) {
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
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Administration</h1>
          <p className="text-muted-foreground mt-1">
            Tableau de bord administrateur - Vue d'ensemble du système
          </p>
        </div>
        <Badge className={ROLE_COLORS.admin}>
          <Shield className="w-3 h-3 mr-1" />
          Administrateur
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              {adminStats?.totalUsers ?? '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {adminStats?.newUsersThisMonth ?? 0} nouveaux ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propriétés</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              {adminStats?.totalProperties ?? '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {adminStats?.activeProperties ?? 0} actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-warning">
              {adminStats?.pendingVerifications ?? '-'}
            </div>
            <p className="text-xs text-muted-foreground">Vérifications à traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              {adminStats?.totalTransactions ? formatCurrency(adminStats.totalTransactions) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Volume total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Utilisateurs récents</CardTitle>
                <CardDescription>Dernières inscriptions sur la plateforme</CardDescription>
              </div>
              <Link href="/dashboard/admin/users">
                <Button variant="outline" size="sm">
                  Voir tout
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentUsers === undefined ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentUsers && recentUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="hidden sm:table-cell">Inscrit</TableHead>
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
                          {ROLE_LABELS[user.role as UserRole] || user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {formatDate(user._creationTime)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucun utilisateur</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vérifications en attente</CardTitle>
                <CardDescription>Propriétés à vérifier</CardDescription>
              </div>
              <Link href="/dashboard/verify">
                <Button variant="outline" size="sm">
                  Voir tout
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
                        {property.city} • {property.landlord?.firstName || 'Inconnu'}
                      </p>
                    </div>
                    <Link href={`/dashboard/verify/${property._id}`}>
                      <Button variant="ghost" size="sm">
                        Vérifier
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success opacity-50" />
                <p>Aucune vérification en attente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Accès rapide aux fonctionnalités d'administration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <Users className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Utilisateurs</div>
                  <div className="text-xs text-muted-foreground">Gérer les comptes</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/verify">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <CheckCircle className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Vérifications</div>
                  <div className="text-xs text-muted-foreground">Valider les propriétés</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/properties">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <Building2 className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Propriétés</div>
                  <div className="text-xs text-muted-foreground">Gérer les annonces</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/payments">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <DollarSign className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Transactions</div>
                  <div className="text-xs text-muted-foreground">Voir les paiements</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RequireRole
      requiredRole="admin"
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <Link href="/dashboard">
            <Button>Retour au tableau de bord</Button>
          </Link>
        </div>
      }
    >
      <AdminDashboardContent />
    </RequireRole>
  );
}
