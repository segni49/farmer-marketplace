import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
   '/dashboard': ['FARMER','BUYER', 'ADMIN'],
  '/dashboard/orders': ['BUYER', 'FARMER', 'ADMIN'],
  '/admin': ['ADMIN'],
  '/bookings': ['BUYER', 'FARMER', 'ADMIN'],
  '/profile': ['BUYER', 'FARMER', 'ADMIN'],
} as const;

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const userRole = req.nextauth.token?.role;

    // Skip middleware for API routes (they handle their own auth)
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Check if route requires specific role
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!userRole || !allowedRoles.includes(userRole as 'ADMIN')) {
          // Redirect to unauthorized page or home
          return NextResponse.redirect(new URL('/', req.url));
        }
        break;
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Skip authorization for API routes (they handle their own auth)
        if (pathname.startsWith('/api/')) {
          return true;
        }

        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/guides',
          '/explore',
          '/plan',
          '/auth/login',
          '/auth/register',
          '/help',
        ];

        // Check if it's a public route
        const isPublicRoute = publicRoutes.some(route =>
          pathname === route || pathname.startsWith(`${route}/`)
        );

        if (isPublicRoute) {
          return true;
        }

        // For protected routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
