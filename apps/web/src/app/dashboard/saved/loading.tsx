import { PropertyCardSkeleton } from '@/components/properties/property-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_KEYS = ['s-0', 's-1', 's-2', 's-3'];

export default function SavedLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SKELETON_KEYS.map((id) => (
          <PropertyCardSkeleton key={id} />
        ))}
      </div>
    </div>
  );
}
