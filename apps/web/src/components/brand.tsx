import { cn } from '@/lib/utils';
import { brand } from '@repo/ui/tokens';
import { Home } from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// LOGO COMPONENT
// =============================================================================

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  asLink?: boolean;
}

const logoSizes = {
  sm: { icon: 28, text: 'text-lg', lucide: 14 },
  md: { icon: 36, text: 'text-xl', lucide: 18 },
  lg: { icon: 48, text: 'text-2xl', lucide: 24 },
} as const;

export function Logo({ size = 'md', showText = true, className, asLink = true }: LogoProps) {
  const { icon, text, lucide } = logoSizes[size];

  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className="bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center shadow-sm transition-shadow hover:shadow-md"
        style={{ width: icon, height: icon }}
      >
        <Home className="text-white dark:text-zinc-900" size={lucide} strokeWidth={2.5} />
      </div>
      {showText && <span className={cn('font-semibold tracking-tight', text)}>{brand.name}</span>}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="group">
        {content}
      </Link>
    );
  }

  return content;
}

// =============================================================================
// LOGO ICON ONLY
// =============================================================================

interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 36, className }: LogoIconProps) {
  const lucideSize = size * 0.5;
  return (
    <div
      className={cn(
        'bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center',
        className
      )}
      style={{ width: size, height: size }}
    >
      <Home className="text-white dark:text-zinc-900" size={lucideSize} strokeWidth={2.5} />
    </div>
  );
}

// =============================================================================
// BRAND INFO
// =============================================================================

interface BrandInfoProps {
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  className?: string;
}

export function BrandInfo({ variant = 'light', showTagline = false, className }: BrandInfoProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <Logo asLink={false} className={variant === 'dark' ? 'text-white' : ''} />
      {showTagline && (
        <p
          className={cn(
            'text-sm mt-1 ml-12',
            variant === 'dark' ? 'text-white/70' : 'text-muted-foreground'
          )}
        >
          {brand.tagline}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// BRAND CONSTANTS EXPORT
// =============================================================================

export const brandConstants = {
  name: brand.name,
  tagline: brand.tagline,
  taglineEn: brand.taglineEn,
  colors: brand.colors,

  // Social links (centralized)
  social: {
    twitter: 'https://twitter.com/piolcm',
    facebook: 'https://facebook.com/piolcm',
    instagram: 'https://instagram.com/piolcm',
    linkedin: 'https://linkedin.com/company/piol',
  },

  // Contact info
  contact: {
    email: 'support@piol.cm',
    phone: '+237 6XX XXX XXX',
    address: 'Douala, Cameroun',
  },

  // Legal
  legal: {
    company: 'Piol SAS',
    foundedYear: 2024,
  },
};
