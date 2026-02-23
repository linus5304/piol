'use client';

import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const LocationPickerContent = dynamic(
  () => import('./location-picker').then((mod) => mod.LocationPickerContent),
  {
    ssr: false,
    loading: () => <Skeleton className="h-24 w-full rounded-xl" />,
  }
);

interface LocationPickerProps {
  latitude?: string;
  longitude?: string;
  city?: string;
  onLocationChange: (lat: string, lng: string) => void;
}

export function LocationPicker(props: LocationPickerProps) {
  return <LocationPickerContent {...props} />;
}
