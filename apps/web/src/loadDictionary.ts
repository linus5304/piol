type Dictionary = Record<string, unknown>;

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  fr: () => import('./i18n/locales/fr.json').then((module) => module.default),
  en: () => import('./i18n/locales/en.json').then((module) => module.default),
};

function normalizeLocale(input: string): 'fr' | 'en' {
  const locale = input.toLowerCase();
  if (locale.startsWith('en')) return 'en';
  return 'fr';
}

export default async function loadDictionary(locale: string): Promise<Dictionary> {
  const normalizedLocale = normalizeLocale(locale);
  return dictionaries[normalizedLocale]();
}
