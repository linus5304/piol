import { cn } from '@/lib/utils';

interface InlineStatsItem {
  count: number;
  label: string;
  dotColor: string;
}

interface InlineStatsProps {
  items: InlineStatsItem[];
  className?: string;
}

export function InlineStats({ items, className }: InlineStatsProps) {
  return (
    <div className={cn('flex items-center gap-6 text-sm', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={cn('h-2 w-2 rounded-full shrink-0', item.dotColor)} />
          <span className="font-mono tabular-nums font-medium text-foreground">{item.count}</span>
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
