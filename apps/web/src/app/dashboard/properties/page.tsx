'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Actif', color: 'bg-success/10 text-success' },
  draft: { label: 'Brouillon', color: 'bg-muted text-muted-foreground' },
  pending_verification: { label: 'En vérification', color: 'bg-warning/10 text-warning' },
  verified: { label: 'Vérifié', color: 'bg-success/10 text-success' },
  rented: { label: 'Loué', color: 'bg-primary/10 text-primary' },
  archived: { label: 'Archivé', color: 'bg-muted text-muted-foreground' },
};

const verificationLabels: Record<string, { label: string; color: string }> = {
  approved: { label: '✓ Vérifié', color: 'text-success' },
  pending: { label: '⏳ En attente', color: 'text-warning' },
  in_progress: { label: '🔍 En cours', color: 'text-warning' },
  rejected: { label: '✗ Rejeté', color: 'text-destructive' },
};

const propertyTypeLabels: Record<string, string> = {
  studio: 'Studio',
  '1br': '1 Chambre',
  '2br': '2 Chambres',
  '3br': '3 Chambres',
  '4br': '4 Chambres',
  house: 'Maison',
  apartment: 'Appartement',
  villa: 'Villa',
};

function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const properties = useQuery(api.properties.getMyProperties);

  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties.filter((property: (typeof properties)[number]) => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [properties, searchQuery, statusFilter]);

  const isLoading = properties === undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes propriétés</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              `${properties?.length ?? 0} propriété(s) au total`
            )}
          </p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <span className="mr-2">+</span>
            Ajouter une propriété
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Input
          type="search"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="pending_verification">En vérification</SelectItem>
            <SelectItem value="rented">Loués</SelectItem>
            <SelectItem value="archived">Archivés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-background rounded-lg border divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Properties List */}
      {!isLoading && filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-background rounded-lg border">
          <div className="text-5xl mb-4">🏘️</div>
          <h3 className="text-lg font-medium text-foreground mb-2">Aucune propriété</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Aucune propriété ne correspond à vos filtres'
              : 'Commencez par ajouter votre première propriété'}
          </p>
          <Link href="/dashboard/properties/new">
            <Button>Ajouter une propriété</Button>
          </Link>
        </div>
      ) : !isLoading ? (
        <div className="bg-background rounded-lg border divide-y">
          {filteredProperties.map((property: (typeof filteredProperties)[number]) => {
            // Get first image URL (from stored images or placeholders)
            const imageUrl = property.placeholderImages?.[0] ?? null;

            return (
              <div key={property._id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        📷
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/dashboard/properties/${property._id}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {property.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {property.neighborhood ? `${property.neighborhood}, ` : ''}
                          {property.city} •{' '}
                          {propertyTypeLabels[property.propertyType] || property.propertyType}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            statusLabels[property.status]?.color
                          )}
                        >
                          {statusLabels[property.status]?.label || property.status}
                        </span>
                        <span
                          className={cn(
                            'text-xs',
                            verificationLabels[property.verificationStatus]?.color
                          )}
                        >
                          {verificationLabels[property.verificationStatus]?.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-lg font-medium text-primary mt-1 font-mono tabular-nums">
                      {formatCurrency(property.rentAmount)}/mois
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>📅 Créé le {formatDate(property._creationTime)}</span>
                      {property.publishedAt && (
                        <span>✅ Publié le {formatDate(property.publishedAt)}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/properties/${property._id}`}>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </Link>
                    {property.status === 'active' && (
                      <Link href={`/properties/${property._id}`}>
                        <Button variant="ghost" size="sm">
                          Voir
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
