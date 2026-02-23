import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Image Gallery Skeleton */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-[480px]">
        <Skeleton className="col-span-2 row-span-2 rounded-l-2xl" />
        <Skeleton className="rounded-tr-2xl" />
        <Skeleton />
        <Skeleton />
        <Skeleton className="rounded-br-2xl" />
      </div>

      {/* Mobile Image Skeleton */}
      <div className="md:hidden">
        <Skeleton className="h-[300px] w-full" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Stats Skeleton */}
            <div className="flex gap-6 pb-6 border-b border-border">
              <div className="text-center">
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="text-center">
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="text-center">
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Landlord Skeleton */}
            <div className="flex items-center gap-4 py-6 border-b border-border">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Description Skeleton */}
            <div>
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Amenities Skeleton */}
            <div className="pt-6 border-t border-border">
              <Skeleton className="h-6 w-64 mb-6" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-border rounded-2xl">
              <CardContent className="p-6">
                <Skeleton className="h-10 w-40 mb-2" />
                <Skeleton className="h-4 w-20 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-12 w-full mb-3" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
