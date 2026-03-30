import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CART_COOKIE } from "@/lib/session";

/**
 * middleware.ts — runs before every matched request.
 *
 * MENTAL MODEL — Next.js Middleware:
 *   Middleware runs on the EDGE (between the user and your server),
 *   before the page renders. This is the earliest interception point.
 *
 *   Compare to React Router's ProtectedRoute (Module 3.6):
 *     ProtectedRoute: CLIENT-SIDE check → brief flash of protected content
 *     Middleware: SERVER-SIDE check → redirect before HTML is ever sent
 *   Middleware is strictly more secure.
 *
 *   In Module 3.6: ProtectedRoute checked Zustand (isAuthenticated)
 *   In Module 6:   Middleware checks the HttpOnly cookie directly
 *   In MERN-IV:    Middleware will check the NextAuth.js session token
 *
 * CART PROTECTION LOGIC:
 *   If a user visits /cart and has NO mern_cart cookie:
 *     → redirect to /auth/login?from=/cart
 *   If they have a cart cookie (even empty cart):
 *     → allow through (they're "authenticated" for cart access)
 *
 *   NOTE: In production you'd check a real auth session token, not just
 *   the cart cookie. The cart cookie check here mimics the spec requirement
 *   and teaches the middleware pattern. NextAuth.js replaces this in MERN-IV.
 *
 * MATCHER CONFIG:
 *   The config.matcher array controls which paths trigger middleware.
 *   We exclude static files, images, and API routes that don't need protection.
 *   Using negative lookahead to skip Next.js internals.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Protect /cart ───────────────────────────────────────────────────────────
  if (pathname === "/cart") {
    const cartCookie = request.cookies.get(CART_COOKIE);

    if (!cartCookie) {
      // No session cookie → redirect to login, preserve return URL
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", "/cart");

      return NextResponse.redirect(loginUrl);
    }
  }

  // All other routes pass through unchanged
  return NextResponse.next();
}

/**
 * Matcher config — which paths trigger middleware.
 *
 * This regex matches everything EXCEPT:
 *   - _next/static  (static assets)
 *   - _next/image   (Next.js image optimization)
 *   - favicon.ico
 *   - public files (*.svg, *.png, etc.)
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
