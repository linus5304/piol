'use client';

import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@repo/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useCallback } from 'react';

function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function SavedPropertiesPage() {
  const savedPropertiesData = useQuery(api.savedProperties.getSavedProperties);
  const toggleSaveProperty = useMutation(api.savedProperties.toggleSaveProperty);

  const isLoading = savedPropertiesData === undefined;
  const savedProperties = savedPropertiesData ?? [];

  const handleToggleSave = useCallback(
    (propertyId: string) => {
      toggleSaveProperty({
        propertyId: propertyId as Parameters<typeof toggleSaveProperty>[0]['propertyId'],
      });
    },
    [toggleSaveProperty]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propriétés sauvegardées</h1>
          <p className="text-gray-600 mt-1">
            {isLoading ? '...' : `${savedProperties.length} propriété(s) dans vos favoris`}
          </p>
        </div>
        <Link href="/properties">
          <Button variant="outline">Parcourir les propriétés</Button>
        </Link>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
            <PropertyCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && savedProperties.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted flex items-center justify-center rounded-full">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune propriété sauvegardée</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Explorez les propriétés disponibles et sauvegardez vos favoris pour les retrouver
            facilement.
          </p>
          <Link href="/properties">
            <Button>Explorer les propriétés</Button>
          </Link>
        </div>
      )}

      {/* Properties grid */}
      {!isLoading && savedProperties.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((saved: (typeof savedProperties)[number]) => (
            <PropertyCard
              key={saved._id}
              property={{
                _id: saved.property._id,
                title: saved.property.title,
                propertyType: saved.property.propertyType,
                rentAmount: saved.property.rentAmount,
                currency: saved.property.currency,
                city: saved.property.city,
                neighborhood: saved.property.neighborhood,
                verificationStatus: saved.property.verificationStatus,
                status: saved.property.status,
                images: saved.property.placeholderImages?.map((url: string) => ({ url })),
                amenities: saved.property.amenities,
                landlord: saved.property.landlord,
              }}
              isSaved={true}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
