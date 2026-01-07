'use client';

import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock saved properties
const mockSavedProperties = [
  {
    _id: 'saved-1',
    title: 'Appartement moderne à Bonapriso',
    propertyType: '2br' as const,
    rentAmount: 200000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Bonapriso',
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' }],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-1',
    landlordName: 'Jean Kamga',
    landlordVerified: true,
  },
  {
    _id: 'saved-2',
    title: 'Studio meublé - Bastos',
    propertyType: 'studio' as const,
    rentAmount: 120000,
    currency: 'XAF',
    city: 'Yaoundé',
    neighborhood: 'Bastos',
    images: [{ url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' }],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-2',
    landlordName: 'Marie Fotso',
    landlordVerified: true,
  },
];

export default function SavedPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propriétés sauvegardées</h1>
          <p className="text-gray-600 mt-1">
            {mockSavedProperties.length} propriété(s) dans vos favoris
          </p>
        </div>
        <Link href="/properties">
          <Button variant="outline">Parcourir les propriétés</Button>
        </Link>
      </div>

      {mockSavedProperties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="text-5xl mb-4">❤️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune propriété sauvegardée</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Explorez les propriétés disponibles et sauvegardez vos favoris pour les retrouver
            facilement.
          </p>
          <Link href="/properties">
            <Button>Explorer les propriétés</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSavedProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
