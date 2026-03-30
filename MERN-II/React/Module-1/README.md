# MERN-II · Module 1 — Product Card UI

> **Stack:** React 19 · Vite 6 · TypeScript 5 (Strict) · Pure CSS Design System  
> **Curriculum:** MERN-II (14 Mar – 31 Mar 2026)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens on http://localhost:5173)
npm run dev

# 3. Type-check without emitting
npx tsc --noEmit

# 4. Lint  (ESLint v9 flat config — no --ext flag needed)
npm run lint

# 5. Format
npm run format
```

---

## Project Structure

```
src/
├── components/
│   ├── AppHeader/       # Sticky header with live cart badge + functional cart button
│   ├── CategoryFilter/  # Controlled <select> + accessible pill radiogroup
│   ├── ProductCard/     # Core card + StarRating sub-component (CSS half-star)
│   └── ProductList/     # .map() renderer with empty-state
├── data/
│   └── products.ts      # 12 mock products + category constants
├── hooks/
│   └── useCart.ts       # Custom hook — encapsulates cart Set state
├── styles/
│   └── index.css        # Full design system (CSS custom properties)
├── types/
│   └── index.ts         # Product, CartItem, CartSet, ApiResponse<T> interfaces
├── App.tsx              # Root — owns filter + cart state + isCartOpen stub
└── main.tsx             # React 19 createRoot entry point (StrictMode)
```

---

## Component API

### `<AppHeader cartCount={n} onCartClick={fn} />`

| Prop | Type | Description |
|---|---|---|
| `cartCount` | `number` | Number of distinct products in cart; shown in badge |
| `onCartClick` | `() => void` | Called when the cart 🛒 button is clicked |

### `<CategoryFilter value={cat} onChange={fn} counts={map} />`

| Prop | Type | Description |
|---|---|---|
| `value` | `CategoryFilter` | Currently selected category (controlled) |
| `onChange` | `(v: CategoryFilter) => void` | Called with new category on selection |
| `counts` | `Record<CategoryFilter, number>` | Product count per category for pill badges |

### `<ProductList products={arr} cartIds={set} onToggleCart={fn} />`

| Prop | Type | Description |
|---|---|---|
| `products` | `Product[]` | Filtered list to render |
| `cartIds` | `ReadonlySet<string>` | Set of product IDs currently in cart |
| `onToggleCart` | `(id: string) => void` | Toggles a product in/out of cart |

### `<ProductCard {...product} inCart={bool} onToggleCart={fn} />`

Spreads all `Product` fields plus:

| Prop | Type | Description |
|---|---|---|
| `inCart` | `boolean` | Whether this product is in the cart |
| `onToggleCart` | `(id: string) => void` | Calls parent toggle with this card's id |

### `useCart()`

```ts
const { cartIds, addItem, removeItem, toggle, isInCart, count } = useCart();
```

| Return | Type | Description |
|---|---|---|
| `cartIds` | `ReadonlySet<string>` | Current set of in-cart product IDs |
| `addItem` | `(id: string) => void` | Add a product ID to the cart |
| `removeItem` | `(id: string) => void` | Remove a product ID from the cart |
| `toggle` | `(id: string) => void` | Add if absent, remove if present |
| `isInCart` | `(id: string) => boolean` | Stable membership check |
| `count` | `number` | Number of distinct products in cart |

---

## Module 1 — Concepts Covered

### 1. Lifting State Up
`selectedCategory`, `isCartOpen`, and `cartIds` all live in `App` — not in their child components. Why? Siblings can't share state directly. The state must live in their **common ancestor**.

```
App (owns: selectedCategory, isCartOpen, cartIds via useCart)
 ├── AppHeader       ← receives cartCount + onCartClick
 ├── CategoryFilter  ← receives value + onChange
 └── ProductList     ← receives filteredProducts + cartIds + onToggleCart
      └── ProductCard × N  ← receives inCart + onToggleCart(id)
