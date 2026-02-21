import { z } from 'zod';
import { CM_PHONE_RE, LANGUAGES, USER_ROLES, normalizePhone } from './common';

export function createSettingsSchema(t: (key: string) => string) {
  return z.object({
    firstName: z.string().min(1, t('validation.firstNameRequired')).trim(),
    lastName: z.string().min(1, t('validation.lastNameRequired')).trim(),
    phone: z
      .string()
      .transform(normalizePhone)
      .pipe(z.union([z.literal(''), z.string().regex(CM_PHONE_RE, t('validation.phoneInvalid'))]))
      .optional()
      .default(''),
    role: z.enum(USER_ROLES),
    language: z.enum(LANGUAGES),
  });
}

export type SettingsFormValues = z.infer<ReturnType<typeof createSettingsSchema>>;
export type SettingsFormInput = z.input<ReturnType<typeof createSettingsSchema>>;
