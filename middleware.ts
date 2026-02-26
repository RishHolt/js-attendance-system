import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is an admin route
  if (pathname.startsWith('/admin')) {
    // Check for authentication token in cookies
    const token = request.cookies.get('auth_token');
    
    // If no token, redirect to login page
    if (!token) {
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already logged in and tries to access login page, redirect to admin dashboard
  if (pathname === '/' && request.cookies.get('auth_token')) {
    const dashboardUrl = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/'
  ],
};
