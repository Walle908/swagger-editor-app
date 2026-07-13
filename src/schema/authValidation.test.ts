import { describe, expect, it } from 'vitest';
import { getRegisterSchema, getLoginSchema } from './authValidation';

const tMock = (key: string) => key;

describe('Auth Validation Schemas', () => {
  describe('getLoginSchema', () => {
    const loginSchema = getLoginSchema(tMock);

    it('should pass on valid email and password', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail on empty email or password', () => {
      const result = loginSchema.safeParse({ email: '', password: '' });
      expect(result.success).toBe(false);

      if (!result.success) {
        const emailError = result.error.issues.find(
          (i) => i.path.includes('email') && i.message === 'invalidEmail'
        );
        const passwordError = result.error.issues.find(
          (i) => i.path.includes('password') && i.message === 'passwordRequired'
        );

        expect(emailError).toBeDefined();
        expect(passwordError).toBeDefined();
      }
    });

    it('should fail on invalid email format', () => {
      const result = loginSchema.safeParse({ email: 'not-an-email', password: '123' });
      expect(result.success).toBe(false);

      if (!result.success) {
        const emailError = result.error.issues.find(
          (i) => i.path.includes('email') && i.message === 'invalidEmail'
        );
        expect(emailError).toBeDefined();
      }
    });
  });

  describe('getRegisterSchema', () => {
    const registerSchema = getRegisterSchema(tMock);

    it('should pass on a strong, fully valid secure password and matching confirmation', () => {
      const validData = {
        name: 'Elena',
        email: 'elena@example.com',
        password: 'P@ssword1',
        confirmPassword: 'P@ssword1',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail on empty required fields', () => {
      const result = registerSchema.safeParse({
        name: '   ',
        email: '',
        password: '',
        confirmPassword: '',
      });
      expect(result.success).toBe(false);

      if (!result.success) {
        const nameError = result.error.issues.find(
          (i) => i.path.includes('name') && i.message === 'name'
        );
        const passError = result.error.issues.find(
          (i) => i.path.includes('password') && i.message === 'passwordRequired'
        );
        const confError = result.error.issues.find(
          (i) => i.path.includes('confirmPassword') && i.message === 'confirmPasswordRequired'
        );

        expect(nameError).toBeDefined();
        expect(passError).toBeDefined();
        expect(confError).toBeDefined();
      }
    });

    it('should fail when name is less than 2 characters after trim', () => {
      const result = registerSchema.safeParse({
        name: ' X ',
        email: 'test@example.com',
        password: 'P@ssword1',
        confirmPassword: 'P@ssword1',
      });
      expect(result.success).toBe(false);

      if (!result.success) {
        const nameError = result.error.issues.find(
          (i) => i.path.includes('name') && i.message === 'tooShort'
        );
        expect(nameError).toBeDefined();
      }
    });

    it('should sequentially fail rules of password strength step-by-step', () => {
      let result = registerSchema.safeParse({
        name: 'Elena',
        email: 'elena@example.com',
        password: '1234567!',
        confirmPassword: '1234567!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path.includes('password') && i.message === 'passwordNoLetter'
        );
        expect(err).toBeDefined();
      }

      result = registerSchema.safeParse({
        name: 'Elena',
        email: 'elena@example.com',
        password: 'Password!',
        confirmPassword: 'Password!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path.includes('password') && i.message === 'passwordNoDigit'
        );
        expect(err).toBeDefined();
      }

      result = registerSchema.safeParse({
        name: 'Elena',
        email: 'elena@example.com',
        password: 'Password1',
        confirmPassword: 'Password1',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path.includes('password') && i.message === 'passwordNoSpecial'
        );
        expect(err).toBeDefined();
      }

      result = registerSchema.safeParse({
        name: 'Elena',
        email: 'elena@example.com',
        password: 'P@s1',
        confirmPassword: 'P@s1',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path.includes('password') && i.message === 'passwordTooShort'
        );
        expect(err).toBeDefined();
      }
    });

    it('should fail when password and confirmPassword do not match', () => {
      const result = registerSchema.safeParse({
        name: 'Elena',
        email: 'elena@example.com',
        password: 'P@ssword1',
        confirmPassword: 'DifferentPassword123!',
      });
      expect(result.success).toBe(false);

      if (!result.success) {
        const matchError = result.error.issues.find(
          (i) => i.path.includes('confirmPassword') && i.message === 'passwordsDontMatch'
        );
        expect(matchError).toBeDefined();
      }
    });
  });
});
