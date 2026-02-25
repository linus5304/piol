'use client';

import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '@/lib/mapbox';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';

interface PropertyDetailMapProps {
  latitude: number;
  longitude: number;
}

export function PropertyDetailMap({ latitude, longitude }: PropertyDetailMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || !MAPBOX_ACCESS_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: MAPBOX_STYLE,
        center: [longitude, latitude],
        zoom: 15,
        scrollZoom: false,
      });
    } catch (err) {
      console.error('[PropertyDetailMap] Map init failed:', err);
      return;
    }

    map.on('load', () => map.resize());

    map.on('error', (e) => {
      console.error('[PropertyDetailMap] Mapbox error:', e.error);
    });

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapRef.current = map;

    return () => {
      try {
        map.remove();
        mapRef.current = null;
      } catch {
        // Mapbox cleanup can throw during active teardown — safe to ignore
        mapRef.current = null;
      }
    };
  }, [latitude, longitude]);

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted rounded-2xl">
        <p className="text-muted-foreground text-sm">Map unavailable</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      <div ref={containerRef} className="h-64 w-full" />
    </div>
  );
}
