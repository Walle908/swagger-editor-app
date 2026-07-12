import { describe, test, expect } from 'vitest';
import { generateCurlCommand } from './cUrlGenerator';
import { OpenAPIParameterData } from '@/types/openapi';

describe('generateCurlCommand Utility', () => {
  test('should generate a basic cURL command with HTTP method and target URL', () => {
    const result = generateCurlCommand({
      method: 'get',
      path: '/posts',
      baseUrl: 'https://example.com/',
      paramValues: {},
    });

    expect(result).toBe('curl -X GET "https://example.com/posts"');
  });

  test('should properly substitute path parameters and append query parameters', () => {
    const mockParameters: OpenAPIParameterData[] = [
      { name: 'id', in: 'path', required: true, type: 'string' },
      { name: 'filter', in: 'query', required: false, type: 'string' },
    ];

    const mockParamValues = {
      id: '123',
      filter: 'active status',
    };

    const result = generateCurlCommand({
      method: 'get',
      path: '/posts/{id}',
      baseUrl: 'https://example.com',
      parameters: mockParameters,
      paramValues: mockParamValues,
    });

    expect(result).toContain('https://example.com/posts/123?filter=active%20status');
  });

  test('should inject headers, cookies, and escaped request body parameters into cURL command', () => {
    const mockParameters: OpenAPIParameterData[] = [
      { name: 'X-Auth-Token', in: 'header', required: true, type: 'string' },
      { name: 'session_id', in: 'cookie', required: true, type: 'string' },
    ];

    const mockParamValues = {
      'X-Auth-Token': 'secret-token',
      session_id: 'abc-456',
    };

    const mockBody = '{"title": "Hello World"}';

    const result = generateCurlCommand({
      method: 'post',
      path: '/posts',
      baseUrl: 'https://example.com',
      parameters: mockParameters,
      paramValues: mockParamValues,
      requestBodyExample: mockBody,
      requestBodyFormat: 'json',
    });

    expect(result).toContain('-H "Content-Type: application/json"');
    expect(result).toContain('-H "X-Auth-Token: secret-token"');
    expect(result).toContain('-H "Cookie: session_id=abc-456"');

    expect(result).toContain('-d "{\\"title\\": \\"Hello World\\"}"');
  });
});
