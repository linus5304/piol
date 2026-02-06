import { cn } from '@/lib/utils';
import { brand } from '@repo/ui/tokens';
import Link from 'next/link';

// =============================================================================
// LOGO COMPONENT — "piol." text mark with amber dot
// =============================================================================

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  asLink?: boolean;
}

const logoSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
} as const;

export function Logo({
  size = 'md',
  showText: _showText = true,
  className,
  asLink = true,
}: LogoProps) {
  const textSize = logoSizes[size];

  const content = (
    <div className={cn('flex items-center', className)}>
      <span className={cn('font-extrabold tracking-tighter', textSize)}>
        piol<span className="text-primary">.</span>
      </span>
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
// LOGO ICON ONLY — compact "p." mark
// =============================================================================

interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size: _size = 36, className }: LogoIconProps) {
  return (
    <span
      className={cn('inline-flex items-center font-extrabold tracking-tighter text-lg', className)}
    >
      p<span className="text-primary">.</span>
    </span>
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
            'text-sm mt-1 ml-0.5',
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
    tiktok: 'https://tiktok.com/@piolcm',
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
