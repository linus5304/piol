'use client';

import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const PropertyDetailMap = dynamic(
  () => import('./property-detail-map').then((mod) => mod.PropertyDetailMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full rounded-2xl" />,
  }
);

interface PropertyDetailMapWrapperProps {
  latitude: number;
  longitude: number;
}

export function PropertyDetailMapWrapper(props: PropertyDetailMapWrapperProps) {
  return <PropertyDetailMap {...props} />;
}
