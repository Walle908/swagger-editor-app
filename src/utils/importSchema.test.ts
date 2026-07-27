import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { importSchemaFromUrl } from './importSchema';

vi.mock('./swaggerConvert', () => ({
  detectFormat: (text: string) => (text.startsWith('{') ? 'json' : 'yaml'),
  validateSwagger: async (text: string) => {
    if (text.includes('invalid')) {
      return { isValid: false, error: 'Validation mock error', parsedData: null };
    }
    return { isValid: true, error: null, parsedData: {} };
  },
}));

describe('importSchemaFromUrl Utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('should return validation error if the target URL parameter is empty', async () => {
    const result = await importSchemaFromUrl('   ');

    expect(result.success).toBe(false);
    expect(result.error).toBe('URL is empty');
  });

  test('should handle network errors gracefully when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Fail')));

    const result = await importSchemaFromUrl('https://example.com');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error or failed to process the schema.');
  });

  test('should return failure if the proxy endpoint returns non-200 HTTP response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    const result = await importSchemaFromUrl('https://example.com');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Server returned status 500');
  });

  test('should parse and return valid schema configuration upon successful proxy fetch', async () => {
    const validJsonText = '{"openapi": "3.0.0"}';

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => validJsonText,
      })
    );

    const result = await importSchemaFromUrl('https://example.com');

    expect(result.success).toBe(true);
    expect(result.textData).toBe(validJsonText);
    expect(result.detectedFormat).toBe('json');
    expect(result.error).toBeUndefined();
  });

  test('should capture validation errors if the downloaded schema text content is corrupted', async () => {
    const invalidSchemaText = 'openapi: invalid layout format';

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => invalidSchemaText,
      })
    );

    const result = await importSchemaFromUrl('https://example.com');

    expect(result.success).toBe(false);
    expect(result.textData).toBe(invalidSchemaText);
    expect(result.detectedFormat).toBe('yaml');
    expect(result.error).toContain('Schema is invalid:');
    expect(result.error).toContain('Validation mock error');
  });
});
