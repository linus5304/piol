import { Skeleton } from '@/components/ui/skeleton';

export default function MessageThreadLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header bar */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Message bubbles */}
      <div className="flex-1 p-4 space-y-4">
        {/* Left bubble */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <Skeleton className="h-16 w-48 rounded-2xl rounded-tl-sm" />
        </div>

        {/* Right bubble */}
        <div className="flex justify-end">
          <Skeleton className="h-12 w-56 rounded-2xl rounded-tr-sm" />
        </div>

        {/* Left bubble */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <Skeleton className="h-20 w-64 rounded-2xl rounded-tl-sm" />
        </div>

        {/* Right bubble */}
        <div className="flex justify-end">
          <Skeleton className="h-12 w-40 rounded-2xl rounded-tr-sm" />
        </div>
      </div>

      {/* Composer bar */}
      <div className="flex items-center gap-2 p-4 border-t border-border">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}
