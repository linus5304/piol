import { z } from 'zod';
import { CM_PHONE_RE, normalizePhone } from './common';

export function createContactSchema(t: (key: string) => string) {
  return z.object({
    firstName: z.string().min(1, t('validation.firstNameRequired')).trim(),
    lastName: z.string().min(1, t('validation.lastNameRequired')).trim(),
    email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
    phone: z
      .string()
      .transform(normalizePhone)
      .pipe(z.union([z.literal(''), z.string().regex(CM_PHONE_RE, t('validation.phoneInvalid'))]))
      .optional()
      .default(''),
    subject: z.string().min(1, t('validation.subjectRequired')).trim(),
    message: z.string().min(1, t('validation.messageRequired')).trim(),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
export type ContactFormInput = z.input<ReturnType<typeof createContactSchema>>;
