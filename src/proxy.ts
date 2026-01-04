import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { clearAuthCookies, setAuthCookies } from './shared/api/session/auth';
import { doRefresh } from './shared/api/session/refresh';

export default async function proxy(req: NextRequest): Promise<NextResponse> {
  try {
    const path = req.nextUrl.pathname;
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get('access')?.value;
    const refreshToken = cookiesStore.get('refresh')?.value;

    if (path === '/register' && accessToken) {
      return NextResponse.redirect(new URL('/contacts', req.url));
    }

    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      try {
        const tokens = await doRefresh(refreshToken);

        let response: NextResponse;
        if (path === '/register') {
          response = NextResponse.redirect(new URL('/contacts', req.url));
        } else {
          response = NextResponse.next();
        }

        setAuthCookies(response, tokens);

        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'REFRESH_TOKEN_INVALID') {
          const res = NextResponse.redirect(new URL('/register', req.url));
          clearAuthCookies(res);
          return res;
        }

        console.error('Refresh error:', error);
        return NextResponse.next();
      }
    }

    if (path === '/register') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/register', req.url));
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|images/).*)'],
};
