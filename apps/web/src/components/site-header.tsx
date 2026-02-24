'use client';

import { DashboardBreadcrumbs } from '@/components/dashboard-breadcrumbs';
import { LanguageSwitcher } from '@/components/language-switcher';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function SiteHeader() {
  return (
    <header
      className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50"
      data-testid="dashboard-header"
    >
      <div className="flex w-full items-center justify-between gap-2 px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 h-4" />
          <DashboardBreadcrumbs />
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageSwitcher variant="minimal" />
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
