'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CheckCircle, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

// Types for property data
interface PropertyLocation {
  latitude: number;
  longitude: number;
}

interface Property {
  _id: string;
  title: string;
  rentAmount: number;
  currency: string;
  city: string;
  neighborhood?: string;
  location?: PropertyLocation;
  images?: { url?: string; storageId?: string }[];
  verificationStatus?: string;
  propertyType?: string;
}

interface PropertyMapProps {
  properties: Property[];
  hoveredPropertyId?: string | null;
  onPropertyHover?: (propertyId: string | null) => void;
  onPropertyClick?: (propertyId: string) => void;
  className?: string;
}

// Curated list of beautiful property images from Unsplash (fallback)
const propertyImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
];

function getConsistentImage(id: string): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return propertyImages[hash % propertyImages.length];
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k`;
  }
  return amount.toString();
}

// Default center for Cameroon (Yaoundé)
const DEFAULT_CENTER: [number, number] = [3.848, 11.5021];
const DEFAULT_ZOOM = 12;

// Map component with Leaflet (loaded dynamically to avoid SSR issues)
const MapContent = dynamic(
  () => import('./property-map-content').then((mod) => mod.PropertyMapContent),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-muted rounded-xl">
        <div className="text-center">
          <Skeleton className="h-8 w-8 rounded-full mx-auto mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    ),
  }
);

export function PropertyMap({
  properties,
  hoveredPropertyId,
  onPropertyHover,
  onPropertyClick,
  className,
}: PropertyMapProps) {
  // Filter properties with valid locations
  const propertiesWithLocation = useMemo(
    () =>
      properties.filter(
        (p): p is Property & { location: PropertyLocation } =>
          !!p.location?.latitude && !!p.location?.longitude
      ),
    [properties]
  );

  if (propertiesWithLocation.length === 0) {
    return (
      <div className={cn('flex items-center justify-center bg-muted rounded-xl', className)}>
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground">Aucune propriété avec coordonnées</p>
          <p className="text-sm text-muted-foreground mt-1">
            Les propriétés sans localisation ne peuvent pas être affichées sur la carte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MapContent
      properties={propertiesWithLocation}
      hoveredPropertyId={hoveredPropertyId}
      onPropertyHover={onPropertyHover}
      onPropertyClick={onPropertyClick}
      className={className}
    />
  );
}

// Export types and helpers for the map content component
export type { Property, PropertyLocation, PropertyMapProps };
export { formatCurrency, getConsistentImage, DEFAULT_CENTER, DEFAULT_ZOOM };
