export const appLocales = ['fr', 'en'] as const;
export type AppLocale = (typeof appLocales)[number];

export const defaultLocale: AppLocale = 'fr';

const localeMap: Record<AppLocale, string> = {
  fr: 'fr-FR',
  en: 'en-US',
};

export function isAppLocale(value: string): value is AppLocale {
  return appLocales.includes(value as AppLocale);
}

export function parseAppLocale(value?: string | null): AppLocale {
  if (!value) return defaultLocale;

  const normalized = value.toLowerCase();
  if (normalized.startsWith('fr')) return 'fr';
  if (normalized.startsWith('en')) return 'en';

  return defaultLocale;
}

export function toIntlLocale(value: AppLocale | string): string {
  const locale = parseAppLocale(value);
  return localeMap[locale];
}
