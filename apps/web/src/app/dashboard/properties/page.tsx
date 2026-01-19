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
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { useState } from 'react';

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Actif', color: 'bg-green-100 text-green-800' },
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
  rented: { label: 'Loué', color: 'bg-blue-100 text-blue-800' },
  inactive: { label: 'Inactif', color: 'bg-yellow-100 text-yellow-800' },
};

const verificationLabels: Record<string, { label: string; color: string }> = {
  approved: { label: '✓ Vérifié', color: 'text-green-600' },
  pending: { label: '⏳ En attente', color: 'text-yellow-600' },
  in_progress: { label: '🔍 En cours', color: 'text-blue-600' },
  rejected: { label: '✗ Rejeté', color: 'text-red-600' },
};

function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch landlord's properties from Convex
  const properties = useQuery(api.properties.getMyProperties);
  const isLoading = properties === undefined;

  const filteredProperties = (properties ?? []).filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-lg border divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes propriétés</h1>
          <p className="text-gray-600 mt-1">{properties?.length ?? 0} propriété(s) au total</p>
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
            <SelectItem value="rented">Loués</SelectItem>
            <SelectItem value="inactive">Inactifs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="text-5xl mb-4">🏘️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune propriété</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Aucune propriété ne correspond à vos filtres'
              : 'Commencez par ajouter votre première propriété'}
          </p>
          <Link href="/dashboard/properties/new">
            <Button>Ajouter une propriété</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border divide-y">
          {filteredProperties.map((property) => {
            // Get first image URL (placeholder or would need separate query for storage URLs)
            const imageUrl = property.placeholderImages?.[0] ?? null;
            return (
              <div key={property._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                          className="font-medium text-gray-900 hover:text-[#FF385C]"
                        >
                          {property.title}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {property.neighborhood ? `${property.neighborhood}, ` : ''}
                          {property.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            statusLabels[property.status]?.color
                          )}
                        >
                          {statusLabels[property.status]?.label}
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

                    <p className="text-lg font-medium text-[#FF385C] mt-1">
                      {formatCurrency(property.rentAmount)}/mois
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      {property.propertyType} · Créé le{' '}
                      {new Date(property._creationTime).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/properties/${property._id}`}>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </Link>
                    <Link href={`/properties/${property._id}`}>
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
