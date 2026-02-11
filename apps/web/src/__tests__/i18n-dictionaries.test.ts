/// <reference types="jest" />

import { defaultLocale, parseAppLocale } from '@/i18n/config';
import en from '@/i18n/locales/en.json';
import fr from '@/i18n/locales/fr.json';
import { formatCurrencyFCFA, formatDate, formatTime } from '@/lib/i18n-format';

function flattenKeys(input: unknown, prefix = ''): string[] {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(input).flatMap(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return flattenKeys(value, next);
  });
}

describe('i18n locale config', () => {
  it('falls back to fr for unknown locale values', () => {
    expect(parseAppLocale(undefined)).toBe(defaultLocale);
    expect(parseAppLocale('')).toBe(defaultLocale);
    expect(parseAppLocale('es')).toBe(defaultLocale);
    expect(parseAppLocale('fr-CA')).toBe('fr');
    expect(parseAppLocale('en-GB')).toBe('en');
  });
});

describe('i18n formatting helpers', () => {
  it('formats FCFA amounts with locale-aware grouping', () => {
    const amount = 150000;
    expect(formatCurrencyFCFA(amount, 'fr')).toContain('150');
    expect(formatCurrencyFCFA(amount, 'fr')).toContain('FCFA');
    expect(formatCurrencyFCFA(amount, 'en')).toContain('150');
    expect(formatCurrencyFCFA(amount, 'en')).toContain('FCFA');
  });

  it('formats date/time with locale map', () => {
    const date = new Date('2026-01-02T15:45:00.000Z');
    expect(formatDate(date, 'fr')).toBeTruthy();
    expect(formatDate(date, 'en')).toBeTruthy();
    expect(formatTime(date, 'fr')).toBeTruthy();
    expect(formatTime(date, 'en')).toBeTruthy();
  });
});

describe('dictionary key parity', () => {
  it('keeps fr and en keys aligned', () => {
    const frKeys = flattenKeys(fr).sort();
    const enKeys = flattenKeys(en).sort();

    expect(frKeys).toEqual(enKeys);
  });
});
