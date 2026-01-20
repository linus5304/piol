import type * as React from 'react';

import { cn } from '@/lib/utils';

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        'flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input-group-input"
      className={cn(
        'flex h-10 w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="input-group-textarea"
      className={cn(
        'flex min-h-[80px] w-full resize-none bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function InputGroupAddon({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn(
        'flex h-10 items-center justify-center px-3 text-sm text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function InputGroupButton({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      data-slot="input-group-button"
      type="button"
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-r-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupInput, InputGroupTextarea, InputGroupAddon, InputGroupButton };
