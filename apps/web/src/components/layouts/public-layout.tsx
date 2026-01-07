'use client';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
  children: React.ReactNode;
  /** Header variant */
  headerVariant?: 'default' | 'transparent';
  /** Footer variant */
  footerVariant?: 'default' | 'minimal' | 'dark';
  /** Additional class names for main content */
  className?: string;
  /** Whether to include the footer */
  showFooter?: boolean;
  /** Whether the main content should have container padding */
  containerized?: boolean;
}

/**
 * PublicLayout - Consistent layout wrapper for public pages
 *
 * Provides:
 * - Consistent Header with auth state
 * - Consistent Footer
 * - Standard page structure
 *
 * Usage:
 * ```tsx
 * <PublicLayout>
 *   <YourPageContent />
 * </PublicLayout>
 * ```
 */
export function PublicLayout({
  children,
  headerVariant = 'default',
  footerVariant = 'default',
  className,
  showFooter = true,
  containerized = false,
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant={headerVariant} />

      <main className={cn('flex-1', containerized && 'container mx-auto px-4 py-8', className)}>
        {children}
      </main>

      {showFooter && <Footer variant={footerVariant} />}
    </div>
  );
}

/**
 * PageSection - Reusable section wrapper for consistent spacing
 */
interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Background variant */
  bg?: 'default' | 'muted' | 'brand';
  /** Whether to add border bottom */
  bordered?: boolean;
}

export function PageSection({
  children,
  className,
  bg = 'default',
  bordered = false,
}: PageSectionProps) {
  return (
    <section
      className={cn(
        'py-12 md:py-16',
        bg === 'muted' && 'bg-muted/30',
        bg === 'brand' && 'bg-gradient-to-br from-[#FF385C] to-[#E31C5F] text-white',
        bordered && 'border-b',
        className
      )}
    >
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}

/**
 * PageHeader - Consistent page header/hero section
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function PageHeader({
  title,
  description,
  children,
  className,
  centered = false,
}: PageHeaderProps) {
  return (
    <div className={cn('py-8 md:py-12', centered && 'text-center', className)}>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className={cn('mt-4 text-lg text-muted-foreground', centered && 'max-w-2xl mx-auto')}>
          {description}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

// Export all layout components
export default PublicLayout;
