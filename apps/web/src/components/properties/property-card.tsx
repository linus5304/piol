'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import {
  Bath,
  Bed,
  Car,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
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
    } | null;
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
  /** Controlled save state - if provided, component becomes controlled */
  isSaved?: boolean;
  /** Callback when save button is clicked - receives property ID */
  onToggleSave?: (propertyId: string) => void;
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
  isSaved: isSavedProp,
  onToggleSave,
  className,
  variant = 'vertical',
}: PropertyCardProps) {
  const t = useTranslations();
  // Use prop if provided (controlled), otherwise local state (uncontrolled)
  const [localSaved, setLocalSaved] = useState(false);
  const isSaved = isSavedProp ?? localSaved;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all valid image URLs, falling back to placeholder
  const allImages = property.images?.filter((img) => img.url).map((img) => img.url!) || [];
  const imageUrls = allImages.length > 0 ? allImages : [getConsistentImage(property._id)];
  const hasMultipleImages = imageUrls.length > 1;
  const imageUrl = imageUrls[0];

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
    if (onToggleSave) {
      onToggleSave(property._id);
    } else {
      setLocalSaved(!localSaved);
    }
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
        <Card className="card-hover rounded-2xl overflow-hidden border border-border/50 bg-card">
          <CardContent className="p-0 flex gap-0">
            {/* Image */}
            <div className="relative w-48 h-36 flex-shrink-0 overflow-hidden bg-muted">
              {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <ImageOff className="w-8 h-8 text-muted-foreground" />
                </div>
              ) : (
                <>
                  <Image
                    src={imageUrl}
                    alt={property.title}
                    fill
                    sizes="192px"
                    onLoad={() => setImageLoaded(true)}
                    onError={handleImageError}
                    className={cn(
                      'object-cover transition-transform duration-300 group-hover:scale-105',
                      !imageLoaded && 'opacity-0'
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />
                </>
              )}
              {isVerified && (
                <Badge className="absolute top-2 left-2 rounded-full bg-success text-success-foreground border-0 shadow-md backdrop-blur-sm text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Vérifié
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {property.neighborhood}, {property.city}
                      </span>
                    </div>
                    <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                  </div>
                  {showSaveButton && (
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
                    >
                      <Heart
                        className={cn(
                          'w-5 h-5 transition-colors',
                          isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span className="font-medium">{getPropertyTypeLabel(property.propertyType)}</span>
                  {property.bedrooms && (
                    <>
                      <span className="text-border">•</span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5" />
                        {property.bedrooms}
                      </span>
                    </>
                  )}
                  {property.bathrooms && (
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5" />
                      {property.bathrooms}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  {activeAmenities.slice(0, 3).map(({ key, icon: Icon, label }) => (
                    <div
                      key={key}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title={label}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground font-mono tabular-nums">
                    {formatCurrency(property.rentAmount)}
                  </span>
                  <span className="text-muted-foreground text-sm"> FCFA/mois</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Handle carousel navigation
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <Link href={`/properties/${property._id}`} className={cn('group block', className)}>
      <Card className="overflow-hidden card-hover rounded-2xl border border-border/50 bg-card shadow-sm">
        {/* Image Container with Carousel */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ImageOff className="w-12 h-12 text-muted-foreground" />
            </div>
          ) : (
            <>
              <Image
                src={imageUrls[currentImageIndex]}
                alt={property.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                className={cn(
                  'object-cover transition-all duration-300 group-hover:scale-105',
                  !imageLoaded && 'opacity-0'
                )}
              />
              {/* Gradient overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </>
          )}

          {/* Carousel Navigation - Only show when multiple images */}
          {hasMultipleImages && (
            <>
              {/* Previous Button */}
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black/90 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black/90 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Dots Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                {imageUrls.map((_, index) => (
                  <button
                    type="button"
                    key={`dot-${property._id}-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={cn(
                      'rounded-full transition-all duration-200',
                      index === currentImageIndex
                        ? 'bg-white w-2 h-2'
                        : 'bg-white/50 w-1.5 h-1.5 hover:bg-white/70'
                    )}
                    aria-label={`Image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Save Button */}
          {showSaveButton && (
            <button
              type="button"
              onClick={handleSave}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black/90 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 touch-target z-10"
              aria-label={isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart
                className={cn(
                  'w-5 h-5 transition-colors',
                  isSaved ? 'fill-primary text-primary' : 'text-foreground'
                )}
              />
            </button>
          )}

          {/* Verified Badge */}
          {isVerified && (
            <Badge className="absolute top-3 left-3 rounded-full bg-success text-success-foreground border-0 shadow-lg backdrop-blur-sm z-10 font-medium">
              <CheckCircle className="w-3 h-3 mr-1" />
              Vérifié
            </Badge>
          )}

          {/* Image counter badge */}
          {hasMultipleImages && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full z-10">
              {currentImageIndex + 1} / {imageUrls.length}
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {property.neighborhood || property.city}
              {property.city !== property.neighborhood && `, ${property.city}`}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Type & Features */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{getPropertyTypeLabel(property.propertyType)}</span>
            <span className="text-border">•</span>
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
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeAmenities.slice(0, 3).map(({ key, icon: Icon }) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="gap-1 text-xs rounded-md px-2 py-0.5 font-normal"
                >
                  <Icon className="w-3 h-3" />
                  {getAmenityLabel(key)}
                </Badge>
              ))}
              {activeAmenities.length > 3 && (
                <Badge variant="secondary" className="text-xs rounded-md px-2 py-0.5 font-normal">
                  +{activeAmenities.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Price */}
          <div className="pt-2 flex items-baseline gap-1 border-t border-border/50">
            <span className="font-bold text-lg text-foreground font-mono tabular-nums">
              {formatCurrency(property.rentAmount)}
            </span>
            <span className="text-sm text-muted-foreground">FCFA/mois</span>
          </div>

          {/* Landlord */}
          {landlordName && (
            <div className="flex items-center gap-2 pt-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
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
