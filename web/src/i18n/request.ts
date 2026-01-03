import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export default getRequestConfig(async () => {
  // Get locale from cookie or default to 'fr'
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const locale = (localeCookie?.value as Locale) || defaultLocale;

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});

