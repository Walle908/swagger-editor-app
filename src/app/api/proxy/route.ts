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
    const { url, method, headers, body } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing target URL for proxying' }, { status: 400 });
    }

    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        ...headers,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
    });

    let responseBody;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

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
        });
      } catch (firebaseErr) {
        console.error('Error in Firebase:', firebaseErr);
      }
    }

    return NextResponse.json({
      status: response.status,
      headers: responseHeaders,
      body: responseBody,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Proxy Execution Error:', errorMessage);
    return NextResponse.json(
      { error: `Proxy failed to execute request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
