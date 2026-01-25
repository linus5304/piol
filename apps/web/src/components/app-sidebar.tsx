'use client';

import { useSafeUser } from '@/hooks/use-safe-auth';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import {
  Building2,
  Heart,
  HelpCircle,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
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
const renterNavigation = [
  {
    title: 'Accueil',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Propriétés',
    url: '/properties',
    icon: Building2,
  },
  {
    title: 'Favoris',
    url: '/dashboard/saved',
    icon: Heart,
  },
  {
    title: 'Paramètres',
    url: '/dashboard/settings',
    icon: Settings,
  },
];

const landlordNavigation = [
  {
    title: 'Accueil',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Propriétés',
    url: '/dashboard/properties',
    icon: Building2,
  },
  {
    title: 'Messages',
    url: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'Paramètres',
    url: '/dashboard/settings',
    icon: Settings,
  },
];

const secondaryNavigation = [
  {
    title: 'Support',
    url: '/help',
    icon: HelpCircle,
  },
  {
    title: 'Nouveautés',
    url: '/changelog',
    icon: Sparkles,
  },
];

export function AppSidebar({
  variant = 'sidebar',
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSafeUser();
  const pathname = usePathname();

  const role = (user?.unsafeMetadata?.role as 'renter' | 'landlord') || 'renter';
  const navItems = role === 'landlord' ? landlordNavigation : renterNavigation;

  // Fetch real properties for landlords
  const myProperties = useQuery(api.properties.getMyProperties, role === 'landlord' ? {} : 'skip');

  // Transform to recent properties list (show latest 3)
  const recentProperties = useMemo(() => {
    if (!myProperties) return null;
    return myProperties.slice(0, 3).map((p) => ({
      title: p.title,
      url: `/dashboard/properties/${p._id}`,
    }));
  }, [myProperties]);

  const userData = {
    name: user?.fullName || user?.firstName || 'Utilisateur',
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
        {role === 'landlord' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-muted text-xs font-medium uppercase tracking-wider">
              Propriétés récentes
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentProperties === null ? (
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
                      Aucune propriété
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
