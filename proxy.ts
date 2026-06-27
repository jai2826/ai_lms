import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes';

export default async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("better-auth.session_token")?.value || 
                        request.cookies.get("__Secure-better-auth.session_token")?.value;
  
  let isLoggedIn = false;
  if (sessionCookie) {
    try {
      const res = await fetch(new URL('/api/auth/get-session', request.url), {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });
      if (res.ok) {
        const session = await res.json();
        isLoggedIn = !!session;
      }
    } catch (e) {
      console.error("Middleware session verification failed:", e);
    }
  }
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || 
                        nextUrl.pathname.startsWith('/api/uploadthing') || 
                        nextUrl.pathname.startsWith('/api/webhook');
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/sign-in', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};