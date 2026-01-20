import type * as React from 'react';

import { cn } from '@/lib/utils';

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn('flex flex-col items-center justify-center gap-4 py-12 text-center', className)}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn('flex flex-col items-center gap-2', className)}
      {...props}
    />
  );
}

function EmptyMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-media"
      className={cn(
        'flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3 data-slot="empty-title" className={cn('text-lg font-semibold', className)} {...props} />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-description"
      className={cn('max-w-sm text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-content"
      className={cn('flex flex-col items-center gap-2', className)}
      {...props}
    />
  );
}

export { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent };
