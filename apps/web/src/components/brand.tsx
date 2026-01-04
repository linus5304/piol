import Link from 'next/link';
import { brand, colors } from '@repo/ui/tokens';
import { cn } from '@/lib/utils';

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
  sm: { icon: 28, text: 'text-lg' },
  md: { icon: 36, text: 'text-xl' },
  lg: { icon: 48, text: 'text-2xl' },
} as const;

export function Logo({ 
  size = 'md', 
  showText = true, 
  className,
  asLink = true,
}: LogoProps) {
  const { icon, text } = logoSizes[size];
  
  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div 
        className="bg-gradient-to-br from-[#FF385C] to-[#E31C5F] rounded-xl flex items-center justify-center shadow-sm transition-shadow hover:shadow-md"
        style={{ width: icon, height: icon }}
      >
        <span 
          className="text-white font-bold"
          style={{ fontSize: icon * 0.4 }}
        >
          P
        </span>
      </div>
      {showText && (
        <span className={cn('font-semibold tracking-tight', text)}>
          {brand.name}
        </span>
      )}
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
  return (
    <div 
      className={cn(
        'bg-gradient-to-br from-[#FF385C] to-[#E31C5F] rounded-xl flex items-center justify-center',
        className
      )}
      style={{ width: size, height: size }}
    >
      <span 
        className="text-white font-bold"
        style={{ fontSize: size * 0.4 }}
      >
        P
      </span>
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

export function BrandInfo({ 
  variant = 'light', 
  showTagline = false,
  className,
}: BrandInfoProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <Logo 
        asLink={false} 
        className={variant === 'dark' ? 'text-white' : ''}
      />
      {showTagline && (
        <p className={cn(
          'text-sm mt-1 ml-12',
          variant === 'dark' ? 'text-white/70' : 'text-muted-foreground'
        )}>
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

