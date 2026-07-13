import { describe, test, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route'; // Убедись, что путь к файлу роута верный
import { addDoc } from 'firebase/firestore';

vi.mock('@/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-doc-id' }),
}));

describe('Proxy API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('GET Method', () => {
    test('should return 400 if url param is missing', async () => {
      const req = new NextRequest('http://localhost/api/proxy');
      const res = await GET(req);

      expect(res.status).toBe(400);
      const data = (await res.json()) as Record<string, string>;
      expect(data.error).toBe('Missing target URL');
    });

    test('should fetch schema text successfully and return 200', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve('openapi: 3.0.0'),
      });
      vi.stubGlobal('fetch', mockFetch);

      const req = new NextRequest('http://localhost/api/proxy?url=https://example.com');
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('text/plain');
      const text = await res.text();
      expect(text).toBe('openapi: 3.0.0');
    });
  });

  describe('POST Method', () => {
    test('should return 400 if target url is missing in body', async () => {
      const req = new NextRequest('http://localhost/api/proxy', {
        method: 'POST',
        body: JSON.stringify({ method: 'GET' }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = (await res.json()) as Record<string, string>;
      expect(data.error).toBe('Missing target URL for proxying');
    });

    test('should execute proxy request, record history in firebase and return 200 with typed JSON body', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json; charset=utf-8' }),
        text: () => Promise.resolve('{"id": 123, "name": "barsik"}'),
      });
      vi.stubGlobal('fetch', mockFetch);

      const req = new NextRequest('http://localhost/api/proxy', {
        method: 'POST',
        headers: { 'x-user-id': 'test-user-id' },
        body: JSON.stringify({
          url: 'https://petstore.com',
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: '{"name": "barsik"}',
        }),
      });

      const res = await POST(req);

      expect(res.status).toBe(200);

      const data = (await res.json()) as {
        status: number;
        type: string;
        body: Record<string, unknown>;
        headers: Record<string, string>;
      };

      expect(data.status).toBe(201);
      expect(data.type).toBe('json');
      expect(data.body).toEqual({ id: 123, name: 'barsik' });

      expect(addDoc).toHaveBeenCalled();
    });

    test('should execute proxy request and return type html for text/html error pages', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        headers: new Headers({ 'content-type': 'text/html' }),
        text: () => Promise.resolve('<html><body>403 Forbidden</body></html>'),
      });
      vi.stubGlobal('fetch', mockFetch);

      const req = new NextRequest('http://localhost/api/proxy', {
        method: 'POST',
        body: JSON.stringify({
          url: 'https://petstore.com/2',
          method: 'DELETE',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const data = (await res.json()) as {
        status: number;
        type: string;
        body: string;
      };

      expect(data.status).toBe(403);
      expect(data.type).toBe('html');
      expect(data.body).toContain('403 Forbidden');
    });
  });
});
