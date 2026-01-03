'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  CreditCard,
  Settings,
  Building2,
  Plus,
  Search,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navigation = {
  renter: [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Favoris', href: '/dashboard/saved', icon: Heart },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Paiements', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ],
  landlord: [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mes propriétés', href: '/dashboard/properties', icon: Building2 },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Paiements', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user role from metadata or default to renter
  const role = (user?.unsafeMetadata?.role as 'renter' | 'landlord') || 'renter';
  const navItems = navigation[role] || navigation.renter;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <span className="text-xl font-bold text-primary">Piol</span>
              </Link>

              {/* Desktop Search */}
              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-64 pl-10 pr-4 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {role === 'landlord' && (
                <Link href="/dashboard/properties/new" className="hidden sm:block">
                  <Button size="sm" className="bg-primary hover:bg-primary-hover gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </Button>
                </Link>
              )}

              <Link
                href="/properties"
                className="hidden sm:block text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
              >
                Parcourir
              </Link>

              <button className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-neutral-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>

              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9 ring-2 ring-neutral-100',
                  },
                }}
              />

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-neutral-600" />
                ) : (
                  <Menu className="w-5 h-5 text-neutral-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white">
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    )}
                  >
                    <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-6 overflow-y-auto bg-white border-r border-neutral-200 min-h-[calc(100vh-64px)]">
            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isActive ? 'text-primary' : 'text-neutral-400 group-hover:text-neutral-600'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Role indicator and quick action */}
            <div className="p-4 border-t border-neutral-200 space-y-4">
              {role === 'landlord' && (
                <Link href="/dashboard/properties/new" className="block">
                  <Button variant="outline" className="w-full gap-2 border-neutral-200">
                    <Plus className="w-4 h-4" />
                    Nouvelle propriété
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    role === 'landlord' ? 'bg-verified' : 'bg-primary'
                  )}
                />
                {role === 'landlord' ? 'Compte Propriétaire' : 'Compte Locataire'}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile bottom navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
          <div className="flex justify-around py-2">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center px-3 py-1.5 rounded-lg transition-colors',
                    isActive ? 'text-primary' : 'text-neutral-400'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                  <span className="text-[10px] mt-1 font-medium">{item.name.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
