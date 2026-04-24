// import { cookies } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';
// import { clearAuthCookies, setAuthCookies } from './auth';
// import { doRefresh } from './refresh';

// const BACKEND = process.env.BACKEND_API_URL!;

// /**
//  * Подготавливает тело запроса
//  */
// const prepareRequestBody = async (req: NextRequest): Promise<ArrayBuffer | null> => {
//   if (req.method === 'GET' || req.method === 'HEAD') return null;
//   return await req.arrayBuffer();
// };

// /**
//  * Создает заголовки для запроса к бэкенду
//  */
// const prepareRequestHeaders = (
//   req: NextRequest,
//   accessToken?: string,
//   body?: BodyInit | null,
// ): Record<string, string> => {
//   const headers: Record<string, string> = {};

//   const contentType = req.headers.get('content-type');

//   const hasBody = body != null && !(body instanceof ArrayBuffer && body.byteLength === 0);

//   if (contentType && hasBody && req.method !== 'DELETE') {
//     headers['Content-Type'] = contentType;
//   }

//   if (accessToken) {
//     headers['Authorization'] = `Bearer ${accessToken}`;
//   }

//   return headers;
// };

// /**
//  * Фильтрует заголовки для отправки на фронт
//  */
// const filterBackendHeaders = (backendHeaders: Headers): Record<string, string> => {
//   const headers: Record<string, string> = {};

//   const pick = (name: string): void => {
//     const value = backendHeaders.get(name);
//     if (value) headers[name] = value;
//   };

//   pick('content-type');

//   pick('content-disposition');
//   pick('accept-ranges');
//   pick('content-range');

//   return headers;
// };

// /**
//  * Основная функция проксирования запросов
//  */
// export const route = async (req: NextRequest, path: string[]): Promise<NextResponse> => {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get('access')?.value;
//   const refreshToken = cookieStore.get('refresh')?.value;

//   const targetUrl = `${BACKEND}/${path.join('/')}/${req.nextUrl.search}`;
//   const makeBackendRequest = async (token?: string, body?: BodyInit | null): Promise<Response> => {
//     const headers = prepareRequestHeaders(req, token, body);

//     return fetch(targetUrl, {
//       method: req.method,
//       headers,
//       body: body ?? null,
//     });
//   };

//   try {
//     const requestBody = await prepareRequestBody(req);

//     let backendResponse = await makeBackendRequest(accessToken, requestBody);

//     if (backendResponse.status === 401 && refreshToken) {
//       try {
//         const newTokens = await doRefresh(refreshToken);

//         backendResponse = await makeBackendRequest(newTokens.access, requestBody);

//         const responseData = await backendResponse.text();
//         const response = new NextResponse(responseData, {
//           status: backendResponse.status,
//           headers: filterBackendHeaders(backendResponse.headers),
//         });

//         return setAuthCookies(response, newTokens);
//       } catch (refreshError) {
//         console.error('Token refresh failed:', refreshError);

//         const errorResponse = NextResponse.json(
//           { error: 'Authentication required. Please log in again.' },
//           { status: 401 },
//         );
//         return clearAuthCookies(errorResponse);
//       }
//     }

//     const status = backendResponse.status;
//     const headers = filterBackendHeaders(backendResponse.headers);

//     if (status === 204 || status === 205 || status === 304) {
//       return new NextResponse(null, { status, headers });
//     }

//     const responseData = await backendResponse.text();

//     let response = new NextResponse(responseData, {
//       status,
//       headers,
//     });

//     if (status === 401) {
//       response = clearAuthCookies(response);
//     }

//     return response;
//   } catch (error) {
//     console.error('Proxy route error:', error);

//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// };

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies, setAuthCookies } from './auth';
import { doRefresh } from './refresh';

const BACKEND = process.env.BACKEND_API_URL!;

// Пути, которые не требуют авторизации
const PUBLIC_AUTH_PATHS = [
  '/api/v1/auth/providers/plusofon/flash-call/start/',
  '/api/v1/auth/providers/plusofon/flash-call/status/',
  '/api/v1/auth/providers/plusofon/flash-call/claim/',
];

const isPublicAuthPath = (path: string[]): boolean => {
  const fullPath = '/' + path.join('/');
  return PUBLIC_AUTH_PATHS.some((publicPath) => fullPath.startsWith(publicPath));
};

const prepareRequestBody = async (req: NextRequest): Promise<ArrayBuffer | null> => {
  if (req.method === 'GET' || req.method === 'HEAD') return null;
  return await req.arrayBuffer();
};

const prepareRequestHeaders = (
  req: NextRequest,
  accessToken?: string,
  body?: BodyInit | null,
): Record<string, string> => {
  const headers: Record<string, string> = {};

  const contentType = req.headers.get('content-type');
  const hasBody = body != null && !(body instanceof ArrayBuffer && body.byteLength === 0);

  if (contentType && hasBody && req.method !== 'DELETE') {
    headers['Content-Type'] = contentType;
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
};

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

export const route = async (req: NextRequest, path: string[]): Promise<NextResponse> => {
  const cookieStore = await cookies();
  const isPublic = isPublicAuthPath(path);

  // Для публичных auth-эндпоинтов не используем токены
  const accessToken = !isPublic ? cookieStore.get('access')?.value : undefined;
  const refreshToken = !isPublic ? cookieStore.get('refresh')?.value : undefined;

  let targetUrl = `${BACKEND}/${path.join('/')}/${req.nextUrl.search}`;
  // Проверяем, заканчивается ли URL на .расширение файла/
  if (/\.\w{2,4}\/$/i.test(targetUrl)) {
    targetUrl = targetUrl.slice(0, -1);
  }
  const makeBackendRequest = async (token?: string, body?: BodyInit | null): Promise<Response> => {
    const headers = prepareRequestHeaders(req, token, body);
    return fetch(targetUrl, {
      method: req.method,
      headers,
      body: body ?? null,
    });
  };

  try {
    const requestBody = await prepareRequestBody(req);
    let backendResponse = await makeBackendRequest(accessToken, requestBody);

    // Пропускаем refresh-логику для публичных auth-эндпоинтов
    if (!isPublic && backendResponse.status === 401 && refreshToken) {
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

    const status = backendResponse.status;
    const headers = filterBackendHeaders(backendResponse.headers);

    if (status === 204 || status === 205 || status === 304) {
      return new NextResponse(null, { status, headers });
    }

    const responseData = await backendResponse.text();
    let response = new NextResponse(responseData, { status, headers });

    if (!isPublic && status === 401) {
      response = clearAuthCookies(response);
    }

    return response;
  } catch (error) {
    console.error('Proxy route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
