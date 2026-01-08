import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export function PropertyCardSkeleton() {
  return (
    <article className="cursor-pointer">
      {/* Image Container */}
      <Skeleton className="aspect-[4/3] rounded-lg sm:rounded-xl" />

      {/* Details Section */}
      <div className="mt-2 space-y-1.5">
        {/* Location + Rating */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>

        {/* Title */}
        <Skeleton className="h-4 w-full sm:h-5" />

        {/* Desktop: Distance + Bedrooms */}
        <div className="hidden items-center gap-3 sm:flex">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Price */}
        <Skeleton className="h-5 w-32 sm:h-6" />
      </div>
    </article>
  );
}

interface PropertyGridSkeletonProps {
  count?: number;
}

export function PropertyGridSkeleton({ count = 6 }: PropertyGridSkeletonProps) {
  const skeletonIds = useMemo(
    () => Array.from({ length: count }, (_, i) => `skeleton-${i}`),
    [count]
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">
      {skeletonIds.map((id) => (
        <PropertyCardSkeleton key={id} />
      ))}
    </div>
  );
}
