'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

// Map routes to titles
const routeTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/properties': 'Mes propriétés',
  '/dashboard/properties/new': 'Nouvelle annonce',
  '/dashboard/saved': 'Favoris',
  '/dashboard/messages': 'Messages',
  '/dashboard/payments': 'Paiements',
  '/dashboard/settings': 'Paramètres',
};

export function SiteHeader() {
  const pathname = usePathname();
  
  // Get the title based on current path
  const getTitle = () => {
    // Check for exact match first
    if (routeTitles[pathname]) {
      return routeTitles[pathname];
    }
    // Check for partial match (for nested routes)
    for (const [route, title] of Object.entries(routeTitles)) {
      if (pathname.startsWith(route) && route !== '/dashboard') {
        return title;
      }
    }
    return 'Tableau de bord';
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-sm font-medium">{getTitle()}</h1>
        
        {/* Search - hidden on mobile */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 h-8"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-foreground rounded-full" />
          </Button>
          <Link href="/properties">
            <Button variant="ghost" size="sm" className="hidden sm:flex h-8">
              Parcourir
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
