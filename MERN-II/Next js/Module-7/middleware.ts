import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CART_COOKIE } from "@/lib/session";


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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
