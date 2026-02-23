import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_KEYS = ['s-0', 's-1', 's-2', 's-3', 's-4', 's-5'];

export default function MessagesLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-10 w-full rounded-lg mb-4" />

      {/* Conversation list skeleton */}
      <div className="space-y-3">
        {SKELETON_KEYS.map((id) => (
          <div key={id} className="flex items-center gap-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
