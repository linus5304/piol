'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// Map routes to titles (centralized configuration)
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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-sm font-medium text-sidebar-foreground">{getTitle()}</h1>
        
        {/* Search - hidden on mobile */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-9 h-9 bg-background border-border rounded-lg focus-visible:ring-primary"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 relative text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <Link href="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent"
            >
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/properties">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex h-8 rounded-lg border-border hover:border-primary hover:text-primary"
            >
              Parcourir
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
