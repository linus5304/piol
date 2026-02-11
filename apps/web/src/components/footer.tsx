import { Logo, brandConstants } from '@/components/brand';
import { LanguageSwitcher } from '@/components/language-switcher';
import { footerNav } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'gt-next';
import Link from 'next/link';

interface FooterProps {
  variant?: 'default' | 'minimal' | 'dark';
  className?: string;
}

export function Footer({ variant = 'default', className }: FooterProps) {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const productLinks = footerNav.product ?? [];
  const companyLinks = footerNav.company ?? [];

  if (variant === 'minimal') {
    return (
      <footer className={cn('border-t bg-background py-6', className)}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {brandConstants.name}. {t('footer.copyright')}
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

  return (
    <footer
      className={cn(
        'border-t',
        variant === 'dark' ? 'bg-foreground text-background' : 'bg-muted/30',
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="md" className={variant === 'dark' ? 'text-background' : ''} />
            <p
              className={cn(
                'mt-4 text-sm',
                variant === 'dark' ? 'text-background/70' : 'text-muted-foreground'
              )}
            >
              {t('footer.description')}
            </p>
            <div className="mt-4">
              <LanguageSwitcher variant="minimal" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={cn('font-semibold mb-4', variant === 'dark' ? 'text-background' : '')}>
              {t('footer.product')}
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm transition-colors',
                      variant === 'dark'
                        ? 'text-background/70 hover:text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.labelKey ? t(link.labelKey) : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={cn('font-semibold mb-4', variant === 'dark' ? 'text-background' : '')}>
              {t('footer.company')}
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm transition-colors',
                      variant === 'dark'
                        ? 'text-background/70 hover:text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.labelKey ? t(link.labelKey) : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={cn('font-semibold mb-4', variant === 'dark' ? 'text-background' : '')}>
              {t('nav.contact')}
            </h4>
            <ul
              className={cn(
                'space-y-2 text-sm',
                variant === 'dark' ? 'text-background/70' : 'text-muted-foreground'
              )}
            >
              <li>{brandConstants.contact.email}</li>
              <li>{brandConstants.contact.phone}</li>
              <li>{brandConstants.contact.address}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={cn(
            'border-t mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4',
            variant === 'dark' ? 'border-background/20' : 'border-border'
          )}
        >
          <p
            className={cn(
              'text-sm',
              variant === 'dark' ? 'text-background/60' : 'text-muted-foreground'
            )}
          >
            © {currentYear} {brandConstants.name}. {t('footer.copyright')}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {Object.entries(brandConstants.social).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'text-sm transition-colors capitalize',
                  variant === 'dark'
                    ? 'text-background/60 hover:text-background'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Server component version for non-interactive footer
export function FooterStatic({ variant = 'default', className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'border-t py-8',
        variant === 'dark' ? 'bg-foreground text-background' : 'bg-muted/30',
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p
          className={cn(
            'text-sm',
            variant === 'dark' ? 'text-background/60' : 'text-muted-foreground'
          )}
        >
          © {currentYear} {brandConstants.name}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
