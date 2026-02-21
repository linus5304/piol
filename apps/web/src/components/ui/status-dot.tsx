import { cn } from '@/lib/utils';

interface StatusDotProps {
  status: string;
  config: Record<string, { dot: string; label: string }>;
  size?: 'sm' | 'default';
  className?: string;
}

export const propertyStatusConfig: Record<string, { dot: string; label: string }> = {
  active: { dot: 'bg-success', label: 'Active' },
  draft: { dot: 'bg-muted-foreground', label: 'Draft' },
  pending_verification: { dot: 'bg-warning', label: 'Pending' },
  verified: { dot: 'bg-success', label: 'Verified' },
  rented: { dot: 'bg-primary', label: 'Rented' },
  archived: { dot: 'bg-muted-foreground', label: 'Archived' },
};

export const paymentStatusConfig: Record<string, { dot: string; label: string }> = {
  completed: { dot: 'bg-success', label: 'Completed' },
  pending: { dot: 'bg-warning', label: 'Pending' },
  processing: { dot: 'bg-warning', label: 'Processing' },
  failed: { dot: 'bg-destructive', label: 'Failed' },
  refunded: { dot: 'bg-muted-foreground', label: 'Refunded' },
};

export const verificationStatusConfig: Record<string, { dot: string; label: string }> = {
  approved: { dot: 'bg-success', label: 'Approved' },
  pending: { dot: 'bg-warning', label: 'Pending' },
  in_progress: { dot: 'bg-warning', label: 'In progress' },
  rejected: { dot: 'bg-destructive', label: 'Rejected' },
};

export function StatusDot({ status, config, size = 'default', className }: StatusDotProps) {
  const entry = config[status];
  if (!entry) return null;

  return (
    <span className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'rounded-full shrink-0',
          size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
          entry.dot
        )}
      />
      <span className={cn('text-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {entry.label}
      </span>
    </span>
  );
}
