'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Heart, MapPin, Bed, Bath, Wifi, Car, Wind, Shield, ImageOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
    status?: string;
    verificationStatus?: string;
    landlordId?: string;
    landlordName?: string;
    landlordVerified?: boolean;
    landlord?: {
      _id: string;
      firstName: string;
      lastName: string;
      idVerified: boolean;
    };
    amenities?: {
      wifi?: boolean;
      parking?: boolean;
      ac?: boolean;
      security?: boolean;
      pool?: boolean;
      balcony?: boolean;
      garden?: boolean;
    };
    bedrooms?: number;
    bathrooms?: number;
  };
  showSaveButton?: boolean;
  className?: string;
  variant?: 'vertical' | 'horizontal';
}

// Property type keys for i18n lookup
const propertyTypeKeys: Record<string, string> = {
  studio: 'studio',
  '1br': '1br',
  '2br': '2br',
  '3br': '3br',
  '4br': '4br',
  house: 'house',
  apartment: 'apartment',
  villa: 'villa',
};

// Fallback placeholder for when images fail to load
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f5f5f5" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="system-ui" font-size="16"%3EImage non disponible%3C/text%3E%3C/svg%3E';

// Curated list of beautiful property images from Unsplash
const propertyImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', // Modern apartment interior
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', // Living room
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', // Modern house exterior
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', // Luxury villa
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop', // Modern architecture
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', // Villa with pool
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop', // Cozy interior
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', // Modern facade
];

function getConsistentImage(id: string): string {
  // Use property ID to consistently select an image
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return propertyImages[hash % propertyImages.length];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount);
}

export function PropertyCard({
  property,
  showSaveButton = true,
  className,
  variant = 'vertical',
}: PropertyCardProps) {
  const t = useTranslations();
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageUrl = property.images?.[0]?.url || getConsistentImage(property._id);
  
  // Handle image load error
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Get localized property type label
  const getPropertyTypeLabel = (type: string) => {
    const key = propertyTypeKeys[type];
    return key ? t(`propertyTypes.${key}`) : type;
  };

  // Get localized amenity label
  const getAmenityLabel = (amenityKey: string) => {
    return t(`amenities.${amenityKey}`);
  };
  const landlordName =
    property.landlordName ||
    (property.landlord ? `${property.landlord.firstName} ${property.landlord.lastName}` : '');
  const isVerified =
    property.verificationStatus === 'approved' ||
    property.landlord?.idVerified ||
    property.landlordVerified;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const amenityIcons = [
    { key: 'wifi', icon: Wifi, label: 'WiFi' },
    { key: 'parking', icon: Car, label: 'Parking' },
    { key: 'ac', icon: Wind, label: 'Climatisation' },
    { key: 'security', icon: Shield, label: 'Sécurité' },
  ];

  const activeAmenities = amenityIcons.filter(
    (a) => property.amenities?.[a.key as keyof typeof property.amenities]
  );

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/properties/${property._id}`}
        className={cn(
          'group flex gap-4 p-4 rounded-2xl bg-white border border-neutral-200 hover:shadow-lg transition-all',
          className
        )}
      >
        {/* Image */}
        <div className="relative w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
          {!imageLoaded && <div className="absolute inset-0 bg-neutral-200 animate-pulse" />}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
              <ImageOff className="w-8 h-8 text-neutral-400" />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={property.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              className={cn(
                'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
                !imageLoaded && 'opacity-0'
              )}
            />
          )}
          {isVerified && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-verified text-white rounded-full text-xs font-medium flex items-center gap-1">
              <span>✓</span>
              <span>Vérifié</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {property.neighborhood}, {property.city}
                </span>
              </div>
              <h3 className="font-medium text-neutral-900 line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
            </div>
            {showSaveButton && (
              <button
                type="button"
                onClick={handleSave}
                className="flex-shrink-0 p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <Heart
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isSaved ? 'fill-primary text-primary' : 'text-neutral-400'
                  )}
                />
              </button>
            )}
          </div>

          <p className="text-sm text-neutral-500 mt-1">
            {getPropertyTypeLabel(property.propertyType)}
            {property.bedrooms && ` • ${property.bedrooms} ch.`}
            {property.bathrooms && ` • ${property.bathrooms} sdb.`}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {activeAmenities.slice(0, 3).map(({ key, icon: Icon, label }) => (
                <div
                  key={key}
                  className="flex items-center gap-1 text-xs text-neutral-500"
                  title={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              ))}
            </div>
            <div>
              <span className="font-semibold text-neutral-900">
                {formatCurrency(property.rentAmount)} FCFA
              </span>
              <span className="text-neutral-500 text-sm"> /mois</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/properties/${property._id}`}
      className={cn('group block rounded-xl overflow-hidden bg-white card-hover', className)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
        {/* Placeholder while loading */}
        {!imageLoaded && <div className="absolute inset-0 bg-neutral-200 animate-pulse" />}

        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <ImageOff className="w-12 h-12 text-neutral-400" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={property.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            className={cn(
              'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
              !imageLoaded && 'opacity-0'
            )}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Save Button */}
        {showSaveButton && (
          <button
            type="button"
            onClick={handleSave}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md transition-all hover:scale-110 backdrop-blur-sm"
            aria-label={isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                isSaved ? 'fill-primary text-primary' : 'text-neutral-600'
              )}
            />
          </button>
        )}

        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-verified text-white rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
            <span>✓</span>
            <span>Vérifié</span>
          </div>
        )}

        {/* Image dots navigation (for multiple images) */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {property.images.slice(0, 5).map((_, index) => (
              <button
                key={index}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  index === currentImageIndex ? 'bg-white w-2' : 'bg-white/60'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-3 pb-1">
        {/* Location & Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-900">
            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
            <span>
              {property.neighborhood || property.city}
              {property.city !== property.neighborhood && `, ${property.city}`}
            </span>
          </div>
          <span className="text-sm text-neutral-600 flex items-center gap-1">
            <span className="text-amber-500">★</span>
            <span>Nouveau</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-neutral-600 text-sm mt-1 line-clamp-1">{property.title}</h3>

        {/* Type & Features */}
        <div className="flex items-center gap-3 text-sm text-neutral-500 mt-1">
          <span>{getPropertyTypeLabel(property.propertyType)}</span>
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {property.bathrooms}
            </span>
          )}
        </div>

        {/* Amenities */}
        {activeAmenities.length > 0 && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {activeAmenities.slice(0, 4).map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full touch-target"
                title={getAmenityLabel(key)}
              >
                <Icon className="w-3 h-3" />
                <span>{getAmenityLabel(key)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-semibold text-neutral-900 text-lg">
            {formatCurrency(property.rentAmount)} FCFA
          </span>
          <span className="text-neutral-500 text-sm">/mois</span>
        </div>

        {/* Landlord */}
        {landlordName && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-100">
            <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-600">
              {landlordName.charAt(0)}
            </div>
            <span className="text-xs text-neutral-500">
              Par <span className="font-medium text-neutral-700">{landlordName}</span>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
