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
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import {
  AlertCircle,
  ArrowRight,
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

const statusConfig = {
  pending: {
    label: 'En attente',
    icon: Clock,
    color: 'bg-warning/10 text-warning',
  },
  in_progress: {
    label: 'En cours',
    icon: Shield,
    color: 'bg-primary/10 text-primary',
  },
  approved: {
    label: 'Approuvé',
    icon: CheckCircle,
    color: 'bg-success/10 text-success',
  },
  rejected: {
    label: 'Rejeté',
    icon: XCircle,
    color: 'bg-destructive/10 text-destructive',
  },
};

function VerifyDashboardContent() {
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
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Vérifications</h1>
          <p className="text-muted-foreground mt-1">Gérer les vérifications de propriétés</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 w-fit">
          <Shield className="w-3 h-3 mr-1" />
          Vérificateur
        </Badge>
      </div>

      {/* Stats Cards (Admin only) */}
      {stats && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tabular-nums text-warning">
                {stats.propertiesPendingVerification}
              </div>
              <p className="text-xs text-muted-foreground">propriétés à vérifier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tabular-nums">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">vérifications en cours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tabular-nums text-success">
                {stats.approved}
              </div>
              <p className="text-xs text-muted-foreground">ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tabular-nums text-destructive">
                {stats.rejected}
              </div>
              <p className="text-xs text-muted-foreground">ce mois</p>
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
                Propriétés en attente de vérification
              </CardTitle>
              <CardDescription>
                Sélectionnez une propriété pour commencer la vérification
              </CardDescription>
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Toutes les villes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
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
                        {property.landlord?.firstName || 'Inconnu'}{' '}
                        {property.landlord?.lastName || ''}
                      </span>
                      <span className="font-mono tabular-nums">
                        {formatCurrency(property.rentAmount)}/mois
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Soumis le {formatDate(property._creationTime)}
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
                        ]?.label || property.existingVerification.status}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Non assigné</Badge>
                    )}
                    <Link href={`/dashboard/verify/${property._id}`}>
                      <Button size="sm" className="gap-1">
                        Vérifier
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success opacity-50" />
              <h3 className="text-lg font-medium mb-1">Aucune vérification en attente</h3>
              <p>Toutes les propriétés ont été traitées</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Verifications */}
      {myVerifications && myVerifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mes vérifications récentes</CardTitle>
            <CardDescription>Historique de vos vérifications</CardDescription>
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
                          {verification.property?.city} • {formatDate(verification._creationTime)}
                        </p>
                      </div>
                    </div>
                    <Badge className={config?.color || ''}>
                      {config?.label || verification.status}
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

export default function VerifyDashboardPage() {
  return (
    <RequireRole
      roles={['admin', 'verifier']}
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
      <VerifyDashboardContent />
    </RequireRole>
  );
}
