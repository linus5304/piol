'use client';

import { cn } from '@/lib/utils';

interface OptionSelectorOption {
  value: string;
  label: string;
}

interface OptionSelectorProps {
  options: OptionSelectorOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function OptionSelector({ options, value, onChange, className }: OptionSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
            )}
          >
            <span
              className={cn('h-2 w-2 rounded-full shrink-0', isActive ? 'bg-primary' : 'bg-border')}
            />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
