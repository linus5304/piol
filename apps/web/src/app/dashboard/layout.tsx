'use client';

import type React from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { RenterDashboardLayout } from '@/components/layouts/renter-dashboard-layout';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useEnsureUser } from '@/hooks/use-ensure-user';
import { useSafeUser } from '@/hooks/use-safe-auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Ensure user exists in Convex (fallback for webhook race condition)
  useEnsureUser();

  const { user, isLoaded } = useSafeUser();
  const role = (user?.unsafeMetadata?.role as 'renter' | 'landlord') || 'renter';

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Renter: Tab-based navigation (no sidebar)
  if (role === 'renter') {
    return <RenterDashboardLayout>{children}</RenterDashboardLayout>;
  }

  // Landlord: Sidebar navigation
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
