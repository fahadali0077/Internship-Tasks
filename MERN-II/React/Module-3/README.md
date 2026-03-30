# MERN-II · Module 3 — Cart & Wishlist State

> **Stack:** React 19 · Vite 6 · TypeScript 5 (Strict) · Zustand 5 · TanStack Query 5  
> **Builds on:** Module 2 (SearchBar, SortControl, useDebounce, useFetch)  
> **Curriculum:** MERN-II (14 Mar – 31 Mar 2026)

---

## Quick Start

```bash
npm install && npm run dev   # http://localhost:5173
npx tsc --noEmit             # zero errors expected
npm run lint                 # zero warnings expected
```

---

## Project Structure

```
src/
├── components/
│   ├── AppHeader/        # Reads cartStore.totalItems() directly
│   ├── CartDrawer/       # Zustand-driven slide-in drawer (role=dialog, Escape key)
│   ├── CategoryFilter/   # Controlled pill radiogroup + native <select>
│   ├── ProductCard/      # StarRating + WishlistButton; passes full Product to handler
│   ├── ProductList/      # Skeleton / error / empty states; receives filterFn products
│   ├── SearchBar/        # useRef auto-focus; live result count
│   ├── SortControl/      # All 6 SortOption values; synced with SORT_FNS in App
│   └── WishlistButton/   # Reads/writes wishlistStore; heart SVG toggle
├── hooks/
│   ├── useDebounce.ts    # Generic <T>, useEffect + clearTimeout
│   └── useProducts.ts    # useProducts() + useAddToCartMutation() with optimistic update
├── lib/
│   └── queryClient.ts    # Shared QueryClient (staleTime, gcTime, retry config)
├── stores/
│   ├── cartStore.ts      # Zustand — items, isOpen, addItem/removeItem/updateQty/clearCart
│   └── wishlistStore.ts  # Zustand + persist → localStorage (key: mern-ii-wishlist)
├── styles/
│   └── index.css         # Full design system (CSS custom properties)
├── types/
│   └── index.ts          # Product, CartItem, SortOption, RegisterFormData, ApiResponse<T>
├── data/
│   └── products.ts       # Category constants
├── App.tsx               # Root — SORT_FNS record, filter/sort, handleToggleCart
└── main.tsx              # createRoot (guarded) + QueryClientProvider
public/
└── api/products.json     # Mock REST endpoint at GET /api/products.json
```

---

## Key Architecture

### CartStore shape (Module 3 upgrade)
```ts
interface CartState {
  items: CartItem[];          // CartItem = { product: Product; qty: number }
  isOpen: boolean;
  addItem(product, qty?): void
  removeItem(productId): void
  updateQty(productId, qty): void   // removeItem if qty ≤ 0
  clearCart(): void
  openDrawer(): void
  closeDrawer(): void
  toggleDrawer(): void
  totalItems(): number              // sum of all qty values
  totalPrice(): number              // sum of price × qty
}
```

### Optimistic cart update pattern
```
handleToggleCart(product)
  ├─ isInCart?  → removeItem(id)             [instant Zustand update]
  └─ not in cart:
       ├─ addItem(product, 1)                [1. instant optimistic update]
       ├─ addToCartMutation.mutate(item)     [2. background server sync]
       │    ├─ onMutate  → update TQ cache  [optimistic cache patch]
       │    ├─ onError   → rollback cache   [revert on failure]
       │    └─ onSettled → invalidate cart  [always refetch to sync]
       └─ openDrawer()                       [3. confirm addition visually]
```

### SORT_FNS — exhaustive record pattern
```ts
// Record<SortOption, ...> forces a TS error if any SortOption is missing.
// No silent gaps — adding a new SortOption requires updating this object.
const SORT_FNS: Record<SortOption, (a: Product, b: Product) => number> = {
  featured:      (a, b) => a.id.localeCompare(b.id),
  "price-asc":   (a, b) => a.price - b.price,
  "price-desc":  (a, b) => b.price - a.price,
  "rating-desc": (a, b) => b.rating - a.rating,
  "reviews-desc":(a, b) => b.reviewCount - a.reviewCount,
  "name-asc":    (a, b) => a.name.localeCompare(b.name),
};
```

---

## Fixes Applied (vs. Original Submission)

