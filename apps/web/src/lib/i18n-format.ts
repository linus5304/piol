import type { AppLocale } from '@/i18n/config';
import { parseAppLocale, toIntlLocale } from '@/i18n/config';

type DateInput = number | string | Date;

function resolveIntlLocale(locale: AppLocale | string): string {
  return toIntlLocale(parseAppLocale(locale));
}

export function formatNumber(value: number, locale: AppLocale | string): string {
  return new Intl.NumberFormat(resolveIntlLocale(locale)).format(value);
}

export function formatCurrencyFCFA(value: number, locale: AppLocale | string): string {
  return `${formatNumber(value, locale)} FCFA`;
}

export function formatDate(
  value: DateInput,
  locale: AppLocale | string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Date(value).toLocaleDateString(resolveIntlLocale(locale), options);
}

export function formatTime(
  value: DateInput,
  locale: AppLocale | string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Date(value).toLocaleTimeString(resolveIntlLocale(locale), options);
}
