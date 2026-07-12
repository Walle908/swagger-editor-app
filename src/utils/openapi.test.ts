import { describe, test, expect } from 'vitest';
import { parseAndGroupSchema } from './openapi';
import { OpenAPISchema } from '@/types/openapi';

describe('OpenAPI Parsing Utilities', () => {
  test('should return an empty object if schema is null or undefined', () => {
    const resultNull = parseAndGroupSchema(null, 'No Summary', 'No Description');
    const resultUndefined = parseAndGroupSchema(undefined, 'No Summary', 'No Description');

    expect(resultNull).toEqual({});
    expect(resultUndefined).toEqual({});
  });

  test('should parse and group paths correctly based on tags', () => {
    const mockSchema: OpenAPISchema = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/users': {
          get: {
            tags: ['UserCategory'],
            summary: 'Get all users',
            responses: {
              '200': { description: 'Success' },
            },
          },
        },
      },
    };

    const result = parseAndGroupSchema(mockSchema, 'Fallback Summary', 'Fallback Description');

    const userCategory = result['UserCategory'];

    expect(userCategory).toBeDefined();

    if (userCategory && userCategory[0]) {
      expect(userCategory.length).toBe(1);
      expect(userCategory[0].path).toBe('/users');
      expect(userCategory[0].method).toBe('GET');
      expect(userCategory[0].summary).toBe('Get all users');
    }
  });

  test('should use fallback texts if summary or description is missing', () => {
    const mockSchema: OpenAPISchema = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/items': {
          post: {
            responses: {
              '200': { description: 'Success' },
            },
          },
        },
      },
    };

    const result = parseAndGroupSchema(mockSchema, 'Default Summary', 'Default Description');

    const defaultCategory = result['default'];

    expect(defaultCategory).toBeDefined();

    if (defaultCategory && defaultCategory[0]) {
      expect(defaultCategory[0].summary).toBe('Default Summary');
      expect(defaultCategory[0].description).toBe('Default Description');
    }
  });
});
