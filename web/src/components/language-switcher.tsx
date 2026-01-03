'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('language');
  const [isPending, startTransition] = useTransition();

  const setLocale = (newLocale: string) => {
    startTransition(() => {
      // Set cookie and reload
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
      window.location.reload();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          {locale === 'fr' ? '🇫🇷' : '🇬🇧'} {locale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale('fr')} disabled={locale === 'fr'}>
          🇫🇷 {t('fr')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale('en')} disabled={locale === 'en'}>
          🇬🇧 {t('en')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

