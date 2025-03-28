import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/logout'];

// Export the middleware function as default
export default function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('adminToken')?.value;
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isApiRoute = path.startsWith('/api');

  // Debug logging
  console.log('Middleware:', {
    path,
    hasToken: !!token,
    isPublicRoute,
    isApiRoute,
    method: request.method
  });

  // If accessing login page while authenticated, redirect to dashboard
  if (path === '/login' && token) {
    console.log('Redirecting to dashboard - already authenticated');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If accessing protected route without authentication, redirect to login
  if (!isPublicRoute && !isApiRoute && !token) {
    console.log('Redirecting to login - no token');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  console.log('Allowing request to proceed');
  return NextResponse.next();
}

// Configure middleware to run on all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};