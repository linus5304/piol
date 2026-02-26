import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const STAT_KEYS = ['s-0', 's-1', 's-2', 's-3'];
const ROW_KEYS = ['r-0', 'r-1', 'r-2', 'r-3', 'r-4'];

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_KEYS.map((id) => (
          <Card key={id}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart skeleton */}
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>

      {/* Mobile: card layout */}
      <div className="md:hidden space-y-4">
        {ROW_KEYS.map((id) => (
          <Skeleton key={id} className="h-24 w-full rounded-lg" />
        ))}
      </div>
      {/* Desktop: table rows */}
      <div className="hidden md:block rounded-lg border border-border">
        <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/50">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        {ROW_KEYS.map((id) => (
          <div
            key={id}
            className="flex items-center gap-4 p-4 border-b border-border last:border-b-0"
          >
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
