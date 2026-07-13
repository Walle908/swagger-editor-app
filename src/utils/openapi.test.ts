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

  test('should generate valid mock object for requestBody with complex types', () => {
    const mockSchema = {
      openapi: '3.0.0',
      info: { title: 'Test', version: '1' },
      paths: {
        '/test': {
          post: {
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      isActive: { type: 'boolean' },
                      price: { type: 'number' },
                      status: { type: 'string', enum: ['available', 'pending'] },
                      tags: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            tagId: { type: 'integer' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            responses: { '200': { description: 'Ok' } },
          },
        },
      },
    } as unknown as OpenAPISchema;

    const result = parseAndGroupSchema(mockSchema, 'S', 'D');
    const defaultCategory = result['default'];

    expect(defaultCategory).toBeDefined();

    if (defaultCategory && defaultCategory[0]) {
      const exampleStr = defaultCategory[0].requestBodyExample || '{}';
      const example = JSON.parse(exampleStr) as Record<
        string,
        string | number | boolean | unknown[] | Record<string, unknown>
      >;

      expect(example.id).toBe(0);
      expect(example.name).toBe('string');
      expect(example.isActive).toBe(true);
      expect(example.price).toBe(0);
      expect(example.status).toBe('available');
      expect(example.tags).toEqual([{ tagId: 0 }]);
    }
  });

  test('should parse and merge common parameters with method parameters correctly', () => {
    const mockSchema = {
      openapi: '3.0.0',
      info: { title: 'Param Test', version: '1' },
      paths: {
        '/products': {
          parameters: [
            { name: 'X-Common-Header', in: 'header', required: true, schema: { type: 'string' } },
          ],
          get: {
            parameters: [
              {
                name: 'limit',
                in: 'query',
                required: false,
                schema: { type: 'integer', default: 10 },
              },
              { name: 'session', in: 'cookie', required: false, schema: { type: 'string' } },
            ],
            responses: { '200': { description: 'Ok' } },
          },
        },
      },
    } as unknown as OpenAPISchema;

    const result = parseAndGroupSchema(mockSchema, 'S', 'D');
    const defaultCategory = result['default'];

    expect(defaultCategory).toBeDefined();

    if (defaultCategory && defaultCategory[0]) {
      const params = defaultCategory[0].parameters;
      expect(params).not.toBeNull();

      if (params && params[0] && params[1] && params[2]) {
        expect(params.length).toBe(3);

        expect(params[0].name).toBe('X-Common-Header');
        expect(params[0].in).toBe('header');

        expect(params[1].name).toBe('limit');
        expect(params[1].in).toBe('query');
        expect(params[1].type).toBe('integer');
        expect(params[1].default).toBe('10');

        expect(params[2].name).toBe('session');
        expect(params[2].in).toBe('cookie');
      }
    }
  });

  test('should sort endpoints alphabetically by path and then by HTTP method weight', () => {
    const mockSchema = {
      openapi: '3.0.0',
      info: { title: 'Sort Test', version: '1' },
      paths: {
        '/zebra': {
          get: { responses: { '200': { description: 'Ok' } } },
        },
        '/apple': {
          delete: { responses: { '200': { description: 'Ok' } } },
          get: { responses: { '200': { description: 'Ok' } } },
          post: { responses: { '200': { description: 'Ok' } } },
        },
      },
    } as unknown as OpenAPISchema;

    const result = parseAndGroupSchema(mockSchema, 'S', 'D');
    const defaultCategory = result['default'];

    expect(defaultCategory).toBeDefined();

    if (
      defaultCategory &&
      defaultCategory[0] &&
      defaultCategory[1] &&
      defaultCategory[2] &&
      defaultCategory[3]
    ) {
      expect(defaultCategory.length).toBe(4);

      expect(defaultCategory[0].path).toBe('/apple');
      expect(defaultCategory[1].path).toBe('/apple');
      expect(defaultCategory[2].path).toBe('/apple');
      expect(defaultCategory[3].path).toBe('/zebra');

      expect(defaultCategory[0].method).toBe('GET');
      expect(defaultCategory[1].method).toBe('POST');
      expect(defaultCategory[2].method).toBe('DELETE');
    }
  });
});
