import { PropertyCardSkeleton } from '@/components/properties/property-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_KEYS = ['s-0', 's-1', 's-2', 's-3', 's-4', 's-5'];

export default function PropertiesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search bar skeleton */}
      <Skeleton className="h-10 w-full rounded-lg" />

      {/* Property grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKELETON_KEYS.map((id) => (
          <PropertyCardSkeleton key={id} />
        ))}
      </div>
    </div>
  );
}
