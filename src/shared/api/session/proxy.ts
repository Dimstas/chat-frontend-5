import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies, setAuthCookies } from './auth';
import { doRefresh } from './refresh';

const BACKEND = process.env.BACKEND_API_URL!;

/**
 * Подготавливает тело запроса
 */
const prepareRequestBody = async (req: NextRequest): Promise<ArrayBuffer | null> => {
  if (req.method === 'GET' || req.method === 'HEAD') return null;
  return await req.arrayBuffer();
};

/**
 * Создает заголовки для запроса к бэкенду
 */
const prepareRequestHeaders = (req: NextRequest, accessToken?: string): Record<string, string> => {
  const headers: Record<string, string> = {};

  const contentType = req.headers.get('content-type');
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
};

/**
 * Фильтрует заголовки для отправки на фронт
 */
const filterBackendHeaders = (backendHeaders: Headers): Record<string, string> => {
  const headers: Record<string, string> = {};

  const pick = (name: string): void => {
    const value = backendHeaders.get(name);
    if (value) headers[name] = value;
  };

  pick('content-type');

  pick('content-disposition');
  pick('accept-ranges');
  pick('content-range');

  return headers;
};

/**
 * Основная функция проксирования запросов
 */
export const route = async (req: NextRequest, path: string[]): Promise<NextResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  const refreshToken = cookieStore.get('refresh')?.value;

  const targetUrl = `${BACKEND}/${path.join('/')}/${req.nextUrl.search}`;
  const makeBackendRequest = async (token?: string, body?: BodyInit | null): Promise<Response> => {
    const headers = prepareRequestHeaders(req, token);

    return fetch(targetUrl, {
      method: req.method,
      headers,
      body: body || null,
    });
  };

  try {
    const requestBody = await prepareRequestBody(req);

    let backendResponse = await makeBackendRequest(accessToken, requestBody);

    if (backendResponse.status === 401 && refreshToken) {
      try {
        const newTokens = await doRefresh(refreshToken);

        backendResponse = await makeBackendRequest(newTokens.access, requestBody);

        const responseData = await backendResponse.text();
        const response = new NextResponse(responseData, {
          status: backendResponse.status,
          headers: filterBackendHeaders(backendResponse.headers),
        });

        return setAuthCookies(response, newTokens);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        const errorResponse = NextResponse.json(
          { error: 'Authentication required. Please log in again.' },
          { status: 401 },
        );
        return clearAuthCookies(errorResponse);
      }
    }

    const responseData = await backendResponse.text();

    const response = new NextResponse(responseData, {
      status: backendResponse.status,
      headers: filterBackendHeaders(backendResponse.headers),
    });

    if (backendResponse.status === 401) {
      return clearAuthCookies(response);
    }

    return response;
  } catch (error) {
    console.error('Proxy route error:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
