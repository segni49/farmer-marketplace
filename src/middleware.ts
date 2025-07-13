import { auth } from "./lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require auth
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/about"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const session = await auth();

  // Allow public routes without auth
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!session) {
    const redirectUrl = new URL("/login", origin);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based access control
  const role = session.user?.role;

  const roleRules: Record<string, string[]> = {
    admin: ["/admin"],
    farmer: ["/farmer"],
    buyer: ["/buyer"]
  };

  for (const [expectedRole, paths] of Object.entries(roleRules)) {
    for (const protectedPath of paths) {
      if (pathname.startsWith(protectedPath)) {
        if (role !== expectedRole) {
          return NextResponse.redirect(new URL("/unauthorized", origin));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protect everything except public routes and static assets
     */
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};