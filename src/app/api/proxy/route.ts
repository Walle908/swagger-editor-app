import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
  }

  try {
    const cleanedUrl = targetUrl.trim();
    new URL(cleanedUrl);

    const response = await fetch(cleanedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Target server returned status ${response.status}` },
        { status: response.status }
      );
    }

    const schemaText = await response.text();

    return new NextResponse(schemaText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to fetch schema: ${errorMessage}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const parsedData = rawBody ? JSON.parse(rawBody) : {};
    const { url, method, headers, body } = parsedData;

    if (!url) {
      return NextResponse.json({ error: 'Missing target URL for proxying' }, { status: 400 });
    }
    const requestSize = typeof body === 'string' ? Buffer.byteLength(body, 'utf-8') : 0;
    const startTime = Date.now();

    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        ...headers,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
    });
    const durationMs = Date.now() - startTime;
    const rawResponseText = await response.text();
    const responseSize = Buffer.byteLength(rawResponseText, 'utf-8');

    const contentType = response.headers.get('content-type') || '';

    let responseBodyType: 'json' | 'html' | 'text' = 'text';
    let responseBody: unknown = rawResponseText;

    if (contentType.includes('application/json')) {
      try {
        responseBody = JSON.parse(rawResponseText);
        responseBodyType = 'json';
      } catch {
        responseBody = rawResponseText;
        responseBodyType = 'text';
      }
    } else if (contentType.includes('text/html')) {
      responseBodyType = 'html';
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let errorDetails = '';
    if (!response.ok) {
      errorDetails = typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody);
    }

    const userIdHeader = request.headers.get('x-user-id');

    if (userIdHeader) {
      try {
        const historyCollection = collection(db, 'requests_history');

        await addDoc(historyCollection, {
          userId: userIdHeader,
          method: method.toUpperCase(),
          url: url,
          status: response.status,
          timestamp: new Date().toISOString(),
          durationMs,
          requestSize,
          responseSize,
          errorDetails: errorDetails,
        });
      } catch (err: unknown) {
        Object.keys({ err });
      }
    }
    return NextResponse.json(
      {
        status: response.status,
        headers: responseHeaders,
        type: responseBodyType,
        body: responseBody,
      },
      {
        status: 200,
      }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Proxy failed to execute request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
