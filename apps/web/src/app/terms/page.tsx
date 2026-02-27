'use client';

import { Logo } from '@/components/brand';
import { parseAppLocale } from '@/i18n/config';
import { formatDate } from '@/lib/i18n-format';
import { useLocale, useTranslations } from 'gt-next/client';

export default function TermsPage() {
  const locale = parseAppLocale(useLocale());
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t('terms.title')}</h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            {t('terms.lastUpdated')}{' '}
            {formatDate(new Date(), locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('terms.section1Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('terms.section1Text')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('terms.section2Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('terms.section2Text')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('terms.section3Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('terms.section3Text')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('terms.section4Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('terms.section4Text')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('terms.section5Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('terms.section5Text')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('terms.section6Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('terms.section6Text')}</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>{t('terms.section6Item1')}</li>
            <li>{t('terms.section6Item2')}</li>
            <li>{t('terms.section6Item3')}</li>
            <li>{t('terms.section6Item4')}</li>
            <li>{t('terms.section6Item5')}</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('terms.section7Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('terms.section7Text')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('terms.section8Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('terms.section8Text')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('terms.section9Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('terms.section9Text')}</p>
          <p className="text-muted-foreground">
            <strong>{t('terms.contactEmail')}</strong> legal@piol.cm
            <br />
            <strong>{t('terms.contactAddress')}</strong> Douala, Cameroun
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-muted-foreground py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>{t('terms.footerRights', { year: new Date().getFullYear() })}</p>
        </div>
      </footer>
    </div>
  );
}