| # | File | Issue | Fix |
|---|---|---|---|
| 1 | `CartDrawer` | `"use client"` directive — Next.js App Router only, meaningless and misleading in a Vite SPA | Removed entirely |
| 2 | `AppHeader` | `</header >` — JSX whitespace syntax error (space before `>`) | Fixed to `</header>` |
| 3 | `types/index.ts` | `ApiResponse<T>` used `success: boolean` with `data` always present — not type-safe on error | Converted to discriminated union `{ success: true; data: T } \| { success: false; error: string }` |
| 4 | `types/index.ts` | `SortOption` missing `"name-asc"` — SORT_FNS had no matching key, select had no option | Added `"name-asc"` to union; added comparator to SORT_FNS; added option to SortControl |
| 5 | `package.json` | `@types/node` missing — `vite.config.ts` uses `__dirname` which requires it | Added `"@types/node": "^22.5.4"` to devDependencies |
| 6 | `App.tsx` | `view` / `setView` state declared but never read or called — dead code | Removed `type View`, `useState<View>`, dead import cleanup |
| 7 | `App.tsx` | `handleToggleCart` not wrapped in `useCallback` — recreated on every render | Wrapped with `useCallback` and correct dependency array |
| 8 | `App.tsx` | Redundant `<>...</>` fragment wrapper inside `<main>` — only one child, no key needed | Removed the fragment |
| 9 | `CartDrawer` | `<aside>` missing `role="dialog"` and `aria-modal="true"` — screen readers won't announce it as a modal | Added both attributes |
| 10 | `CartDrawer` | Badge showed `items.length` (distinct product count) but header badge shows `totalItems()` (qty sum) — diverged when any item qty > 1 | Badge now uses `totalItems()` to match header exactly |
| 11 | `CartDrawer` | No Escape key handler — standard modal keyboard contract violated | Added `useEffect` + `document.addEventListener("keydown")` with cleanup |
| 12 | `CartDrawer` | Checkout button had no `disabled`, no `aria-label`, no handler — invisible broken state | Added `disabled`, descriptive `aria-label`, `title` tooltip, disabled CSS |
| 13 | `StarRating.tsx` | `⯨` (U+2BE8) renders as □ on Windows/Android/Linux | CSS overlay: grey `☆` base + gold `★` clipped to 55% |
| 14 | `CategoryFilter` | `role="group"` wrapping `role="radio"` pills — invalid ARIA tree | Changed to `role="radiogroup"` |
| 15 | `package.json` | `--ext ts,tsx` — ESLint v9 flat config removed this flag | Removed the flag |
| 16 | `index.html` | Generic title `"Module-3"` | `"MERNShop — Module 3 · Cart & Wishlist State"` |

---

## Verification Checklist

### Cart flow
- [ ] Click **+ Add to Cart** on a product → drawer opens, item appears with qty 1
- [ ] Click **+** in drawer → qty increments; header badge and drawer badge both update to the same number
- [ ] Click **−** until qty = 0 → item is removed entirely
- [ ] Click **✕** on a row → item removed
- [ ] Click **Clear cart** → all items gone
- [ ] **Escape key** → drawer closes
- [ ] **Backdrop click** → drawer closes
- [ ] **Checkout button** → visually disabled (grey), title tooltip explains it's Module 6

### Wishlist
- [ ] Click ♡ on a card → fills to ♥; wishlist count appears in header
- [ ] Refresh page → wishlist items persist (localStorage key: `mern-ii-wishlist`)
- [ ] Click ♥ again → removes from wishlist

### Sort
- [ ] All 6 options present: Featured, Price Low→High, Price High→Low, Top Rated, Most Reviewed, Name A→Z
- [ ] Each option reorders the grid correctly

### Optimistic update + rollback
- [ ] Network tab → `POST` to mock API fires ~300ms after Add to Cart
- [ ] To test rollback: temporarily lower the random-failure threshold in `useProducts.ts` from 0.1 to 0.9 → item should disappear from cart on failure

### TypeScript
```bash
npx tsc --noEmit   # Expected: nothing (zero errors)
```

---

## What's Next — Module 3.5 & 4

**Module 3.5** builds the Register form:
- React Hook Form + Zod schema validation
- `RegisterFormData` type (already defined in `@/types`)
- Controlled inputs with inline error messages
- Uncontrolled file upload with `useRef`

**Module 4** migrates this entire project into Next.js 15 App Router:
- `app/` directory structure with Server Components
- `CartDrawer` becomes a Client Component (`"use client"` is correct there)
- `cartStore` and `wishlistStore` move to client-component boundary
- Mock `/api/products.json` replaced by a proper Route Handler
