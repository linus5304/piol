/// <reference types="jest" />

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

function getLeafEntries(
  obj: Record<string, unknown>,
  prefix = ''
): Array<{ key: string; value: string }> {
  const entries: Array<{ key: string; value: string }> = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      entries.push(...getLeafEntries(v as Record<string, unknown>, path));
    } else if (typeof v === 'string') {
      entries.push({ key: path, value: v });
    }
  }
  return entries;
}

function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((cur, seg) => {
    if (cur && typeof cur === 'object' && !Array.isArray(cur)) {
      return (cur as Record<string, unknown>)[seg];
    }
    return undefined;
  }, obj);
}

function extractInterpolationVars(value: string): Set<string> {
  const matches = value.matchAll(/\{(\w+)\}/g);
  return new Set([...matches].map((m) => m[1]));
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

describe('no empty translation values', () => {
  it('has no empty strings in fr.json', () => {
    const empty = getLeafEntries(fr as Record<string, unknown>).filter((e) => e.value === '');
    expect(empty).toEqual([]);
  });

  it('has no empty strings in en.json', () => {
    const empty = getLeafEntries(en as Record<string, unknown>).filter((e) => e.value === '');
    expect(empty).toEqual([]);
  });
});

describe('interpolation variable parity', () => {
  it('has matching {variable} sets in fr and en for every key', () => {
    const frEntries = getLeafEntries(fr as Record<string, unknown>);
    const mismatches: Array<{
      key: string;
      frVars: string[];
      enVars: string[];
    }> = [];

    for (const { key, value: frValue } of frEntries) {
      const enValue = getValueByPath(en as Record<string, unknown>, key);
      if (typeof enValue !== 'string') continue;

      const frVars = [...extractInterpolationVars(frValue)].sort();
      const enVars = [...extractInterpolationVars(enValue)].sort();

      if (JSON.stringify(frVars) !== JSON.stringify(enVars)) {
        mismatches.push({ key, frVars, enVars });
      }
    }

    if (mismatches.length > 0) {
      const details = mismatches
        .map((m) => `  ${m.key}: fr={${m.frVars.join(', ')}} en={${m.enVars.join(', ')}}`)
        .join('\n');
      throw new Error(
        `Interpolation variable mismatch in ${mismatches.length} key(s):\n${details}`
      );
    }
  });
});

describe('propriété regression guard', () => {
  it('does not use "propriété" (should be "bien") in fr.json values', () => {
    const frEntries = getLeafEntries(fr as Record<string, unknown>);
    // Match "propriété" but not "propriétaire" — use non-global regex to avoid lastIndex issues
    const offending = frEntries.filter((e) => /propriété(?![\wéèêë]*aire)/i.test(e.value));

    if (offending.length > 0) {
      const details = offending.map((e) => `  ${e.key}: "${e.value}"`).join('\n');
      throw new Error(
        `Found ${offending.length} fr.json value(s) using "propriété" instead of "bien":\n${details}`
      );
    }
  });
});

describe('hardcoded string detection', () => {
  const srcRoot = resolve(__dirname, '..');

  const pagesToCheck = [
    'app/help/page.tsx',
    'app/changelog/page.tsx',
    'app/terms/page.tsx',
    'app/privacy/page.tsx',
    'app/dashboard/admin/users/page.tsx',
    'app/dashboard/verify/page.tsx',
    'app/(auth)/sign-in/[[...sign-in]]/page.tsx',
    'app/(auth)/sign-up/[[...sign-up]]/page.tsx',
  ];

  for (const pagePath of pagesToCheck) {
    it(`${pagePath} imports useTranslations`, () => {
      const fullPath = resolve(srcRoot, pagePath);
      const content = readFileSync(fullPath, 'utf-8');
      expect(content).toContain('useTranslations');
    });
  }
});

describe('untranslated copy-paste detection', () => {
  // Allowlist patterns for values that are intentionally identical in both locales
  const isAllowlisted = (value: string): boolean => {
    // Very short values (1-3 chars)
    if (value.length <= 3) return true;
    // Pure numbers
    if (/^\d+$/.test(value.trim())) return true;
    // Known brand names and multi-word proper nouns that are the same in both languages
    const brandTerms = [
      'FCFA',
      'Piol',
      'Clerk',
      'Convex',
      'WhatsApp',
      'Google',
      'Facebook',
      'WiFi',
      'GPS',
      'PDF',
      'MTN',
      'MoMo',
      'Orange',
      'Email',
      'Studio',
      'Villa',
      'Parking',
      'Waze',
      'Google Maps',
      'Apple Maps',
    ];
    if (brandTerms.some((b) => value.trim() === b)) return true;
    // Value is just a brand term (possibly with punctuation/spaces)
    const stripped = value.replace(/[^a-zA-Z0-9]/g, '');
    if (brandTerms.some((b) => stripped.toLowerCase() === b.replace(/\s/g, '').toLowerCase()))
      return true;
    // Value is a URL or email
    if (/^https?:\/\//.test(value.trim()) || /^[^\s@]+@[^\s@]+$/.test(value.trim())) return true;
    // Single-word values (possibly with trailing punctuation) are often shared between fr/en
    // e.g. "Contact", "Description", "Messages", "Photos", "Date", "Type", "Total"
    if (/^[\w\u00C0-\u024F]+[.!?]?$/.test(value.trim())) return true;
    // Values that are just a placeholder pattern like "6XX XXX XXX"
    if (/^[\dX\s.+()-]+$/.test(value.trim())) return true;
    // Values containing only interpolation variables and shared syntax like "{count} photo(s)"
    if (/^\{\w+\}\s*\w*\(\w*\)$/.test(value.trim())) return true;
    // Proper names with initials like "Amina K."
    if (/^[A-Z][\w\u00C0-\u024F]+ [A-Z]\.$/.test(value.trim())) return true;
    // Numbered section titles like "8. Modifications" — shared between fr/en
    if (/^\d+\.\s+\w+$/.test(value.trim())) return true;
    // Short phrases (2 words or fewer) that are identical cognates in fr/en
    // e.g. "Communications:", "1. Introduction"
    if (value.trim().split(/\s+/).length <= 2) return true;
    return false;
  };

  it('flags fr values that are identical to en (potential untranslated keys)', () => {
    const frEntries = getLeafEntries(fr as Record<string, unknown>);
    const duplicates: Array<{ key: string; value: string }> = [];

    for (const { key, value: frValue } of frEntries) {
      const enValue = getValueByPath(en as Record<string, unknown>, key);
      if (typeof enValue !== 'string') continue;
      if (frValue !== enValue) continue;
      if (isAllowlisted(frValue)) continue;
      duplicates.push({ key, value: frValue });
    }

    if (duplicates.length > 0) {
      const details = duplicates.map((d) => `  ${d.key}: "${d.value}"`).join('\n');
      throw new Error(
        `Found ${duplicates.length} key(s) where fr === en (possible untranslated copy-paste):\n${details}`
      );
    }
  });
});
