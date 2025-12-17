import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL!;

export async function POST(): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const refresh = cookieStore.get('refresh')?.value;

    if (!refresh) {
      return Response.json({ error: 'Refresh token missing' }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login/refresh/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: {
          'content-type': res.headers.get('content-type') || 'application/json',
        },
      });
    }

    const { access, refresh: newRefresh } = await res.json();

    const response = NextResponse.json({});

    response.cookies.set('access', access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    response.cookies.set('refresh', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
