import { z } from 'zod';
import { AMENITY_IDS, CITIES, PROPERTY_TYPES } from './common';

// ── Coordinate pair superRefine ──────────────────────────────────────

function coordinatePairValidation(
  data: { latitude?: string; longitude?: string },
  ctx: z.RefinementCtx,
  t: (key: string) => string
) {
  const hasLat = (data.latitude ?? '').trim().length > 0;
  const hasLng = (data.longitude ?? '').trim().length > 0;

  if (hasLat !== hasLng) {
    const field = hasLat ? 'longitude' : 'latitude';
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('validation.coordsBothRequired'),
      path: [field],
    });
    return;
  }

  if (hasLat && hasLng) {
    const lat = Number(data.latitude);
    const lng = Number(data.longitude);

    if (!Number.isFinite(lat)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('validation.coordsInvalid'),
        path: ['latitude'],
      });
    } else if (lat < -90 || lat > 90) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('validation.latitudeRange'),
        path: ['latitude'],
      });
    }

    if (!Number.isFinite(lng)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('validation.coordsInvalid'),
        path: ['longitude'],
      });
    } else if (lng < -180 || lng > 180) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('validation.longitudeRange'),
        path: ['longitude'],
      });
    }
  }
}

// ── Create Property schema ───────────────────────────────────────────

export function createPropertySchema(t: (key: string) => string) {
  return z
    .object({
      title: z
        .string()
        .min(1, t('validation.titleRequired'))
        .max(200, t('validation.titleMaxLength'))
        .trim(),
      description: z
        .string()
        .max(5000, t('validation.descriptionMaxLength'))
        .optional()
        .default(''),
      propertyType: z.enum(PROPERTY_TYPES, {
        message: t('validation.propertyTypeRequired'),
      }),
      city: z.enum(CITIES, {
        message: t('validation.cityRequired'),
      }),
      neighborhood: z.string().optional().default(''),
      addressLine1: z.string().optional().default(''),
      latitude: z.string().optional().default(''),
      longitude: z.string().optional().default(''),
      rentAmount: z
        .string()
        .min(1, t('validation.rentAmountRequired'))
        .refine((v) => Number(v) > 0, t('validation.rentAmountPositive')),
      cautionMonths: z.string().default('2'),
      upfrontMonths: z.string().default('6'),
      selectedAmenities: z.array(z.enum(AMENITY_IDS)).default([]),
    })
    .superRefine((data, ctx) => coordinatePairValidation(data, ctx, t));
}

export type PropertyFormValues = z.infer<ReturnType<typeof createPropertySchema>>;
export type PropertyFormInput = z.input<ReturnType<typeof createPropertySchema>>;

/** Fields validated per step — used with form.trigger(). */
export const PROPERTY_STEP_FIELDS: Record<number, (keyof PropertyFormValues)[]> = {
  1: [
    'title',
    'propertyType',
    'city',
    'description',
    'neighborhood',
    'addressLine1',
    'latitude',
    'longitude',
  ],
  2: ['rentAmount', 'cautionMonths', 'upfrontMonths', 'selectedAmenities'],
  3: [], // images managed separately
};

// ── Edit Property schema ─────────────────────────────────────────────

export function createEditPropertySchema(t: (key: string) => string) {
  return z
    .object({
      title: z
        .string()
        .min(1, t('validation.titleRequired'))
        .max(200, t('validation.titleMaxLength'))
        .trim(),
      description: z
        .string()
        .max(5000, t('validation.descriptionMaxLength'))
        .optional()
        .default(''),
      rentAmount: z
        .string()
        .min(1, t('validation.rentAmountRequired'))
        .refine((v) => Number(v) > 0, t('validation.rentAmountPositive')),
      cautionMonths: z.string().default('2'),
      upfrontMonths: z.string().default('6'),
      latitude: z.string().optional().default(''),
      longitude: z.string().optional().default(''),
    })
    .superRefine((data, ctx) => coordinatePairValidation(data, ctx, t));
}

export type EditPropertyFormValues = z.infer<ReturnType<typeof createEditPropertySchema>>;
export type EditPropertyFormInput = z.input<ReturnType<typeof createEditPropertySchema>>;
