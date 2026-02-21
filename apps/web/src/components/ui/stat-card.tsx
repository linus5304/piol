import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: 'success' | 'warning' | 'default';
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

const variantStyles = {
  success: 'text-success',
  warning: 'text-warning',
  default: 'text-foreground',
};

export function StatCard({
  label,
  value,
  variant = 'default',
  subtitle,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-4 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <p
        className={cn('mt-1 text-2xl font-semibold font-mono tabular-nums', variantStyles[variant])}
      >
        {value}
      </p>
      {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
