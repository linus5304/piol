import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_KEYS = ['s-0', 's-1', 's-2', 's-3'];

export default function VerifyLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />

      {/* Mobile: card layout */}
      <div className="md:hidden space-y-4">
        {SKELETON_KEYS.map((id) => (
          <Skeleton key={id} className="h-24 w-full rounded-lg" />
        ))}
      </div>
      {/* Desktop: detailed cards */}
      <div className="hidden md:block space-y-4">
        {SKELETON_KEYS.map((id) => (
          <Card key={id}>
            <CardContent className="p-4 flex items-center gap-4">
              <Skeleton className="h-20 w-28 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex gap-2 shrink-0">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
