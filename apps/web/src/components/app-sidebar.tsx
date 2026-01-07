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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';

import { LogoIcon } from '@/components/brand';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { brand } from '@repo/ui/tokens';

const renterNavigation = [
  {
    title: 'Tableau de bord',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Rechercher',
    url: '/properties',
    icon: Search,
  },
  {
    title: 'Favoris',
    url: '/dashboard/saved',
    icon: Heart,
  },
  {
    title: 'Messages',
    url: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'Paiements',
    url: '/dashboard/payments',
    icon: CreditCard,
  },
];

const landlordNavigation = [
  {
    title: 'Tableau de bord',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Mes propriétés',
    url: '/dashboard/properties',
    icon: Building2,
  },
  {
    title: 'Ajouter',
    url: '/dashboard/properties/new',
    icon: Plus,
  },
  {
    title: 'Messages',
    url: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'Paiements',
    url: '/dashboard/payments',
    icon: CreditCard,
  },
];

const secondaryNavigation = [
  {
    title: 'Paramètres',
    url: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Aide',
    url: '/help',
    icon: HelpCircle,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/" className="flex items-center gap-2">
                <LogoIcon size={24} className="shrink-0" />
                <span className="text-base font-semibold tracking-tight">{brand.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={secondaryNavigation} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
