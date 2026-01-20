'use client';

import { cn } from '@/lib/utils';
import { CreditCard, Heart, Home, MessageSquare, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TabItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const renterTabs: TabItem[] = [
  { title: 'Accueil', href: '/dashboard', icon: Home },
  { title: 'Favoris', href: '/dashboard/saved', icon: Heart },
  { title: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { title: 'Paiements', href: '/dashboard/payments', icon: CreditCard },
  { title: 'Paramètres', href: '/dashboard/settings', icon: Settings },
];

interface DashboardTabsProps {
  tabs?: TabItem[];
  className?: string;
}

export function DashboardTabs({ tabs = renterTabs, className }: DashboardTabsProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        'flex items-center gap-1 overflow-x-auto scrollbar-hide border-b bg-background px-4 md:px-6',
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
              active
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export { renterTabs };
export type { TabItem };
