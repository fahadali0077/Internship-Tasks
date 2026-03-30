# MERN-II · Module 6 — API Routes + Server Actions + Middleware

> **Stack:** Next.js 15 · Server Actions · Route Handlers · Middleware · HttpOnly Cookies

## Quick Start

```bash
npm install
npm run dev    # http://localhost:3000
npm run type-check
```

## Requirements → Implementation

| Requirement | File |
|---|---|
| GET /api/products | `app/api/products/route.ts` |
| GET /api/products/[id] | `app/api/products/[id]/route.ts` |
| Server Action: addToCart | `app/actions/cart.ts` → addToCart() |
| Server Action: removeFromCart + revalidatePath | `app/actions/cart.ts` → removeFromCart() |
| Middleware: redirect /cart if no session | `middleware.ts` |
| Cart page reads from cookie session (Server Component) | `app/(shop)/cart/page.tsx` |

## Mental Models

### API Routes vs Server Actions

```
API Routes (app/api/...route.ts)       Server Actions ('use server')
──────────────────────────────         ──────────────────────────────
For external clients                   For internal Next.js usage
(mobile apps, third-party)             (Client Component → server)
Called via fetch()                     Called like a function
Returns NextResponse                   Returns any serialisable value
Needs auth middleware                  Runs in server context directly
```

### Server Action Flow

```
User clicks "Add to Cart" (Client Component)
  ↓
startTransition(async () => { await addToCart("p-001", 1) })
  ↓ React serialises arguments → POST to Next.js
  ↓
addToCart() runs on SERVER:
  1. fetchProductById("p-001")     ← data layer
  2. getSessionCart()               ← read cookie
  3. addItemToCart(cart, product)   ← pure function
  4. setSessionCart(updated)        ← write cookie
  5. revalidatePath('/cart')        ← bust cache
  ↓ returns ActionResult
  ↓
Next.js re-renders /cart Server Component with fresh cookie data
  ↓
Browser receives new HTML — no useState, no fetch, no TanStack Query
```

### Middleware Protection

```
Browser requests /cart
  ↓
middleware.ts runs on EDGE (before page)
  ↓
request.cookies.get("mern_cart")
  ├─ cookie exists → NextResponse.next() → CartPage renders
  └─ no cookie    → NextResponse.redirect("/auth/login?from=/cart")
```

### revalidatePath() — Why It Matters

```
Without revalidatePath:
  Cart cookie updated → page cache stale → user sees OLD cart

With revalidatePath('/cart'):
  Cart cookie updated → Next.js purges /cart cache
  → next visit re-renders Server Component from fresh cookie
```

### Cookie vs Zustand

| Concern | Zustand (Modules 3–5) | Cookie Session (Module 6) |
|---|---|---|
| Persists refresh? | ❌ Lost on refresh | ✅ 7-day cookie |
| Server readable? | ❌ Client-only | ✅ Server + middleware |
| Real-time UI? | ✅ Instant | ⚠️ After revalidation |
| Source of truth | Browser memory | Server cookie |

Module 6 uses **both**: Zustand for instant drawer feedback, cookie for persistent /cart page.

## Testing the API Routes

```bash
# All products
curl http://localhost:3000/api/products

# Filtered + sorted
curl "http://localhost:3000/api/products?category=Electronics&sort=price-asc"

# Single product
curl http://localhost:3000/api/products/p-001

# Not found
curl http://localhost:3000/api/products/fake-id   # → 404
```

## Verification Checklist

- [ ] `GET /api/products` → JSON with `{ success, data, count }`
- [ ] `GET /api/products?category=Books` → only 2 books returned
- [ ] `GET /api/products/p-001` → Sony headphones JSON
- [ ] `GET /api/products/fake-id` → `{ success: false, error: "..." }` 404
- [ ] Visit `/cart` with no items added → redirected to `/auth/login?from=/cart`
- [ ] Add any product → CartDrawer opens (Zustand, instant)
- [ ] Navigate to `/cart` directly → page renders with cookie-session items
- [ ] **Refresh the page on /cart** → items STILL THERE (cookie persists)
- [ ] Click qty stepper → qty updates without full page reload (useTransition)
- [ ] Click remove → item disappears, summary updates (revalidatePath)
- [ ] Clear cart → page shows empty state, /cart now redirects to /login
- [ ] Open DevTools → Application → Cookies → confirm `mern_cart` cookie exists
- [ ] Confirm `mern_cart` is HttpOnly (checkbox ticked in DevTools)
- [ ] `npm run type-check` → no output
