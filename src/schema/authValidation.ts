import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .min(2, { message: 'Minimum name length is 2 characters' }),
    email: z
      .string()
      .trim()
      .pipe(z.email({ error: 'Please enter a valid email address (e.g., name@domain.io)' })),
    password: z
      .string()
      .min(1, 'Password is required.')
      .refine((val) => /[\p{L}\p{M}]/u.test(val), {
        message: 'Password must contain at least one letter',
      })
      .refine((val) => /\d/.test(val), {
        message: 'Password must contain at least one digit',
      })
      .refine((val) => /[\p{P}\p{S}]/u.test(val), {
        message: 'Password must contain at least one special character',
      })
      .min(8, { message: 'Minimum password length is 8 characters' }),

    confirmPassword: z.string().min(1, 'Confirm password is required.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type RegisterFields = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: 'Please enter a valid email address (e.g., name@domain.io).' })),
  password: z.string().min(1, 'Password is required.'),
});

export type LoginFields = z.infer<typeof loginSchema>;
