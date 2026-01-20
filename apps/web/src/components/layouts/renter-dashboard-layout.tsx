'use client';

import { Logo } from '@/components/brand';
import { DashboardTabs } from '@/components/dashboard-tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSafeClerk, useSafeUser } from '@/hooks/use-safe-auth';
import { cn } from '@/lib/utils';
import { Bell, CreditCard, LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';

interface RenterDashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function RenterDashboardLayout({ children, className }: RenterDashboardLayoutProps) {
  const { user } = useSafeUser();
  const { signOut } = useSafeClerk();

  const userName = user?.fullName || user?.firstName || 'Utilisateur';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userAvatar = user?.imageUrl || '';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <Logo size="sm" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/payments" className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Paiements
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ redirectUrl: '/' })}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Tab Navigation */}
      <DashboardTabs />

      {/* Main Content */}
      <main className={cn('flex-1 px-4 md:px-6 lg:px-8 py-6', className)}>{children}</main>
    </div>
  );
}

export default RenterDashboardLayout;
