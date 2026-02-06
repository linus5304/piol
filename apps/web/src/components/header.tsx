'use client';

import { Logo } from '@/components/brand';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { type UserRole, getUserNav, mainNav, userNavSettings } from '@/config/navigation';
import { isClerkConfigured, useSafeClerk, useSafeUser } from '@/hooks/use-safe-auth';
import { cn } from '@/lib/utils';
import { ChevronDown, LogOut, Menu, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export function Header({ variant = 'default' }: HeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useSafeUser();
  const clerk = useSafeClerk();

  const isActive = (href: string) => pathname === href;

  const userRole = (user?.unsafeMetadata?.role as UserRole) || 'renter';
  const userInitial =
    user?.firstName?.charAt(0) ||
    user?.primaryEmailAddress?.emailAddress?.charAt(0)?.toUpperCase() ||
    'U';
  const userName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
    : user?.primaryEmailAddress?.emailAddress || 'User';

  const userNavItems = getUserNav(userRole);

  const handleSignOut = async () => {
    if (clerk?.signOut) {
      await clerk.signOut();
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-200',
        variant === 'transparent'
          ? 'bg-background/80 border-border/50'
          : 'bg-background/95 border-border'
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {item.labelKey ? t(item.labelKey.replace('nav.', '')) : item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />

            {/* Auth Section */}
            {!isLoaded ? (
              // Loading state
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isSignedIn && user ? (
              // Signed in - User Menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 gap-2 pl-2 pr-3 rounded-full hover:bg-muted"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.imageUrl} alt={userName} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block text-sm font-medium max-w-[100px] truncate">
                      {user.firstName || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {userNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link href={item.href} className="cursor-pointer">
                            {Icon && <Icon className="mr-2 h-4 w-4" />}
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {userNavSettings.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="cursor-pointer">
                          {Icon && <Icon className="mr-2 h-4 w-4" />}
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Not signed in - Auth buttons
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="font-medium">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    {t('signUp')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader className="text-left pb-6">
                  <SheetTitle>
                    <Logo size="sm" asLink={false} />
                  </SheetTitle>
                </SheetHeader>

                {/* User info in mobile menu */}
                {isSignedIn && user && (
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl mb-6">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.imageUrl} alt={userName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-1">
                  {mainNav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                          isActive(item.href)
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        )}
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                        {item.labelKey ? t(item.labelKey.replace('nav.', '')) : item.label}
                      </Link>
                    );
                  })}

                  {isSignedIn && (
                    <>
                      <div className="h-px bg-border my-4" />
                      {userNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          >
                            {Icon && <Icon className="h-5 w-5" />}
                            {item.label}
                          </Link>
                        );
                      })}
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      >
                        <Settings className="h-5 w-5" />
                        Paramètres
                      </Link>
                    </>
                  )}
                </nav>

                <div className="absolute bottom-8 left-6 right-6">
                  {isSignedIn ? (
                    <Button
                      variant="outline"
                      className="w-full justify-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link href="/sign-in" className="w-full">
                        <Button variant="outline" className="w-full">
                          {t('signIn')}
                        </Button>
                      </Link>
                      <Link href="/sign-up" className="w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                          {t('signUp')}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
