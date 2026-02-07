'use client';

import { Logo, brandConstants } from '@/components/brand';
import { footerNav } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface FooterProps {
  variant?: 'default' | 'minimal' | 'dark';
  className?: string;
}

const FOOTER_CITIES = [
  'Douala',
  'Yaound\u00e9',
  'Buea',
  'Bamenda',
  'Kribi',
  'Limb\u00e9',
  'Bafoussam',
  'Garoua',
];

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: brandConstants.social.facebook,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146c-.427-.044-.72-.065-.82-.065-1.185 0-1.645.45-1.645 1.618v2.744h4.078l-.497 3.667h-3.581v8.127C19.395 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: brandConstants.social.instagram,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.874 5.874 0 0 0-2.124 1.388 5.878 5.878 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076.008 8.354-.005 8.764.001 12.023c.007 3.259.021 3.667.083 4.947.061 1.277.264 2.149.563 2.911.31.804.717 1.484 1.388 2.123a5.872 5.872 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063 3.257-.007 3.668-.021 4.947-.082 1.28-.06 2.147-.265 2.91-.563a5.881 5.881 0 0 0 2.123-1.388 5.881 5.881 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.892 5.892 0 0 0-1.387-2.123 5.857 5.857 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0 8.718.008 8.31.021 7.03.084Zm.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.736 3.736 0 0 1-1.382-.895 3.695 3.695 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-1.001.896-1.382a3.705 3.705 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.999.476 1.382.895.384.383.677.822.9 1.38.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.998-.896 1.38a3.705 3.705 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079-3.204.007-3.582-.006-4.848-.06Zm9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442ZM5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.161 6.161 0 0 0-12.323.024ZM8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008Z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: brandConstants.social.twitter,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: brandConstants.social.tiktok,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: brandConstants.social.linkedin,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export function Footer({ variant = 'default', className }: FooterProps) {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  if (variant === 'minimal') {
    return (
      <footer className={cn('border-t bg-background py-6', className)}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {brandConstants.legal.company}. {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                {t('footer.privacy')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const isDark = variant === 'dark';
  const textMuted = isDark ? 'text-background/70' : 'text-muted-foreground';
  const textDefault = isDark ? 'text-background' : '';
  const hoverText = isDark ? 'hover:text-background' : 'hover:text-foreground';
  const borderColor = isDark ? 'border-background/20' : 'border-border';

  return (
    <footer
      className={cn(
        'border-t',
        isDark ? 'bg-foreground text-background' : 'bg-background',
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8 sm:pt-20 sm:pb-10">
        {/* Main grid */}
        <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4">
            <Logo size="md" className={textDefault} />
            <p className={cn('mt-3 max-w-xs text-sm leading-relaxed', textMuted)}>
              {t('footer.description')}
            </p>

            {/* Payment badges */}
            <div className="mt-5 flex items-center gap-3">
              <div
                className={cn(
                  'font-mono rounded-md border px-2.5 py-1 text-[10px] font-semibold tracking-wide',
                  borderColor,
                  textMuted
                )}
              >
                MTN MoMo
              </div>
              <div
                className={cn(
                  'font-mono rounded-md border px-2.5 py-1 text-[10px] font-semibold tracking-wide',
                  borderColor,
                  textMuted
                )}
              >
                Orange Money
              </div>
            </div>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-1">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                    textMuted,
                    hoverText,
                    isDark ? 'hover:bg-background/10' : 'hover:bg-secondary'
                  )}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Product column */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest">
              {t('footer.product')}
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {footerNav.product.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn('text-sm transition-colors', textMuted, hoverText)}
                  >
                    {item.labelKey ? t(item.labelKey) : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest">
              {t('footer.company')}
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn('text-sm transition-colors', textMuted, hoverText)}
                  >
                    {item.labelKey ? t(item.labelKey) : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest">
              {t('footer.support')}
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {footerNav.support.map((item) => (
                <li key={item.labelKey}>
                  <Link
                    href={item.href}
                    className={cn('text-sm transition-colors', textMuted, hoverText)}
                  >
                    {item.labelKey ? t(item.labelKey) : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cities section */}
        <div className={cn('mt-10 border-t pt-6 sm:mt-14 sm:pt-8', borderColor)}>
          <h4
            className={cn(
              'font-mono text-[10px] font-bold uppercase tracking-widest sm:text-xs',
              textMuted
            )}
          >
            {t('footer.citiesWeServe')}
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {FOOTER_CITIES.map((city) => (
              <Link
                key={city}
                href={`/properties?city=${city}`}
                className={cn(
                  'font-mono rounded-full border px-3 py-1 text-xs transition-colors',
                  borderColor,
                  textMuted,
                  isDark
                    ? 'hover:border-background/50 hover:text-background'
                    : 'hover:border-primary hover:text-primary'
                )}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal bar */}
        <div
          className={cn(
            'mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:mt-10 sm:flex-row sm:pt-8',
            borderColor
          )}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/terms"
              className={cn(
                'font-mono text-[10px] uppercase tracking-wider transition-colors sm:text-xs',
                textMuted,
                hoverText
              )}
            >
              {t('footer.terms')}
            </Link>
            <Link
              href="/privacy"
              className={cn(
                'font-mono text-[10px] uppercase tracking-wider transition-colors sm:text-xs',
                textMuted,
                hoverText
              )}
            >
              {t('footer.privacy')}
            </Link>
          </div>
          <span
            className={cn(
              'font-mono text-[10px] tracking-wider sm:text-xs',
              isDark ? 'text-background/40' : 'text-muted-foreground/50'
            )}
          >
            &copy; {currentYear} {brandConstants.legal.company}. {t('footer.copyright')}
            <span className={cn('mx-2', isDark ? 'text-background/20' : 'text-border')}>|</span>
            {t('footer.madeInCameroon')}
          </span>
        </div>
      </div>
    </footer>
  );
}
