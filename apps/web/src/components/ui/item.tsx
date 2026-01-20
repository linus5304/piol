import type * as React from 'react';

import { cn } from '@/lib/utils';

function ItemGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-group"
      className={cn('flex flex-col divide-y divide-border', className)}
      {...props}
    />
  );
}

function Item({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item"
      className={cn(
        'flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors',
        className
      )}
      {...props}
    />
  );
}

function ItemMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-media"
      className={cn('flex shrink-0 items-center justify-center', className)}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-title"
      className={cn('truncate text-sm font-medium leading-none', className)}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-description"
      className={cn('truncate text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn('flex shrink-0 items-center gap-2', className)}
      {...props}
    />
  );
}

function ItemSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="item-separator" className={cn('h-px bg-border', className)} {...props} />;
}

export {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
};
