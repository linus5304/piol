'use client';

import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA } from '@/lib/i18n-format';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '@/lib/mapbox';
import { cn } from '@/lib/utils';
import { useLocale } from 'gt-next/client';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import type { Property, PropertyLocation } from './property-map';
import { DEFAULT_CENTER, DEFAULT_ZOOM, formatCurrency, getConsistentImage } from './property-map';

interface MapContentProps {
  properties: (Property & { location: PropertyLocation })[];
  hoveredPropertyId?: string | null;
  onPropertyHover?: (propertyId: string | null) => void;
  onPropertyClick?: (propertyId: string) => void;
  className?: string;
}

function createPopupHTML(property: Property, locale: string): string {
  const imageUrl = property.images?.[0]?.url || getConsistentImage(property._id);
  const isVerified = property.verificationStatus === 'approved';
  const verifiedBadge = isVerified
    ? '<span style="position:absolute;top:8px;left:8px;background:#34d399;color:#0c1222;font-size:11px;font-weight:600;padding:2px 8px;border-radius:9999px;">Verified</span>'
    : '';

  return `
    <a href="/properties/${property._id}" style="display:block;text-decoration:none;color:inherit;">
      <div style="width:256px;overflow:hidden;">
        <div style="position:relative;height:128px;">
          <img src="${imageUrl}" alt="${property.title}" style="width:100%;height:100%;object-fit:cover;" />
          ${verifiedBadge}
        </div>
        <div style="padding:12px;">
          <p style="font-weight:500;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0;">${property.title}</p>
          <p style="font-size:12px;color:var(--muted-foreground);margin:2px 0 0;">
            ${property.neighborhood ? `${property.neighborhood}, ` : ''}${property.city}
          </p>
          <p style="font-weight:600;color:var(--primary);margin:4px 0 0;">
            ${formatCurrencyFCFA(property.rentAmount, locale)}
            <span style="color:var(--muted-foreground);font-weight:400;font-size:12px;"> /mois</span>
          </p>
        </div>
      </div>
    </a>
  `;
}

export function PropertyMapContent({
  properties,
  hoveredPropertyId,
  onPropertyHover,
  onPropertyClick,
  className,
}: MapContentProps) {
  const locale = parseAppLocale(useLocale());
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; el: HTMLDivElement }>>(
    new Map()
  );
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Calculate initial center (stored in ref so map only initializes once)
  const initialCenter = useRef<[number, number] | null>(null);
  if (initialCenter.current === null) {
    if (properties.length === 0) {
      initialCenter.current = [DEFAULT_CENTER[1], DEFAULT_CENTER[0]]; // [lng, lat]
    } else {
      const avgLat =
        properties.reduce((sum, p) => sum + p.location.latitude, 0) / properties.length;
      const avgLng =
        properties.reduce((sum, p) => sum + p.location.longitude, 0) / properties.length;
      initialCenter.current = [avgLng, avgLat];
    }
  }

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || !MAPBOX_ACCESS_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE,
      center: initialCenter.current ?? [DEFAULT_CENTER[1], DEFAULT_CENTER[0]],
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    return () => {
      for (const { marker } of markersRef.current.values()) {
        marker.remove();
      }
      markersRef.current.clear();
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Manage markers when properties change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const addMarkers = () => {
      // Remove old markers
      for (const { marker } of markersRef.current.values()) {
        marker.remove();
      }
      markersRef.current.clear();

      if (properties.length === 0) return;

      const bounds = new mapboxgl.LngLatBounds();

      for (const property of properties) {
        const lngLat: [number, number] = [property.location.longitude, property.location.latitude];
        bounds.extend(lngLat);

        const el = document.createElement('div');
        el.className = 'price-marker';
        el.textContent = formatCurrency(property.rentAmount);

        el.addEventListener('mouseenter', () => {
          onPropertyHover?.(property._id);
        });
        el.addEventListener('mouseleave', () => {
          onPropertyHover?.(null);
        });
        el.addEventListener('click', () => {
          setSelectedPropertyId(property._id);
          onPropertyClick?.(property._id);

          popupRef.current?.remove();
          const popup = new mapboxgl.Popup({
            offset: [0, -10],
            maxWidth: '280px',
          })
            .setLngLat(lngLat)
            .setHTML(createPopupHTML(property, locale))
            .addTo(map);
          popupRef.current = popup;
        });

        const marker = new mapboxgl.Marker({ element: el }).setLngLat(lngLat).addTo(map);

        markersRef.current.set(property._id, { marker, el });
      }

      map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    };

    if (map.loaded()) {
      addMarkers();
    } else {
      map.on('load', addMarkers);
    }
  }, [properties, onPropertyHover, onPropertyClick, locale]);

  // Update marker styles on hover/selection changes
  useEffect(() => {
    for (const [id, { el }] of markersRef.current.entries()) {
      const isHovered = hoveredPropertyId === id;
      const isSelected = selectedPropertyId === id;
      el.classList.toggle('hovered', isHovered);
      el.classList.toggle('selected', isSelected);
    }
  }, [hoveredPropertyId, selectedPropertyId]);

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <div className={cn('flex items-center justify-center bg-muted rounded-xl', className)}>
        <p className="text-muted-foreground text-sm">Map unavailable</p>
      </div>
    );
  }

  return (
    <div className={cn('relative rounded-xl overflow-hidden', className)}>
      <div ref={containerRef} className="h-full w-full" style={{ minHeight: '400px' }} />
    </div>
  );
}
