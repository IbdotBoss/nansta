import { NextRequest, NextResponse } from 'next/server';

const NANSTA_BACKEND = process.env.NANSTA_API_URL || 'https://nansta.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${NANSTA_BACKEND}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // Vercel has 10s timeout on hobby, 60s on pro
      signal: AbortSignal.timeout(55_000),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Backend error: ${response.status}`, detail: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'nansta-next',
    backend: NANSTA_BACKEND,
  });
}
