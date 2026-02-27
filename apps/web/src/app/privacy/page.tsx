'use client';

import { Logo } from '@/components/brand';
import { parseAppLocale } from '@/i18n/config';
import { formatDate } from '@/lib/i18n-format';
import { useLocale, useTranslations } from 'gt-next/client';

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-foreground mb-8">{t('privacy.title')}</h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            {t('privacy.lastUpdated')}{' '}
            {formatDate(new Date(), locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('privacy.section1Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('privacy.section1Text')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('privacy.section2Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('privacy.section2Text')}</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>
              <strong>{t('privacy.section2Item1')}</strong> {t('privacy.section2Item1Desc')}
            </li>
            <li>
              <strong>{t('privacy.section2Item2')}</strong> {t('privacy.section2Item2Desc')}
            </li>
            <li>
              <strong>{t('privacy.section2Item3')}</strong> {t('privacy.section2Item3Desc')}
            </li>
            <li>
              <strong>{t('privacy.section2Item4')}</strong> {t('privacy.section2Item4Desc')}
            </li>
            <li>
              <strong>{t('privacy.section2Item5')}</strong> {t('privacy.section2Item5Desc')}
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('privacy.section3Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('privacy.section3Text')}</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>{t('privacy.section3Item1')}</li>
            <li>{t('privacy.section3Item2')}</li>
            <li>{t('privacy.section3Item3')}</li>
            <li>{t('privacy.section3Item4')}</li>
            <li>{t('privacy.section3Item5')}</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('privacy.section4Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('privacy.section4Text')}</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>{t('privacy.section4Item1')}</li>
            <li>{t('privacy.section4Item2')}</li>
            <li>{t('privacy.section4Item3')}</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('privacy.section5Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('privacy.section5Text')}</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>{t('privacy.section5Item1')}</li>
            <li>{t('privacy.section5Item2')}</li>
            <li>{t('privacy.section5Item3')}</li>
            <li>{t('privacy.section5Item4')}</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('privacy.section6Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('privacy.section6Text')}</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>{t('privacy.section6Item1')}</li>
            <li>{t('privacy.section6Item2')}</li>
            <li>{t('privacy.section6Item3')}</li>
            <li>{t('privacy.section6Item4')}</li>
            <li>{t('privacy.section6Item5')}</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('privacy.section7Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('privacy.section7Text')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('privacy.section8Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('privacy.section8Text')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            {t('privacy.section9Title')}
          </h2>
          <p className="text-muted-foreground mb-4">{t('privacy.section9Text')}</p>
          <p className="text-muted-foreground">
            <strong>{t('privacy.contactEmail')}</strong> privacy@piol.cm
            <br />
            <strong>{t('privacy.contactAddress')}</strong> Douala, Cameroun
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-muted-foreground py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>{t('privacy.footerRights', { year: new Date().getFullYear() })}</p>
        </div>
      </footer>
    </div>
  );
}
