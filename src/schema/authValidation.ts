import { z } from 'zod';

export const getRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, t('name'))
        .min(2, { message: t('tooShort') }),
      email: z
        .string()
        .trim()
        .pipe(z.email({ error: t('invalidEmail') })),
      password: z
        .string()
        .min(1, t('passwordRequired'))
        .refine((val) => /[\p{L}\p{M}]/u.test(val), {
          message: t('passwordNoLetter'),
        })
        .refine((val) => /\d/.test(val), {
          message: t('passwordNoDigit'),
        })
        .refine((val) => /[\p{P}\p{S}]/u.test(val), {
          message: t('passwordNoSpecial'),
        })
        .min(8, { message: t('passwordTooShort') }),

      confirmPassword: z.string().min(1, t('confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordsDontMatch'),
      path: ['confirmPassword'],
    });

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .trim()
      .pipe(z.email({ error: t('invalidEmail') })),
    password: z.string().min(1, t('passwordRequired')),
  });

export type RegisterFields = z.infer<ReturnType<typeof getRegisterSchema>>;
export type LoginFields = z.infer<ReturnType<typeof getLoginSchema>>;