```

### 2. Controlled Input
```tsx
// CategoryFilter — React OWNS the value; the DOM reflects it
<select value={selectedCategory} onChange={e => onChange(e.target.value)} />
```

### 3. `.map()` + stable keys
```tsx
products.map((product) => (
  <ProductCard key={product.id} {...product} />
  //           ^^^^^^^^^^^^^^^^
  // NEVER use array index — breaks reconciliation when list reorders
))
```

### 4. `useState` + toggle pattern
```tsx
// useCart.ts — immutable Set update (returns new Set, never mutates in place)
setCartIds(prev => {
  const next = new Set(prev);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
});
```

### 5. Custom Hook
`useCart` extracts all cart logic into a reusable hook. `App` calls `useCart()` and receives `{ cartIds, toggle, count }`. This is the pattern extended by `useFetch` and `useDebounce` in Module 2.

### 6. `useMemo` for derived state
```tsx
const filteredProducts = useMemo(
  () => PRODUCTS.filter(p => p.category === selectedCategory),
  [selectedCategory]   // only recomputes when category changes
);
```

### 7. `useCallback` for stable references
```tsx
// useCart.ts — stable reference means ProductCard won't re-render
// just because App re-renders for an unrelated reason.
const toggle = useCallback((id: string) => { ... }, []);
```

---

## Fixes Applied (vs. Original Submission)

| # | File | Issue | Fix |
|---|---|---|---|
| 1 | `package.json` | `--ext ts,tsx` is an ESLint v8 flag; removed in v9 flat config | Removed the flag |
| 2 | `StarRating.tsx` | `⯨` (U+2BE8) renders as □ on Windows, Android, Linux — near-zero font coverage | CSS overlay technique: grey `☆` base + gold `★` clipped to 55% |
| 3 | `index.html` | Generic title `"Module-1"` | `"MERNShop — Module 1 · Product Card UI"` |
| 4 | `AppHeader` | Cart button had no `onClick` — dead interactive element | Added `onCartClick` prop, wired in `App` |
| 5 | `CategoryFilter` | `role="group"` wrapping `role="radio"` pills — invalid ARIA | Changed to `role="radiogroup"` |
| 6 | `types/index.ts` | `CartItem` and `ApiResponse<T>` missing — needed by Modules 3 & 8 | Added both interfaces |
| 7 | `App.tsx` | No `isCartOpen` state — cart button had nowhere to report to | Added `isCartOpen` + `handleCartClick` + drawer placeholder stub |

---

## Verification Checklist

Open `http://localhost:5173` and verify:

### Feature checks
- [ ] **Filter pills** — click each category; subtitle count updates
- [ ] **Native `<select>`** — visible on mobile (≤640 px); synced with pills
- [ ] **Add to Cart** — button turns green, card border turns green, header badge increments
- [ ] **Remove from Cart** — all of the above reverses
- [ ] **Cart button** — clicking 🛒 opens the cart drawer overlay; ✕ closes it
- [ ] **Empty state** — navigating to a category with 0 products shows the empty-state
- [ ] **Half-star** — products with `.5` ratings show a correctly rendered half-gold star
- [ ] **Responsive** — below 640 px: pills hide, native `<select>` appears; below 400 px: 2-column grid

### React DevTools checks
- [ ] `App` component shows three state entries: `selectedCategory`, `isCartOpen`, and the `cartIds` Set
- [ ] Toggling a card's cart state only re-renders that `ProductCard` — not the whole list (Profiler tab)
- [ ] `onToggleCart` reference in `ProductCard` props is stable across renders (same function reference)

### TypeScript check
```bash
npx tsc --noEmit
# Expected output: nothing (zero errors, zero warnings)
```

---

## What's Next — Module 2

Module 2 adds:
- `useDebounce` hook (400 ms debounce on a search input)
- `useFetch<Product[]>` generic hook replacing the static `PRODUCTS` import
- `useRef` to auto-focus the search input on mount
- `useMemo` for client-side sort + filter of search results

`ProductList` and `ProductCard` are **reused unchanged** — only the data source changes.


> **Stack:** React 19 · Vite 5 · TypeScript 5 (Strict) · Pure CSS Design System  
> **Curriculum:** MERN-II (14 Mar – 31 Mar 2026)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens on http://localhost:5173)
npm run dev

# 3. Type-check without emitting
npx tsc --noEmit

# 4. Lint
npm run lint

