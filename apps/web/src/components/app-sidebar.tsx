'use client';

import { useCurrentUserRole } from '@/hooks/use-current-user-role';
import { useSafeUser } from '@/hooks/use-safe-auth';
import { api } from '@repo/convex/_generated/api';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { useTranslations } from 'gt-next';
import {
  Building2,
  ClipboardCheck,
  CreditCard,
  FileCheck,
  Heart,
  HelpCircle,
  Home,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';
import { useMemo } from 'react';

import { Logo } from '@/components/brand';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function AppSidebar({
  variant = 'sidebar',
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSafeUser();
  const { role } = useCurrentUserRole();
  const pathname = usePathname();
  const t = useTranslations();

  const effectiveRole = role || 'renter';

  // Fetch pending applications count for admin badge
  const pendingApplicationsCount = useQuery(
    api.landlordApplications.getPendingApplicationsCount,
    effectiveRole === 'admin' ? {} : 'skip'
  );

  const renterNavigation = useMemo(
    () => [
      { title: t('sidebar.home'), url: '/dashboard', icon: Home },
      { title: t('sidebar.properties'), url: '/properties', icon: Building2 },
      { title: t('sidebar.favorites'), url: '/dashboard/saved', icon: Heart },
      { title: t('sidebar.settings'), url: '/dashboard/settings', icon: Settings },
    ],
    [t]
  );

  const landlordNavigation = useMemo(
    () => [
      { title: t('sidebar.home'), url: '/dashboard', icon: Home },
      { title: t('sidebar.properties'), url: '/dashboard/properties', icon: Building2 },
      { title: t('sidebar.payments'), url: '/dashboard/payments', icon: CreditCard },
      { title: t('sidebar.messages'), url: '/dashboard/messages', icon: MessageSquare },
      { title: t('sidebar.settings'), url: '/dashboard/settings', icon: Settings },
    ],
    [t]
  );

  const adminNavigation = useMemo(
    () => [
      { title: t('sidebar.adminDashboard'), url: '/dashboard/admin', icon: ShieldCheck },
      { title: t('sidebar.users'), url: '/dashboard/admin/users', icon: Users },
      {
        title: t('sidebar.applications'),
        url: '/dashboard/admin/applications',
        icon: FileCheck,
        badge: pendingApplicationsCount ?? 0,
      },
      { title: t('sidebar.verifications'), url: '/dashboard/verify', icon: ClipboardCheck },
      { title: t('sidebar.properties'), url: '/dashboard/properties', icon: Building2 },
      { title: t('sidebar.payments'), url: '/dashboard/payments', icon: CreditCard },
      { title: t('sidebar.messages'), url: '/dashboard/messages', icon: MessageSquare },
      { title: t('sidebar.settings'), url: '/dashboard/settings', icon: Settings },
    ],
    [t, pendingApplicationsCount]
  );

  const verifierNavigation = useMemo(
    () => [
      { title: t('sidebar.verifications'), url: '/dashboard/verify', icon: ClipboardCheck },
      { title: t('sidebar.settings'), url: '/dashboard/settings', icon: Settings },
    ],
    [t]
  );

  const secondaryNavigation = useMemo(
    () => [
      { title: t('sidebar.support'), url: '/help', icon: HelpCircle },
      { title: t('sidebar.whatsNew'), url: '/changelog', icon: Sparkles },
    ],
    [t]
  );

  const navItems = (() => {
    switch (effectiveRole) {
      case 'admin':
        return adminNavigation;
      case 'verifier':
        return verifierNavigation;
      case 'landlord':
        return landlordNavigation;
      default:
        return renterNavigation;
    }
  })();

  // Fetch real properties for landlords and admins
  const showProperties = effectiveRole === 'landlord' || effectiveRole === 'admin';
  const { results: myProperties, status: propertiesStatus } = usePaginatedQuery(
    api.properties.getMyProperties,
    showProperties ? {} : 'skip',
    { initialNumItems: 3 }
  );

  const isLoadingProperties = propertiesStatus === 'LoadingFirstPage';

  // Transform to recent properties list (show latest 3)
  const recentProperties = useMemo(() => {
    return myProperties.slice(0, 3).map((p) => ({
      title: p.title,
      url: `/dashboard/properties/${p._id}`,
    }));
  }, [myProperties]);

  const userData = {
    name: user?.fullName || user?.firstName || t('sidebar.user'),
    email: user?.primaryEmailAddress?.emailAddress || '',
    avatar: user?.imageUrl || '',
  };

  return (
    <Sidebar collapsible="offcanvas" variant={variant} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Logo size="sm" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />

        {/* Recent Properties Section (like Upcoming Events) */}
        {showProperties && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-muted text-xs font-medium uppercase tracking-wider">
              {t('sidebar.recentProperties')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoadingProperties ? (
                  // Loading state
                  <>
                    <SidebarMenuItem>
                      <Skeleton className="h-8 w-full rounded-md" />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Skeleton className="h-8 w-full rounded-md" />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Skeleton className="h-8 w-full rounded-md" />
                    </SidebarMenuItem>
                  </>
                ) : recentProperties.length === 0 ? (
                  // Empty state
                  <SidebarMenuItem>
                    <span className="text-sm text-muted-foreground px-2 py-1">
                      {t('sidebar.noProperties')}
                    </span>
                  </SidebarMenuItem>
                ) : (
                  // Property list
                  recentProperties.map((property) => (
                    <SidebarMenuItem key={property.url}>
                      <SidebarMenuButton asChild>
                        <Link href={property.url}>
                          <span className="truncate">{property.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <NavSecondary items={secondaryNavigation} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
