'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface PaginationFooterProps {
  status: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted';
  loadedCount: number;
  totalCount?: number;
  onLoadMore: () => void;
  itemLabel?: string;
  className?: string;
}

export function PaginationFooter({
  status,
  loadedCount,
  totalCount,
  onLoadMore,
  itemLabel = 'items',
  className,
}: PaginationFooterProps) {
  if (status === 'LoadingFirstPage' || loadedCount === 0) {
    return null;
  }

  const countText = totalCount
    ? `${loadedCount} sur ${totalCount} ${itemLabel}`
    : `${loadedCount} ${itemLabel}`;

  return (
    <div className={cn('flex flex-col items-center gap-2 pt-4', className)}>
      {status === 'CanLoadMore' && (
        <>
          <p className="text-sm text-muted-foreground font-mono tabular-nums">{countText}</p>
          <Button variant="outline" onClick={onLoadMore}>
            Charger plus
          </Button>
        </>
      )}
      {status === 'LoadingMore' && (
        <>
          <Spinner className="size-5 text-muted-foreground" />
          <span className="sr-only">Loading...</span>
        </>
      )}
      {status === 'Exhausted' && (
        <p className="text-sm text-muted-foreground font-mono tabular-nums">
          {totalCount ? `${totalCount} ${itemLabel}` : `${loadedCount} ${itemLabel}`}
        </p>
      )}
    </div>
  );
}
