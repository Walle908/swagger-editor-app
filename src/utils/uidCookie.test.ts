import { describe, expect, it, beforeEach } from 'vitest';
import { setUidCookie, clearUidCookie } from './uidCookie';
describe('UID Cookie Utilities', () => {
  beforeEach(() => {
    document.cookie = 'uid=; path=/; max-age=0';
  });

  describe('setUidCookie', () => {
    it('should successfully set the uid cookie with the provided value', () => {
      const mockUid = 'user_12345';

      setUidCookie(mockUid);

      expect(document.cookie).toBe('uid=user_12345');
    });

    it('should overwrite the existing uid cookie when called with a new value', () => {
      setUidCookie('first_id');
      setUidCookie('second_id');

      expect(document.cookie).toBe('uid=second_id');
    });
  });

  describe('clearUidCookie', () => {
    it('should remove the uid cookie from document.cookie', () => {
      setUidCookie('temporary_id');
      expect(document.cookie).toBe('uid=temporary_id');

      clearUidCookie();
      expect(document.cookie).toBe('');
    });

    it('should not crash if clearUidCookie is called when the cookie does not exist', () => {
      expect(() => clearUidCookie()).not.toThrow();
      expect(document.cookie).toBe('');
    });
  });
});