# 5. Format
npm run format
```

---

## Project Structure

```
src/
├── components/
│   ├── AppHeader/       # Sticky header with live cart badge
│   ├── CategoryFilter/  # Controlled <select> + pill buttons
│   ├── ProductCard/     # Core card + StarRating sub-component
│   └── ProductList/     # .map() renderer with empty-state
├── data/
│   └── products.ts      # 12 mock products + category constants
├── hooks/
│   └── useCart.ts       # Custom hook — encapsulates cart Set state
├── styles/
│   └── index.css        # Full design system (CSS variables)
├── types/
│   └── index.ts         # Product, CartSet, Category interfaces
├── App.tsx              # Root — owns filter + cart state (lifted up)
└── main.tsx             # React 19 createRoot entry point
```

---

## Module 1 — Concepts Covered

### 1. Lifting State Up
`selectedCategory` and `cartIds` both live in `App` — not in `CategoryFilter`
or `ProductCard`. Why? Two siblings can't share state directly. When the filter
changes, the product list must react. The only way is for their **common ancestor**
to own the state.

```
App (owns: selectedCategory, cartIds)
 ├── CategoryFilter  ← receives value + onChange
 └── ProductList     ← receives filteredProducts + cartIds + onToggleCart
      └── ProductCard × N  ← receives inCart + onToggleCart(id)
```

### 2. Controlled Input
```tsx
// CategoryFilter — React OWNS the value; the DOM reflects it
<select value={selectedCategory} onChange={e => onChange(e.target.value)} />
```

### 3. .map() + stable keys
```tsx
products.map((product) => (
  <ProductCard key={product.id} {...product} />
  //           ^^^^^^^^^^^^^^^^
  // NEVER use array index — it breaks reconciliation when list reorders
))
```

### 4. useState + toggle pattern
```tsx
// useCart.ts — immutable Set update (returns new Set, never mutates)
setCartIds(prev => {
  const next = new Set(prev);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
});
```

### 5. Custom Hook
`useCart` extracts all cart logic into a reusable hook. `App` only calls
`useCart()` and gets `{ cartIds, toggle, count }` back. This is the pattern
Module 2 will extend with `useFetch` and `useDebounce`.

### 6. useMemo for derived state
```tsx
const filteredProducts = useMemo(
  () => PRODUCTS.filter(p => p.category === selectedCategory),
  [selectedCategory]   // only recomputes when category changes
);
```

---

## Step 3 — Verification Checklist ✓

Open `http://localhost:5173` and verify each of the following:

### Browser checks
- [ ] **Filter pills** — click each category pill; product count in subtitle updates
- [ ] **Controlled input** — open DevTools → React DevTools → select `App` component;
  watch `selectedCategory` state update as you click pills
- [ ] **Add to Cart toggle** — click "Add to Cart" on any card:
  - Button turns green with "✓ Remove from Cart"
  - Card border turns green
  - Green overlay appears on image
  - Cart badge in header increments
- [ ] **Remove from Cart** — click the green button; all above reverses
- [ ] **Empty state** — if you had a category with 0 products, the empty-state renders
- [ ] **Responsive** — resize browser below 640px; pills hide, native `<select>` appears

### React DevTools checks
*(Install [React DevTools](https://react.dev/learn/react-developer-tools) browser extension)*

- [ ] Open **Components** tab → find `App` → confirm two pieces of state:
  `selectedCategory: "All"` and the `cartIds` Set
- [ ] Select `ProductCard` for any item → confirm `inCart: false` prop
- [ ] Click "Add to Cart" → watch `inCart` prop flip to `true` WITHOUT re-mounting
  the component (React reused the DOM node — reconciliation working correctly)
- [ ] Open **Profiler** tab → record an interaction → confirm only the affected
  `ProductCard` re-renders when you toggle cart (not the whole list)

### TypeScript checks
```bash
npx tsc --noEmit
# Should print: nothing (zero errors)
```

### Path alias check
All imports use `@/` (e.g. `import { useCart } from "@/hooks/useCart"`).
If Vite can't resolve them, check that `vite.config.ts` has the `resolve.alias`
and `tsconfig.json` has the matching `paths` entry.

---

## What's Next — Module 2

Module 2 adds:
- `useDebounce` custom hook (400ms debounce on search input)
- `useFetch<Product[]>` generic hook replacing raw data imports
- `useRef` to auto-focus the search input on mount
- `useMemo` for client-side sort + filter of search results

The `ProductList` and `ProductCard` components built here are **reused unchanged**
in Module 2 — only the data source changes (from a static array to a fetched result).
