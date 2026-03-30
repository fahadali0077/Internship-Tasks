import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CART_COOKIE } from "@/lib/session";

/**
 * middleware.ts — runs on the Edge before every matched request.
 *
 * PROTECTED ROUTES:
 *   /cart  → requires the mern_cart session cookie (set by loginAction)
 *
 * MENTAL MODEL — why middleware over a layout check:
 *   A layout.tsx auth check runs AFTER the page starts rendering.
 *   Middleware runs on the Edge BEFORE any HTML is sent to the browser —
 *   so the redirect is instant and the user never sees protected content.
 *
 * CRITICAL: `config` MUST be exported (`export const config`).
 *   Without the `export` keyword, Next.js never reads the matcher and
 *   runs middleware on EVERY request — including _next/static, images,
 *   and API routes — causing serious performance degradation.
 *
 * MERN-IV upgrade:
 *   Replace cookie check with: await getToken({ req: request })
 *   from next-auth/jwt, then check token?.role for role-based access.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Protect /cart ──────────────────────────────────────────────────────────
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

// IMPORTANT: `export const` — not just `const`.
// Without export, Next.js ignores this config and the matcher has no effect.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
