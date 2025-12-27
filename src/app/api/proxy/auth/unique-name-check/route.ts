// src/app/api/proxy/auth/unique-name-check/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL!;

export async function GET(req: Request): Promise<Response> {
  try {
    // Извлекаем nickname из query string
    const url = new URL(req.url);
    const nickname = url.searchParams.get('nickname');

    if (!nickname) {
      return NextResponse.json(
        { error: 'Nickname is required in query string' },
        { status: 400 }
      );
    }

    // Формируем URL для внешнего бэкенда
    const backendUrl = `${BACKEND_URL}/api/v1/auth/messenger/profile/unique_nickname_check/${encodeURIComponent(nickname)}/`;

    console.log('Forwarding request to:', backendUrl); // Лог для отладки

    // Выполняем fetch к внешнему бэкенду
    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Добавьте другие заголовки, если требуются (например, авторизация)
      },
    });

    console.log('Backend response status:', res.status); // Лог статуса ответа бэкенда

    // Возвращаем ответ бэкенда как есть
    const responseBody = res.body; // Используем поток напрямую
    const responseInit = {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') || 'application/json',
        // Копируйте другие заголовки, если нужно
      },
    };

    return new Response(responseBody, responseInit);

  } catch (error) {
    console.error('Error in /api/proxy/auth/unique-name-check (GET):', error);
    return NextResponse.json(
      { error: 'Internal server error during proxy call', details: (error as Error).message },
      { status: 500 }
    );
  }
}