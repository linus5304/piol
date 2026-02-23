'use client';

import { Button } from '@/components/ui/button';
import { CITY_CENTERS, MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '@/lib/mapbox';
import type { City } from '@/lib/validations';
import { useTranslations } from 'gt-next';
import { Crosshair, Loader2, MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface LocationPickerProps {
  latitude?: string;
  longitude?: string;
  city?: string;
  onLocationChange: (lat: string, lng: string) => void;
}

export function LocationPickerContent({
  latitude,
  longitude,
  city,
  onLocationChange,
}: LocationPickerProps) {
  const t = useTranslations();
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);
  onLocationChangeRef.current = onLocationChange;

  const hasCoords =
    latitude && longitude && latitude.trim().length > 0 && longitude.trim().length > 0;

  const markerPosition = useMemo<[number, number] | null>(() => {
    if (!hasCoords) return null;
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lng, lat]; // Mapbox: [lng, lat]
    return null;
  }, [hasCoords, latitude, longitude]);

  const center = useMemo<[number, number]>(() => {
    if (markerPosition) return markerPosition;
    if (city && city in CITY_CENTERS) {
      const c = CITY_CENTERS[city as City];
      return [c.lng, c.lat];
    }
    return [11.5021, 3.848]; // Default: Yaoundé [lng, lat]
  }, [markerPosition, city]);

  // Stable helper: place or move marker
  const placeMarker = useCallback((map: mapboxgl.Map, lng: number, lat: number) => {
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    } else {
      const marker = new mapboxgl.Marker({ draggable: true }).setLngLat([lng, lat]).addTo(map);

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        onLocationChangeRef.current(String(lngLat.lat), String(lngLat.lng));
      });

      markerRef.current = marker;
    }
  }, []);

  // Initialize map when city changes
  useEffect(() => {
    if (!containerRef.current || !MAPBOX_ACCESS_TOKEN || !city) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE,
      center,
      zoom: 14,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Click-to-place marker
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      placeMarker(map, lng, lat);
      onLocationChangeRef.current(String(lat), String(lng));
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [city, center, placeMarker]);

  // Update marker position when coordinates change externally
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !markerPosition) return;

    const update = () => {
      placeMarker(map, markerPosition[0], markerPosition[1]);
      map.flyTo({ center: markerPosition, zoom: 14 });
    };

    if (map.loaded()) {
      update();
    } else {
      map.on('load', update);
    }
  }, [markerPosition, placeMarker]);

  // Fly to city center when city changes (without marker position)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !city || markerPosition) return;

    if (city in CITY_CENTERS) {
      const c = CITY_CENTERS[city as City];
      map.flyTo({ center: [c.lng, c.lat], zoom: c.zoom });
    }
  }, [city, markerPosition]);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(t('locationPicker.locationUnavailable'));
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        onLocationChangeRef.current(String(lat), String(lng));

        const map = mapRef.current;
        if (map) {
          placeMarker(map, lng, lat);
          map.flyTo({ center: [lng, lat], zoom: 16 });
        }

        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError(t('locationPicker.locationDenied'));
        } else {
          setError(t('locationPicker.locationUnavailable'));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [placeMarker, t]);

  if (!city) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 flex flex-col items-center justify-center gap-2 text-center">
        <MapPin className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t('locationPicker.selectCityFirst')}</p>
      </div>
    );
  }

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="rounded-xl border border-border p-6 flex flex-col items-center justify-center gap-2 text-center">
        <MapPin className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Map unavailable</p>
      </div>
    );
  }

  const displayPosition = markerPosition
    ? [markerPosition[1], markerPosition[0]] // Convert back to [lat, lng] for display
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseMyLocation}
          disabled={isLocating}
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Crosshair className="w-4 h-4 mr-2" />
          )}
          {t('locationPicker.useMyLocation')}
        </Button>
        {displayPosition && (
          <span className="text-xs text-muted-foreground">{t('locationPicker.dragToAdjust')}</span>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden border border-border">
        <div ref={containerRef} className="h-64 w-full" />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {displayPosition && (
        <p className="text-xs text-muted-foreground">
          {t('locationPicker.locationCaptured')}: {displayPosition[0].toFixed(6)},{' '}
          {displayPosition[1].toFixed(6)}
        </p>
      )}
    </div>
  );
}
