import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ACCESS_TOKEN_KEY = 'ez_split_access_token';

// Public paths that don't require authentication
const publicPaths = ['/auth/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Get the token from the cookies
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  
  // If user is logged in and trying to access a public path
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/expenses', request.url));
  }
  
  // If user is not logged in and trying to access a protected path
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 