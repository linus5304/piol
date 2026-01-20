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
import Link from 'next/link';
import { useState } from 'react';

// Mock landlord properties
const mockProperties = [
  {
    id: '1',
    title: 'Appartement 2 chambres - Makepe',
    type: '2br',
    price: 150000,
    city: 'Douala',
    neighborhood: 'Makepe',
    status: 'active',
    verificationStatus: 'approved',
    views: 45,
    inquiries: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
  },
  {
    id: '2',
    title: 'Studio moderne - Bonapriso',
    type: 'studio',
    price: 85000,
    city: 'Douala',
    neighborhood: 'Bonapriso',
    status: 'active',
    verificationStatus: 'pending',
    views: 12,
    inquiries: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
  },
  {
    id: '3',
    title: 'Villa avec jardin - Bonanjo',
    type: 'villa',
    price: 500000,
    city: 'Douala',
    neighborhood: 'Bonanjo',
    status: 'draft',
    verificationStatus: 'not_submitted',
    views: 0,
    inquiries: 0,
    createdAt: new Date(),
    image: null,
  },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Actif', color: 'bg-success/10 text-success' },
  draft: { label: 'Brouillon', color: 'bg-muted text-muted-foreground' },
  rented: { label: 'Loué', color: 'bg-primary/10 text-primary' },
  inactive: { label: 'Inactif', color: 'bg-warning/10 text-warning' },
};

const verificationLabels: Record<string, { label: string; color: string }> = {
  approved: { label: '✓ Vérifié', color: 'text-success' },
  pending: { label: '⏳ En attente', color: 'text-warning' },
  rejected: { label: '✗ Rejeté', color: 'text-destructive' },
  not_submitted: { label: '-', color: 'text-muted-foreground' },
};

function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes propriétés</h1>
          <p className="text-muted-foreground mt-1">
            {mockProperties.length} propriété(s) au total
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
            <SelectItem value="rented">Loués</SelectItem>
            <SelectItem value="inactive">Inactifs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties List */}
      {filteredProperties.length === 0 ? (
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
      ) : (
        <div className="bg-background rounded-lg border divide-y">
          {filteredProperties.map((property) => (
            <div key={property.id} className="p-4 hover:bg-muted transition-colors">
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {property.image ? (
                    <img
                      src={property.image}
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
                        href={`/dashboard/properties/${property.id}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {property.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {property.neighborhood}, {property.city}
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

                  <p className="text-lg font-medium text-primary mt-1">
                    {formatCurrency(property.price)}/mois
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>👁️ {property.views} vues</span>
                    <span>💬 {property.inquiries} demandes</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/properties/${property.id}`}>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </Link>
                  <Link href={`/properties/${property.id}`}>
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
