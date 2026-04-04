// src/app/api/auth/get-plusofon-token/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL!;

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { session_uid, session_secret } = body;

    if (!session_uid || !session_secret) {
      return Response.json({ error: 'session_uid and session_secret are required' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/providers/plusofon/flash-call/claim/${session_uid}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_secret }),
    });

    // Обработка ошибок бэкенда
    if (!res.ok) {
      const errorData = await res.json();
      return Response.json({ error: errorData.message || 'Ошибка авторизации' }, { status: res.status });
    }

    const data = await res.json();
    const { access, refresh, is_filled } = data;

    // Формируем ответ (так же как в get-token)
    const response = NextResponse.json({ is_filled });

    // Устанавливаем cookies (такие же как в get-token)
    response.cookies.set('access', access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 20 * 60,
    });

    response.cookies.set('refresh', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Plusofon claim error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
