'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import type * as React from 'react';

import { cn } from '@/lib/utils';

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="field-group" className={cn('flex flex-col gap-6', className)} {...props} />
  );
}

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn('flex flex-col gap-4 border-0 p-0', className)}
      {...props}
    />
  );
}

function FieldLegend({ className, ...props }: React.ComponentProps<'legend'>) {
  return (
    <legend
      data-slot="field-legend"
      className={cn('mb-4 text-base font-semibold leading-none', className)}
      {...props}
    />
  );
}

function Field({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="field" className={cn('flex flex-col gap-2', className)} {...props} />;
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="field-label"
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="field-content" className={cn('flex flex-col gap-2', className)} {...props} />
  );
}

function FieldError({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-error"
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    />
  );
}

export {
  Field,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldLabel,
  FieldDescription,
  FieldContent,
  FieldError,
};
