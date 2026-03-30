# MERN-II · Module 4 — Next.js 15 App Shell

> **Stack:** Next.js 15 · React 19 · TypeScript 5 (Strict) · Tailwind CSS · Shadcn/ui · Zustand  
> **Pattern:** App Router · Server Components · Suspense Streaming · next/font

---

## Quick Start

```bash
npm install
npm run dev         # → http://localhost:3000
npm run type-check  # zero errors expected
```

---

## Route Map

```
app/
├── layout.tsx              ← Root layout: Navbar + Footer + CartDrawer
├── page.tsx                ← / (Home — async Server Component)
├── not-found.tsx           ← 404 page (notFound() trigger)
├── error.tsx               ← Error boundary (Client Component)
│
├── (shop)/                 ← Route group — no URL segment
│   ├── products/
│   │   ├── page.tsx        ← /products (Suspense + ProductGrid)
│   │   ├── loading.tsx     ← /products skeleton (auto Suspense)
│   │   └── [id]/
│   │       ├── page.tsx    ← /products/[id] (SSG + generateMetadata)
│   │       └── loading.tsx ← /products/[id] skeleton
│   └── cart/
│       └── page.tsx        ← /cart (Client Component — Zustand)
│

```

---



## App Router Mental Models

### 1. Server vs Client Components

| Need | Type |
|---|---|
| `fetch()` data | Server Component ✅ |
| `useState` / `useEffect` | Client Component (`'use client'`) |
| `onClick` / `onChange` | Client Component |
| `useRouter` / `usePathname` | Client Component |
| Zustand store | Client Component |
| Static markup | Server Component ✅ |

### 2. Composition Pattern — narrow client boundaries

```
Navbar (Server Component)          ← no JS shipped
  └── NavLinks ('use client')      ← needs usePathname()
  └── CartButton ('use client')    ← needs Zustand cartStore
```

### 3. Suspense Streaming

```tsx
// loading.tsx fires instantly → skeletons appear
// page.tsx async resolves → React swaps in real content
<Suspense fallback={<ProductGridSkeleton />}>
  <ProductGrid />   {/* async Server Component */}
</Suspense>
```

### 4. Static Site Generation (SSG)

```tsx
// generateStaticParams() runs at BUILD TIME
export async function generateStaticParams() {
  const ids = await fetchProductIds();
  return ids.map((id) => ({ id }));
  // → /products/p-001 … /products/p-012 pre-rendered as static HTML
}
```

### 5. next/font — zero layout shift

```ts
// lib/fonts.ts
import { DM_Sans, DM_Serif_Display } from "next/font/google";
// Fonts downloaded at build time, served from same origin.
// Never causes a Google Fonts CDN request at runtime.
```

---

## Verification Checklist

### Routes
- [ ] `/` — Home page loads with product count stat
- [ ] `/products` — All 12 products with skeleton on first load
- [ ] `/products/p-001` — Sony headphones detail, breadcrumb, price
- [ ] `/products/fake-id` — 404 page renders

meter
- [ ] `/cart` — Empty state or cart items with qty stepper
- [ ] `/anything-random` — 404 page

### Server Components
- [ ] DevTools → Network → JS tab → no bundle for ProductGrid
- [ ] View Source → product names in raw HTML (server-rendered)

### Streaming
- [ ] Throttle to Slow 3G → /products → skeletons appear, then grid loads

### SSG
```bash
npm run build
# Look for: ○ /products/[id] (12 pages prerendered)
```

### TypeScript
```bash
npm run type-check  # must print nothing
```


---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 |
| Components | Shadcn/ui (Button, Badge, Card, Skeleton) |
| State | Zustand 5 (cart store) |
| Fonts | next/font (DM Sans + DM Serif Display) |
| Forms | Controlled inputs + useState (→ RHF + Zod in Module 5) |
