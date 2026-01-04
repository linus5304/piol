'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSafeUser } from '@/hooks/use-safe-auth';
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  CreditCard,
  Settings,
  Building2,
  Plus,
  Search,
  HelpCircle,
  Home,
} from 'lucide-react';

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
              <Link href="/">
                <div className="w-6 h-6 bg-foreground flex items-center justify-center">
                  <span className="text-background text-xs font-bold">P</span>
                </div>
                <span className="text-base font-semibold">Piol</span>
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
