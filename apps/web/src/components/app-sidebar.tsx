'use client';

import { useSafeUser } from '@/hooks/use-safe-auth';
import {
  Building2,
  CreditCard,
  Heart,
  HelpCircle,
  Home,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';

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

// Sample recent properties (like "Upcoming Events" in Catalyst)
const recentProperties = [
  { title: 'Appartement Bastos', url: '/dashboard/properties/1' },
  { title: 'Villa Bonanjo', url: '/dashboard/properties/2' },
  { title: 'Studio Akwa', url: '/dashboard/properties/3' },
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
                {recentProperties.map((property) => (
                  <SidebarMenuItem key={property.title}>
                    <SidebarMenuButton asChild>
                      <Link href={property.url}>
                        <span>{property.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
