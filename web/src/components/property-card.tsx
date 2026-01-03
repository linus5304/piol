'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    propertyType: string;
    rentAmount: number;
    currency: string;
    city: string;
    neighborhood?: string;
    images?: { url?: string; storageId?: string }[];
    status: string;
    verificationStatus: string;
    landlordId: string;
    landlordName?: string;
    landlordVerified?: boolean;
  };
  showSaveButton?: boolean;
  className?: string;
}

const propertyTypeLabels: Record<string, string> = {
  studio: 'Studio',
  '1br': '1 Chambre',
  '2br': '2 Chambres',
  '3br': '3 Chambres',
  '4br': '4+ Chambres',
  house: 'Maison',
  apartment: 'Appartement',
  villa: 'Villa',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount);
}

export function PropertyCard({ property, showSaveButton = true, className }: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl =
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <Link
      href={`/properties/${property._id}`}
      className={cn(
        'group block rounded-xl overflow-hidden bg-white card-hover',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        {/* Placeholder while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 skeleton" />
        )}
        
        <img
          src={imageUrl}
          alt={property.title}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
            !imageLoaded && 'opacity-0'
          )}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Save Button */}
        {showSaveButton && (
          <button
            type="button"
            onClick={handleSave}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md transition-all hover:scale-110"
            aria-label={isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <span className={cn(
              'text-lg transition-colors',
              isSaved ? 'text-[#FF385C]' : 'text-gray-600'
            )}>
              {isSaved ? '❤️' : '🤍'}
            </span>
          </button>
        )}

        {/* Verified Badge */}
        {property.verificationStatus === 'approved' && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-green-700 flex items-center gap-1">
            <span>✓</span>
            <span>Vérifié</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-3">
        {/* Location & Rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">
            {property.neighborhood || property.city}, {property.city !== property.neighborhood ? property.city : 'Cameroun'}
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            ⭐ Nouveau
          </span>
        </div>

        {/* Title */}
        <h3 className="text-gray-500 text-sm mt-1 line-clamp-1">
          {property.title}
        </h3>

        {/* Type */}
        <p className="text-sm text-gray-500 mt-1">
          {propertyTypeLabels[property.propertyType] || property.propertyType}
        </p>

        {/* Price */}
        <div className="mt-2">
          <span className="font-semibold text-gray-900">
            {formatCurrency(property.rentAmount)} FCFA
          </span>
          <span className="text-gray-500 text-sm"> /mois</span>
        </div>
      </div>
    </Link>
  );
}
