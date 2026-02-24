import { Skeleton } from '@/components/ui/skeleton';

const ROW_KEYS = ['r-0', 'r-1', 'r-2', 'r-3', 'r-4'];

export default function UsersLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-border">
        <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/50">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        {ROW_KEYS.map((id) => (
          <div
            key={id}
            className="flex items-center gap-4 p-4 border-b border-border last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
