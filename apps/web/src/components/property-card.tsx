'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Bath,
  Bed,
  Car,
  CheckCircle,
  Heart,
  ImageOff,
  MapPin,
  Shield,
  Wifi,
  Wind,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';

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

// Curated list of beautiful property images from Unsplash
const propertyImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
];

function getConsistentImage(id: string): string {
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

  const imageUrl = property.images?.[0]?.url || getConsistentImage(property._id);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const getPropertyTypeLabel = (type: string) => {
    const key = propertyTypeKeys[type];
    return key ? t(`propertyTypes.${key}`) : type;
  };

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
      <Link href={`/properties/${property._id}`} className={cn('group block', className)}>
        <Card className="hover:shadow-card transition-all rounded-xl overflow-hidden">
          <CardContent className="p-0 flex gap-4">
            {/* Image */}
            <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden bg-muted rounded-l-xl">
              {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <ImageOff className="w-8 h-8 text-muted-foreground" />
                </div>
              ) : (
                <Image
                  src={imageUrl}
                  alt={property.title}
                  fill
                  sizes="192px"
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                  className={cn('object-cover', !imageLoaded && 'opacity-0')}
                />
              )}
              {isVerified && (
                <Badge className="absolute top-2 left-2 rounded-full bg-[#008A05] text-white border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Vérifié
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-3 pr-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {property.neighborhood}, {property.city}
                    </span>
                  </div>
                  <h3 className="font-medium line-clamp-1 group-hover:text-[#FF385C] transition-colors">
                    {property.title}
                  </h3>
                </div>
                {showSaveButton && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-shrink-0 p-2 hover:bg-muted rounded-full transition-colors touch-target"
                  >
                    <Heart
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isSaved ? 'fill-[#FF385C] text-[#FF385C]' : 'text-muted-foreground'
                      )}
                    />
                  </button>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-1">
                {getPropertyTypeLabel(property.propertyType)}
                {property.bedrooms && ` • ${property.bedrooms} ch.`}
                {property.bathrooms && ` • ${property.bathrooms} sdb.`}
              </p>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {activeAmenities.slice(0, 3).map(({ key, icon: Icon, label }) => (
                    <div key={key} className="text-muted-foreground" title={label}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  ))}
                </div>
                <div>
                  <span className="font-semibold text-[#FF385C]">
                    {formatCurrency(property.rentAmount)} FCFA
                  </span>
                  <span className="text-muted-foreground text-sm"> /mois</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/properties/${property._id}`} className={cn('group block', className)}>
      <Card className="overflow-hidden card-hover rounded-xl border-0 shadow-sm">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-t-xl">
          {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ImageOff className="w-12 h-12 text-muted-foreground" />
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              className={cn(
                'object-cover group-hover:scale-105 transition-transform duration-300',
                !imageLoaded && 'opacity-0'
              )}
            />
          )}

          {/* Save Button */}
          {showSaveButton && (
            <button
              type="button"
              onClick={handleSave}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-sm transition-all touch-target"
              aria-label={isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart
                className={cn(
                  'w-5 h-5 transition-colors',
                  isSaved ? 'fill-[#FF385C] text-[#FF385C]' : 'text-foreground'
                )}
              />
            </button>
          )}

          {/* Verified Badge */}
          {isVerified && (
            <Badge className="absolute top-3 left-3 rounded-full bg-[#008A05] text-white border-0">
              <CheckCircle className="w-3 h-3 mr-1" />
              Vérifié
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {property.neighborhood || property.city}
              {property.city !== property.neighborhood && `, ${property.city}`}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-medium mt-1 line-clamp-1 group-hover:text-[#FF385C] transition-colors">
            {property.title}
          </h3>

          {/* Type & Features */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
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
                <Badge key={key} variant="secondary" className="gap-1 text-xs rounded-full">
                  <Icon className="w-3 h-3" />
                  {getAmenityLabel(key)}
                </Badge>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-semibold text-lg text-[#FF385C]">
              {formatCurrency(property.rentAmount)} FCFA
            </span>
            <span className="text-muted-foreground text-sm">/mois</span>
          </div>

          {/* Landlord */}
          {landlordName && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <div className="w-7 h-7 bg-gradient-to-br from-[#FF385C] to-[#E31C5F] rounded-full flex items-center justify-center text-xs font-medium text-white">
                {landlordName.charAt(0)}
              </div>
              <span className="text-xs text-muted-foreground">
                Par <span className="font-medium text-foreground">{landlordName}</span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
