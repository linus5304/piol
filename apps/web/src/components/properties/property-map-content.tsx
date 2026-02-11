'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import { useLocale } from 'gt-next/client';
import L from 'leaflet';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { Property, PropertyLocation, PropertyMapProps } from './property-map';
import { DEFAULT_CENTER, DEFAULT_ZOOM, formatCurrency, getConsistentImage } from './property-map';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in webpack/next.js
// biome-ignore lint/suspicious/noExplicitAny: Leaflet internal fix
// biome-ignore lint/performance/noDelete: Required for Leaflet marker icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom price marker icon
function createPriceIcon(price: number, isHovered = false, isSelected = false): L.DivIcon {
  const formattedPrice = formatCurrency(price);
  const isActive = isHovered || isSelected;
  return L.divIcon({
    className: 'price-marker',
    html: `
      <div class="price-marker-content ${isActive ? 'hovered' : ''} ${
        isSelected ? 'selected' : ''
      }">
        ${formattedPrice}
      </div>
    `,
    iconSize: [60, 28],
    iconAnchor: [30, 28],
    popupAnchor: [0, -28],
  });
}

// Component to fit map bounds to markers
function MapBounds({ properties }: { properties: (Property & { location: PropertyLocation })[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length === 0) return;

    const bounds = L.latLngBounds(
      properties.map((p) => [p.location.latitude, p.location.longitude])
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [map, properties]);

  return null;
}

// Property popup card
function PropertyPopupCard({ property }: { property: Property }) {
  const locale = parseAppLocale(useLocale());
  const imageUrl = property.images?.[0]?.url || getConsistentImage(property._id);
  const isVerified = property.verificationStatus === 'approved';

  return (
    <Link href={`/properties/${property._id}`} className="block">
      <Card className="w-64 overflow-hidden border-0 shadow-lg">
        <div className="relative h-32">
          <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
          {isVerified && (
            <Badge className="absolute top-2 left-2 rounded-full bg-success text-success-foreground border-0 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Vérifié
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <p className="font-medium text-sm line-clamp-1">{property.title}</p>
          <p className="text-xs text-muted-foreground">
            {property.neighborhood ? `${property.neighborhood}, ` : ''}
            {property.city}
          </p>
          <p className="font-semibold text-primary mt-1">
            {formatCurrencyFCFA(property.rentAmount, locale)}
            <span className="text-muted-foreground font-normal text-xs"> /mois</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

interface MapContentProps {
  properties: (Property & { location: PropertyLocation })[];
  hoveredPropertyId?: string | null;
  onPropertyHover?: (propertyId: string | null) => void;
  onPropertyClick?: (propertyId: string) => void;
  className?: string;
}

export function PropertyMapContent({
  properties,
  hoveredPropertyId,
  onPropertyHover,
  onPropertyClick,
  className,
}: MapContentProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Calculate initial center from properties
  const center = useMemo<[number, number]>(() => {
    if (properties.length === 0) return DEFAULT_CENTER;
    const avgLat = properties.reduce((sum, p) => sum + p.location.latitude, 0) / properties.length;
    const avgLng = properties.reduce((sum, p) => sum + p.location.longitude, 0) / properties.length;
    return [avgLat, avgLng];
  }, [properties]);

  return (
    <div className={cn('relative rounded-xl overflow-hidden', className)}>
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        style={{ minHeight: '400px' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds properties={properties} />

        {properties.map((property) => (
          <Marker
            key={property._id}
            position={[property.location.latitude, property.location.longitude]}
            icon={createPriceIcon(
              property.rentAmount,
              hoveredPropertyId === property._id,
              selectedPropertyId === property._id
            )}
            eventHandlers={{
              click: () => {
                setSelectedPropertyId(property._id);
                onPropertyClick?.(property._id);
              },
              mouseover: () => onPropertyHover?.(property._id),
              mouseout: () => onPropertyHover?.(null),
            }}
          >
            <Popup>
              <PropertyPopupCard property={property} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
