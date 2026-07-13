import { describe, expect, it } from 'vitest';
import getInitials from './getInitials';

describe('getInitials Utility Function', () => {
  describe('Edge cases (Empty or Null values)', () => {
    it('should return "U" if name is null', () => {
      expect(getInitials(null)).toBe('U');
    });

    it('should return "U" if name is an empty string', () => {
      expect(getInitials('')).toBe('U');
    });

    it('should return "U" if name contains only spaces', () => {
      expect(getInitials('   ')).toBe('U');
    });
  });

  describe('Single Names or Words', () => {
    it('should return the first two letters in uppercase for a single word', () => {
      expect(getInitials('John')).toBe('JO');
      expect(getInitials('alex')).toBe('AL');
    });

    it('should handle short single names', () => {
      expect(getInitials('A')).toBe('A');
    });
  });

  describe('Multiple Words / Full Names', () => {
    it('should return initials of the first and second word in uppercase', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('ivan ivanov')).toBe('II');
    });

    it('should ignore third or subsequent words', () => {
      expect(getInitials('John Fitzgerald Kennedy')).toBe('JF');
    });

    it('should handle multiple spaces between words correctly', () => {
      expect(getInitials('  John    Doe  ')).toBe('JD');
    });
  });
});
