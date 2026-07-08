import { NextRequest, NextResponse } from 'next/server';

async function saveToAnalyticsHistory(
  userId: string,
  data: { url: string; method: string; status: number }
) {
  console.log(
    `[HISTORY SAVED FOR USER ${userId}]: ${data.method} ${data.url} - Status: ${data.status}`
  );
}

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
    const { url, method, headers: clientHeaders, body } = await request.json();
    const authHeader = request.headers.get('authorization');
    let authenticatedUserId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      //const token = authHeader.split(' ')[1];
      authenticatedUserId = 'user_mock_id_123';
    }

    const mergedHeaders: Record<string, string> = { ...clientHeaders };

    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers: mergedHeaders,
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

    if (authenticatedUserId) {
      await saveToAnalyticsHistory(authenticatedUserId, {
        url,
        method: method.toUpperCase(),
        status: response.status,
      });
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
