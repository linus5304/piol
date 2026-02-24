import { Skeleton } from '@/components/ui/skeleton';

const FIELD_KEYS = ['s-0', 's-1', 's-2', 's-3', 's-4', 's-5', 's-6'];

export default function NewPropertyLoading() {
  return (
    <div className="max-w-2xl space-y-6">
      <Skeleton className="h-8 w-48" />

      {/* Form fields skeleton */}
      <div className="space-y-5">
        {FIELD_KEYS.map((id) => (
          <div key={id} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <Skeleton className="h-10 w-36" />
    </div>
  );
}
