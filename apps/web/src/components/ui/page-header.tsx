import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderAction {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  count?: number;
  action?: PageHeaderAction;
  subtitle?: string;
  backHref?: string;
  className?: string;
}

export function PageHeader({
  title,
  count,
  action,
  subtitle,
  backHref,
  className,
}: PageHeaderProps) {
  const actionButton = action && (
    <Button onClick={action.onClick}>
      {action.icon && <action.icon className="h-4 w-4" />}
      {action.label}
    </Button>
  );

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-4">
        {backHref && (
          <Link href={backHref}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold leading-tight text-foreground">{title}</h1>
            {count !== undefined && (
              <span className="text-lg font-mono tabular-nums text-muted-foreground">{count}</span>
            )}
          </div>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action && (action.href ? <Link href={action.href}>{actionButton}</Link> : actionButton)}
    </div>
  );
}
