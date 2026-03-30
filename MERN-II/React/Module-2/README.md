# MERN-II · Module 2 — Live Search with Custom Hooks

> **Stack:** React 19 · Vite 6 · TypeScript 5 (Strict) · Zustand 5 · TanStack Query 5  
> **Builds on:** Module 1 (ProductCard, ProductList, CategoryFilter, useCart)  
> **Curriculum:** MERN-II (14 Mar – 31 Mar 2026)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server  (http://localhost:5173)
npm run dev

# 3. Type-check without emitting
npx tsc --noEmit

# 4. Lint  (ESLint v9 flat config)
npm run lint

# 5. Format
npm run format
```

---

## Project Structure

```
src/
├── components/
│   ├── AppHeader/        # Header — reads cartStore + wishlistStore directly
│   ├── CategoryFilter/   # Controlled pill radiogroup + native <select>
│   ├── ProductCard/      # Card + StarRating + WishlistButton; useMutation for cart
│   ├── ProductList/      # useQuery with skeleton / error / empty states
│   ├── SearchBar/        # Controlled input + useRef auto-focus + clear button
│   ├── SortControl/      # Controlled <select>; SortOption type from @/types
│   └── WishlistButton/   # Reads/writes wishlistStore; SVG heart toggle
├── hooks/
│   ├── useCart.ts        # (Module 1 local hook — superseded by cartStore)
│   ├── useDebounce.ts    # Generic <T> debounce, useEffect + clearTimeout
│   └── useFetch.ts       # Manual fetch hook — AbortController, 3-state model
├── lib/
│   ├── api.ts            # fetchProducts, addToCartApi, removeFromCartApi
│   └── queryClient.ts    # Shared QueryClient (staleTime, gcTime, retry)
├── stores/
│   ├── cartStore.ts      # Zustand — addItem/removeItem/updateQty/clearCart
│   └── wishlistStore.ts  # Zustand + persist middleware → localStorage
├── styles/
│   └── index.css         # Full design system (CSS custom properties)
├── types/
│   └── index.ts          # Product, CartItem, WishlistItem, SortOption, ApiResponse<T>
├── data/
│   └── products.ts       # Category constants (products now served from /api/products.json)
├── App.tsx               # Root — all UI state, filterFn memoisation, cart drawer stub
└── main.tsx              # React 19 createRoot (guarded) + QueryClientProvider
public/
└── api/
    └── products.json     # Mock REST endpoint served by Vite at GET /api/products.json
```

---

## Component & Hook API

### `useDebounce<T>(value, delay?)`
```ts
const debouncedQuery = useDebounce(query, 400);
```
Returns a value that only updates after `delay` ms of silence. Uses `useEffect` with `clearTimeout` cleanup so the timer resets on every keystroke.

### `useFetch<T>(url)`
```ts
const { data, isLoading, isError, error } = useFetch<Product[]>("/api/products.json");
// Pass null to conditionally skip:
const { data } = useFetch<User>(id ? `/api/users/${id}` : null);
```
Manual fetch hook — built to teach `AbortController` and the async-in-useEffect pattern before upgrading to TanStack Query. See `src/hooks/useFetch.ts` for the full explanation.

### `useCartStore` (Zustand)
```ts
const addItem    = useCartStore(s => s.addItem);
const totalPrice = useCartStore(s => s.totalPrice());
const isInCart   = useCartStore(s => s.isInCart(id));
```
| Action | Signature |
|---|---|
| `addItem` | `(product: Product) => void` — increments qty if already present |
| `removeItem` | `(id: string) => void` |
| `updateQty` | `(id: string, qty: number) => void` — removes if qty ≤ 0 |
| `clearCart` | `() => void` |
| `totalItems` | `() => number` — sum of all quantities |
| `totalPrice` | `() => number` — sum of price × qty |
| `isInCart` | `(id: string) => boolean` |

### `useWishlistStore` (Zustand + persist)
```ts
const toggle      = useWishlistStore(s => s.toggle);
const isWishlisted = useWishlistStore(s => s.isWishlisted(id));
```
Persists to `localStorage` under key `"wishlist-storage"` via `zustand/middleware`.

### `SortOption` (type)
Defined in `@/types` — the single source of truth shared by `App` state, `SortControl` options, and the `filterFn` switch. Values: `"featured" | "price-asc" | "price-desc" | "rating-desc" | "reviews-desc" | "name-asc"`.

---

## Key Architecture Decisions

### useFetch vs TanStack Query
Both exist intentionally. `useFetch` is the "manual" version built to teach `AbortController` and the async-in-`useEffect` pattern. `useQuery` (TanStack) adds deduplication, caching, background refetching, devtools, and retry on top. After Module 2, `useQuery` is used exclusively for server state; `useFetch` is available for one-off fetches without caching needs.

### filterFn pattern
`App` memoises a filter function (not a filtered array) and passes it to `ProductList` as a prop. `ProductList` then calls it on the data it already fetched via its own `useQuery`. This pattern avoids prop-drilling the entire product array down from `App` while still keeping filter/sort logic centralised.

### ApiResponse<T> — discriminated union
```ts
// In @/types:
type ApiResponse<T> =
  | { success: true;  data: T;    message?: string }
  | { success: false; error: string; message?: string };

// Safe narrowing at the call site:
const res = await addToCartApi(id);
if (res.success) {
  console.log(res.data);   // T — only accessible on the success branch
} else {
  console.error(res.error); // string — only accessible on the error branch
}
```

---

## Fixes Applied (vs. Original Submission)

| # | File | Issue | Fix |
|---|---|---|---|
| 1 | `App.tsx` | `import type { SortOrder } from "@/components/SortControl"` — `SortOrder` was never exported → TS compile error | Removed; `SortOption` now imported from `@/types` |
| 2 | `types/index.ts` | `SortOption` used in `SortControl` but never defined anywhere → TS compile error | Added `SortOption` union type as single source of truth |
| 3 | `App.tsx` | Initial sort state `"Featured"` (capital F) didn't match any `<option>` value `"featured"` → blank select on load | Changed default to `"featured"` |
| 4 | `App.tsx` | `case "reviews-desc"` missing from `filterFn` switch → selecting "Most Reviewed" silently did nothing | Added `case "reviews-desc": result.sort((a,b) => b.reviewCount - a.reviewCount)` |
| 5 | `SortControl` | `"name-asc"` option missing from `SORT_OPTIONS` array → App's switch case was dead code | Added `{ value: "name-asc", label: "Name: A → Z" }` |
| 6 | `App.tsx` | `isCartOpen` set to `true` but no close handler and no drawer rendered → cart button did nothing visible | Added `handleCartClose`, cart drawer overlay stub with close button |
| 7 | `StarRating.tsx` | `⯨` (U+2BE8) renders as □ on Windows/Android/Linux | CSS overlay technique: grey `☆` base + gold `★` clipped to 55% |
| 8 | `CategoryFilter` | `role="group"` wrapping `role="radio"` pills — invalid ARIA | Changed to `role="radiogroup"` |
| 9 | `main.tsx` | `getElementById("root")!` unsafe non-null assertion — cryptic crash if element missing | Replaced with guarded `if (!rootElement) throw new Error(...)` |
| 10 | `package.json` | `--ext ts,tsx` — removed flag in ESLint v9 flat config | Removed the flag |
| 11 | `index.html` | Generic title `"Module-2"` | `"MERNShop — Module 2 · Live Search with Custom Hooks"` |
| 12 | `types/index.ts` | `ApiResponse<T>` used `success: boolean` with `data: T` always present — not type-safe on error | Converted to discriminated union `{ success: true; data: T } \| { success: false; error: string }` |
| 13 | `useFetch.ts` | Built but unused — PDF requires it to be demonstrated | Added comprehensive curriculum documentation explaining useFetch vs useQuery pedagogical intent |

---

## Verification Checklist

Open `http://localhost:5173` and verify:

### Search & Debounce
- [ ] Type fast in search → results update after a 400 ms pause, not on every keystroke
- [ ] React DevTools → watch `query` (updates instantly) vs `debouncedQuery` (updates 400 ms later)
- [ ] Clear button (✕) appears while typing; clicking it clears input and refocuses

### Sort
- [ ] On page load the sort `<select>` shows "Featured" (default) — not blank
- [ ] Price: Low → High sorts cards ascending by price
- [ ] Price: High → Low sorts cards descending
- [ ] Top Rated sorts by rating descending
- [ ] Most Reviewed sorts by reviewCount descending
- [ ] Name: A → Z sorts alphabetically

### useFetch vs useQuery
- [ ] Network tab → only ONE `GET /api/products.json` fires on load (TanStack deduplicates)
- [ ] Hard refresh → skeleton cards appear briefly before products load
- [ ] Rename `public/api/products.json` temporarily → red error banner appears

### useRef auto-focus
- [ ] Refresh → cursor is already in search input (no click needed)
- [ ] React DevTools → SearchBar has no `focus` state — it uses a DOM ref

### Wishlist
- [ ] Click ♡ on a card → heart fills, counter appears in header
- [ ] Refresh page → wishlist persists (stored in localStorage under `"wishlist-storage"`)

### Cart
- [ ] Click 🛒 in header → cart overlay opens
- [ ] Click ✕ or outside → overlay closes
- [ ] Add to Cart on a card → header cart count increments

### Half-star rendering
- [ ] Products with `.5` ratings (e.g. 4.5) show a correctly rendered half-gold star — not □

### TypeScript
```bash
npx tsc --noEmit
# Expected: nothing (zero errors, zero warnings)
```

---

## What's Next — Module 3

Module 3 replaces the cart drawer stub with a full `CartDrawer` Sheet component backed by:
- Zustand `cartStore` (already built in this module)
- TanStack `useMutation` for mock POST `/cart` with optimistic updates
- Zustand `persist` middleware for the wishlist (already wired)
- `QueryClient` cache invalidation via `revalidatePath` pattern
