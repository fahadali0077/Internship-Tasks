import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CART_COOKIE } from "@/lib/session";


const ADMIN_COOKIE = "admin_session";

// Public admin routes that must NOT be protected (login page itself)
const ADMIN_PUBLIC_PATHS = ["/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Protect /admin/** (except the login page) ───────────────────────────────
  if (
    pathname.startsWith("/admin") &&
    !ADMIN_PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  ) {
    const adminCookie = request.cookies.get(ADMIN_COOKIE);

    if (!adminCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Protect /cart ───────────────────────────────────────────────────────────
  if (pathname === "/cart") {
    const cartCookie = request.cookies.get(CART_COOKIE);
    if (!cartCookie) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", "/cart");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};