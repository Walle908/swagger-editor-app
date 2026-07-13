import { describe, test, expect, vi } from 'vitest';

import { detectFormat, convertFormat, validateSwagger } from './swaggerConvert';

vi.mock('@apidevtools/swagger-parser', () => {
  return {
    default: {
      validate: vi.fn().mockImplementation((parsedData: unknown) => {
        if (parsedData && typeof parsedData === 'object' && 'invalid' in parsedData) {
          throw new Error('SwaggerParser mock error');
        }
        return parsedData;
      }),
    },
  };
});

describe('swaggerConvert Utilities', () => {
  describe('detectFormat', () => {
    test('should return json if input starts with a curly brace', () => {
      const result = detectFormat('  {"openapi": "3.0.0"}  ');
      expect(result).toBe('json');
    });

    test('should return json if input starts with a bracket', () => {
      const result = detectFormat('[1, 2, 3]');
      expect(result).toBe('json');
    });

    test('should return yaml if input does not start with JSON characters', () => {
      const result = detectFormat('openapi: 3.0.0\ninfo:\n  title: Test');
      expect(result).toBe('yaml');
    });

    test('should default to json if input is empty', () => {
      const result = detectFormat('   ');
      expect(result).toBe('json');
    });
  });

  describe('convertFormat', () => {
    test('should stringify an object to formatted JSON structure', () => {
      const yamlInput = 'title: Petstore\nversion: 1.0.0';
      const result = convertFormat(yamlInput, 'json');

      expect(result).toContain('"title": "Petstore"');
      expect(result).toContain('"version": "1.0.0"');
    });

    test('should dump an object to formatted YAML structure', () => {
      const jsonInput = '{"title": "Petstore", "version": "1.0.0"}';
      const result = convertFormat(jsonInput, 'yaml');

      expect(result).toContain('title: Petstore');
      expect(result).toContain('version: 1.0.0');
    });

    test('should return empty string if input is blank', () => {
      const result = convertFormat('   ', 'json');
      expect(result).toBe('');
    });

    test('should return fallback value if safe parsing throws an error', () => {
      const invalidYaml = 'title: [unclosed bracket';
      const result = convertFormat(invalidYaml, 'json');
      expect(result).toBe(invalidYaml);
    });
  });

  describe('validateSwagger', () => {
    test('should return invalid state if schema text is empty', async () => {
      const result = await validateSwagger('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('schema is empty');
      expect(result.parsedData).toBeNull();
    });

    test('should return valid configuration for a correctly parsed schema', async () => {
      const validYaml = 'openapi: 3.0.0\ninfo:\n  title: API';
      const result = await validateSwagger(validYaml);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.parsedData).toEqual({
        openapi: '3.0.0',
        info: { title: 'API' },
      });
    });

    test('should safely intercept errors when syntax parsing fails', async () => {
      const invalidStructure = 'openapi: [unclosed array';
      const result = await validateSwagger(invalidStructure);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.parsedData).toBeNull();
    });

    test('should intercept deep structural errors thrown by validation layers', async () => {
      const nonObjectInput = 'just a string value';
      const result = await validateSwagger(nonObjectInput);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Data must be ob');
      expect(result.parsedData).toBeNull();
    });

    test('should capture core schema structural issues from parser library', async () => {
      const parserErrorYaml = 'openapi: 3.0.0\ninvalid: true';
      const result = await validateSwagger(parserErrorYaml);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('SwaggerParser mock error');
      expect(result.parsedData).toBeNull();
    });
  });
});
