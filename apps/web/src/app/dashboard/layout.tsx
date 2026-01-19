'use client';

import type React from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useEnsureUser } from '@/hooks/use-ensure-user';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Ensure user exists in Convex (fallback for webhook race condition)
  useEnsureUser();

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '240px',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="bg-background">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <main className="flex flex-1 flex-col gap-6 py-6 pb-20 md:pb-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
