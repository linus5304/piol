'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = {
  renter: [
    { name: 'Tableau de bord', href: '/dashboard', icon: '🏠' },
    { name: 'Propriétés sauvegardées', href: '/dashboard/saved', icon: '❤️' },
    { name: 'Messages', href: '/dashboard/messages', icon: '💬' },
    { name: 'Paiements', href: '/dashboard/payments', icon: '💳' },
    { name: 'Paramètres', href: '/dashboard/settings', icon: '⚙️' },
  ],
  landlord: [
    { name: 'Tableau de bord', href: '/dashboard', icon: '🏠' },
    { name: 'Mes propriétés', href: '/dashboard/properties', icon: '🏘️' },
    { name: 'Messages', href: '/dashboard/messages', icon: '💬' },
    { name: 'Paiements', href: '/dashboard/payments', icon: '💳' },
    { name: 'Paramètres', href: '/dashboard/settings', icon: '⚙️' },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  // Get user role from metadata or default to renter
  const role = (user?.unsafeMetadata?.role as 'renter' | 'landlord') || 'renter';
  const navItems = navigation[role] || navigation.renter;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <span className="text-xl font-bold text-gray-900">Piol</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/properties"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Parcourir les propriétés
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
            <div className="flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Role indicator */}
            <div className="p-4 border-t">
              <div className="text-xs text-gray-500">
                {role === 'landlord' ? 'Compte Propriétaire' : 'Compte Locataire'}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile bottom navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
          <div className="flex justify-around py-2">
            {navItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center px-3 py-1',
                    isActive ? 'text-[#FF385C]' : 'text-gray-500'
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs mt-1">{item.name.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

