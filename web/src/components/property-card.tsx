'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface Property {
  _id: string;
  title: string;
  propertyType: string;
  rentAmount: number;
  currency: string;
  city: string;
  neighborhood?: string;
  images?: Array<{ storageId: string; order: number }>;
  verificationStatus: string;
  landlord?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    idVerified: boolean;
  } | null;
}

interface PropertyCardProps {
  property: Property;
}

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
}

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

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative h-48 bg-gray-100">
          {property.images && property.images.length > 0 ? (
            <img
              src={`/api/storage/${property.images[0].storageId}`}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
          )}

          {property.verificationStatus === 'approved' && (
            <Badge className="absolute top-3 left-3 bg-emerald-500">✓ Vérifié</Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(property.rentAmount)}
              <span className="text-sm font-normal text-gray-500">/mois</span>
            </div>
            <Badge variant="secondary">
              {propertyTypeLabels[property.propertyType] ?? property.propertyType}
            </Badge>
          </div>

          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>

          <p className="text-sm text-gray-500 mb-2">
            📍 {property.neighborhood ? `${property.neighborhood}, ` : ''}
            {property.city}
          </p>

          {property.landlord && (
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <span>
                {property.landlord.firstName} {property.landlord.lastName}
              </span>
              {property.landlord.idVerified && <span className="text-emerald-500">✓</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
