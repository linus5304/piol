/**
 * Shared validation primitives — phone helpers, constants, and reusable regex.
 */

/** 9-digit Cameroon local number: starts with 6 (mobile) or 2 (landline). */
export const CM_PHONE_RE = /^[62]\d{8}$/;

/** Storage format: +237 prefix + 9 local digits. */
export const CM_PHONE_STORAGE_RE = /^\+237[62]\d{8}$/;

/** Full pattern accepting optional +237 prefix, spaces, dashes. */
const CM_PHONE_FULL_RE = /^(?:\+?237\s*)?([62]\d{8})$/;

/** Strip non-digit chars except leading +. */
export function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, '');
}

/** Format digits into +237 6XX XXX XXX display format. */
export function formatPhoneDisplay(raw: string): string {
  const normalized = normalizePhone(raw);
  const match = normalized.match(CM_PHONE_FULL_RE);
  if (match) {
    const digits = match[1];
    return `+237 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`.trim();
  }
  return raw;
}

/** Extract the 9-digit local number and prepend +237 for storage. */
export function toStoragePhone(raw: string): string | undefined {
  if (!raw.trim()) return undefined;
  const normalized = normalizePhone(raw);
  const match = normalized.match(CM_PHONE_FULL_RE);
  if (match) return `+237${match[1]}`;
  return undefined;
}

// ── Constants mirroring Convex schema ──────────────────────────────────

export const PROPERTY_TYPES = [
  'studio',
  '1br',
  '2br',
  '3br',
  '4br',
  'house',
  'apartment',
  'villa',
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const CITIES = [
  'Douala',
  'Yaoundé',
  'Bafoussam',
  'Buea',
  'Kribi',
  'Limbe',
  'Bamenda',
] as const;
export type City = (typeof CITIES)[number];

export const AMENITY_IDS = [
  'wifi',
  'parking',
  'ac',
  'security',
  'water247',
  'electricity247',
  'furnished',
  'balcony',
  'garden',
] as const;
export type AmenityId = (typeof AMENITY_IDS)[number];

export const USER_ROLES = ['renter', 'landlord'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const LANGUAGES = ['fr', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
