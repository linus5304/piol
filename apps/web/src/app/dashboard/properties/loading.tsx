import { Skeleton } from '@/components/ui/skeleton';

const ROW_KEYS = ['s-0', 's-1', 's-2', 's-3', 's-4'];

export default function PropertiesLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-border">
        {/* Header row */}
        <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/50">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Body rows */}
        {ROW_KEYS.map((id) => (
          <div
            key={id}
            className="flex items-center gap-4 p-4 border-b border-border last:border-b-0"
          >
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
