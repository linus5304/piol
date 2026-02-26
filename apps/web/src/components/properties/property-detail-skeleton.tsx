import { Skeleton } from '@/components/ui/skeleton';

/**
 * Dossier section label skeleton — mirrors the mono uppercase headers in CostCalcA.
 */
function SectionLabelSkeleton({ className }: { className?: string }) {
  return (
    <div className="border-b border-border pb-2 mb-4">
      <Skeleton className={`h-3 ${className ?? 'w-32'}`} />
    </div>
  );
}

/**
 * Dossier content shared between desktop left-panel and mobile view.
 */
function DossierContentSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-8 space-y-8">
      {/* 1. DOSSIER HEADER */}
      <div className="border-b-2 border-border pb-6 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-3/4" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-baseline justify-between mt-3">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* 2. ACTION BAR */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-28 rounded-sm" />
        <Skeleton className="h-9 w-24 rounded-sm" />
        <Skeleton className="h-9 w-28 rounded-sm" />
      </div>

      {/* 3. FINANCIAL ANALYSIS */}
      <div>
        <SectionLabelSkeleton className="w-36" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-baseline justify-between py-2.5 border-b border-dotted border-border"
          >
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
        <div className="flex items-baseline justify-between py-3 border-t-2 border-foreground/20 mt-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Projections grid */}
        <div className="mt-6">
          <Skeleton className="h-3 w-28 mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-border">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card p-3 text-center space-y-1">
                <Skeleton className="h-3 w-12 mx-auto" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. DESCRIPTION */}
      <div>
        <SectionLabelSkeleton className="w-24" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
      </div>

      {/* 5. MAP */}
      <div>
        <SectionLabelSkeleton className="w-28" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="flex items-center justify-between mt-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-24 rounded-sm" />
        </div>
      </div>

      {/* 6. AMENITIES */}
      <div>
        <SectionLabelSkeleton className="w-28" />
        <div className="space-y-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-6" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* 7. LANDLORD */}
      <div>
        <SectionLabelSkeleton className="w-28" />
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <div className="space-y-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-baseline justify-between py-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* 8. SECURITY */}
      <div>
        <SectionLabelSkeleton className="w-20" />
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-3 w-full max-w-md" />
          ))}
        </div>
      </div>

      {/* 9. DESKTOP CTA */}
      <div className="pt-4 pb-8 hidden lg:block">
        <Skeleton className="h-11 w-full rounded-sm" />
      </div>
    </div>
  );
}

export function PropertyDetailSkeleton() {
  return (
    <>
      {/* Mobile: carousel placeholder on top */}
      <div className="lg:hidden">
        <Skeleton className="h-[320px] w-full rounded-none" />
      </div>

      {/* Split-screen layout */}
      <div className="flex min-h-screen pb-24 lg:pb-0">
        {/* Left panel — scrollable dossier */}
        <div className="flex-1 lg:w-[57%] lg:min-w-0 bg-card">
          <DossierContentSkeleton />
        </div>

        {/* Right panel — sticky image area (desktop only) */}
        <div className="hidden lg:block lg:w-[43%] sticky top-0 h-screen bg-background overflow-hidden">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0 space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-10 w-32 rounded-sm shrink-0" />
        </div>
      </div>
    </>
  );
}
