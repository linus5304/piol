'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type AppLocale, parseAppLocale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale, useSetLocale } from 'gt-next/client';
import { Check, Globe } from 'lucide-react';
import { useTransition } from 'react';

const languages = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
] as const;

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
}

export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const locale = parseAppLocale(useLocale());
  const setLocale = useSetLocale();
  const [isPending, startTransition] = useTransition();

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const handleSetLocale = (newLocale: AppLocale) => {
    if (newLocale === locale) return;

    startTransition(() => {
      // Keep compatibility with existing persisted locale preference.
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
      setLocale(newLocale);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          className={cn(
            'gap-1.5 font-medium transition-all',
            variant === 'minimal' ? 'h-8 px-2' : 'h-9 px-3',
            isPending && 'opacity-70'
          )}
        >
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{currentLang.flag}</span>
          <span
            className={cn(
              'uppercase text-xs font-semibold',
              variant === 'minimal' && 'hidden sm:inline'
            )}
          >
            {locale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSetLocale(lang.code)}
            className={cn(
              'flex items-center justify-between cursor-pointer',
              locale === lang.code && 'bg-muted'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </div>
            {locale === lang.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
