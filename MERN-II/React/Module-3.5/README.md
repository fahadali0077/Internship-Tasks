# MERNShop · Module 3.5 — Registration Form with Validation

> **Stack:** React 19 · Vite 5 · TypeScript 5 (Strict)  
> **Libraries:** Zustand 5 · TanStack Query v5 · React Hook Form v7 · Zod v3 · @hookform/resolvers

---

## Quick Start

```bash
npm install
npm run dev          # → http://localhost:5173
npm run typecheck    # tsc --noEmit (must print nothing)
npm run lint         # ESLint 9 flat config (0 warnings allowed)
npm run build        # type-check + production bundle
```

---

## Module Coverage

This module implements **Module 3 + Module 3.5** of the MERN-II curriculum.

| Module | Task | Status |
|--------|------|--------|
| 1 | ProductCard, ProductList, category filter, cart state | ✅ Carried forward |
| 2 | useDebounce, useFetch, SearchBar, useRef auto-focus, useMemo sort | ✅ Carried forward |
| 3 | Zustand cartStore + wishlistStore, CartDrawer, TanStack Query, useMutation + optimistic update | ✅ Implemented |
| 3.5 | RegisterForm: RHF + Zod + uncontrolled file input | ✅ Implemented |

---

## What Changed from Module 2 → 3 → 3.5

| Concern           | Module 2              | Module 3                           | Module 3.5 addition           |
|-------------------|-----------------------|------------------------------------|-------------------------------|
| Data fetching     | useFetch (raw)        | useQuery via TanStack Query        | —                             |
| Cart state        | useCart (useState)    | Zustand cartStore                  | —                             |
| Wishlist          | None                  | Zustand wishlistStore + persist    | —                             |
| Cart UI           | Button only           | CartDrawer (slide-in panel)        | —                             |
| Server sync       | None                  | useMutation + optimistic update    | —                             |
| Form validation   | None                  | None                               | React Hook Form + Zod         |
| File upload       | None                  | None                               | useRef uncontrolled input     |

---

## File Map

```
src/
├── lib/
│   └── queryClient.ts          ← QueryClient singleton (staleTime, gcTime, retry)
├── stores/
│   ├── cartStore.ts             ← Zustand (addItem, removeItem, updateQty, drawer)
│   └── wishlistStore.ts         ← Zustand + persist middleware → localStorage
├── schemas/
│   └── auth.ts                  ← RegisterSchema + LoginSchema (Zod)
├── hooks/
│   ├── useDebounce.ts           ← debounced value hook (Module 2)
│   ├── useFetch.ts              ← generic fetch hook with AbortController (Module 2)
│   ├── useLocalStorage.ts       ← persist state to localStorage (Module 2)
│   └── useProducts.ts           ← useQuery + useAddToCartMutation
├── types/
│   └── index.ts                 ← Product, CartItem, SortOption, ApiResponse<T>
├── data/
│   └── products.ts              ← mock product data + ALL_CATEGORIES
└── components/
    ├── AppHeader/               ← sticky header, cart badge, register nav button
    ├── CartDrawer/              ← slide-in cart panel, reads cartStore directly
    ├── CategoryFilter/          ← pill buttons + native select fallback
    ├── ProductCard/             ← card with WishlistButton, cart toggle, badge
    ├── ProductList/             ← loading skeleton, error, empty states + grid
    ├── RegisterForm/            ← RHF + Zod + password strength + uncontrolled file
    ├── SearchBar/               ← controlled input + useRef auto-focus
    ├── SortControl/             ← controlled select for sort order
    └── WishlistButton/          ← heart toggle, reads wishlistStore directly
```

---

## Mental Models

### 1. Server State vs Client State

```
CLIENT STATE (Zustand)          SERVER STATE (TanStack Query)
────────────────────────        ────────────────────────────
Cart items                      Product list
Wishlist                        User profile (Module 6)
Drawer open/close               Order history (Module 6)
Theme / UI preferences          Inventory counts

Source of truth: browser        Source of truth: server
Lives forever (until cleared)   Can go stale, needs refetch
```

### 2. Zustand — selector pattern

```ts
// WRONG: re-renders on ANY store change
const store = useCartStore();

// RIGHT: re-renders ONLY when items array changes
const items = useCartStore(s => s.items);

// RIGHT: re-renders ONLY when totalPrice changes
const total = useCartStore(s => s.totalPrice());
```

### 3. Zustand — persist middleware

```ts
create<WishlistState>()(
  devtools(
    persist(
      (set, get) => ({ ... }),
      {
        name: "mern-ii-wishlist",          // localStorage key
        partialize: s => ({ items: s.items }) // only persist data, not functions
      }
    ),
    { name: "WishlistStore" }
  )
)
```

### 4. TanStack Query — useQuery vs useFetch

```ts
// Module 2 — useFetch (manual)
const { data, loading, error } = useFetch<Product[]>("/api/products.json");
// You wrote: loading state, error state, AbortController cleanup, no cache

// Module 3 — useQuery (automatic)
const { data, isLoading, error } = useProducts();
// TanStack handles: caching, staleTime, background refetch,
//                   deduplication, retry, devtools
```

### 5. useMutation + optimistic update

```
User clicks "Add to Cart"
    │
    ├─→ onMutate: save snapshot → Zustand addItem() immediately (instant UI)
    │
    ├─→ mutationFn: POST /api/cart (async, runs in background)
    │       │
    │       ├─ success → onSettled: invalidate cart query
    │       └─ error   → onError: rollback Zustand to snapshot
    │
    └─→ UI already updated before response arrives
```

### 6. React Hook Form — zero re-renders on typing

```ts
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(RegisterSchema),
  mode: "onTouched", // errors only after field is blurred
});

// register() spreads { name, ref, onChange, onBlur } onto the input
// RHF uses refs internally — typing does NOT call setState → no re-renders
// Component only re-renders when errors change or on submit
```

### 7. Zod — one schema, two uses

```ts
// Define once:
export const RegisterSchema = z.object({ ... }).refine(/* passwords match */);

// Use 1: React Hook Form validation (client-side)
zodResolver(RegisterSchema)

// Use 2: TypeScript type (no duplicate interface)
type RegisterFormValues = z.infer<typeof RegisterSchema>;

// Module 8 use 3: API route body validation (server-side)
RegisterSchema.safeParse(await request.json())
```

### 8. Controlled vs Uncontrolled inputs

```ts
// CONTROLLED — React owns the value, perfect for text/email/password
<input value={value} onChange={e => setValue(e.target.value)} />

// UNCONTROLLED — DOM owns the value, read imperatively via ref
// Best for: file inputs (FileList not serialisable), third-party widgets
const fileRef = useRef<HTMLInputElement>(null);
<input type="file" ref={fileRef} />
// On submit: const file = fileRef.current?.files?.[0];
```

---

## Verification Checklist

### Browser

- [ ] Products load with skeleton shimmer, then render grid
- [ ] Click "Add to Cart" → CartDrawer slides in from right with item
- [ ] Qty stepper (+ / −) updates total in drawer footer
- [ ] Remove (✕) removes item from drawer
- [ ] Heart (♡) button wishlists a product → turns red (♥)
- [ ] **Refresh the page** → wishlist persists; cart does NOT (ephemeral by design)
- [ ] Click "Register" in header → RegisterForm appears
- [ ] Submit empty form → all field errors appear simultaneously
- [ ] Type in password field → strength bar fills: Weak → Fair → Good → Strong
- [ ] Mismatched passwords → "Passwords do not match" under confirmPassword
- [ ] Upload a photo → avatar preview appears in the form
- [ ] Valid form → Submit button shows spinner → success screen → redirects to shop

### TanStack Query DevTools (◈ button, bottom-right)

- [ ] See `["products"]` query in "success" status
- [ ] staleTime: 60s — query stays fresh for 1 minute
- [ ] After invalidating → background refetch fires
- [ ] After "Add to Cart" → `["cart"]` query appears (optimistic update)

### Zustand DevTools (Redux DevTools extension)

- [ ] "CartStore" → add product → see `cart/addItem` action + state diff
- [ ] "WishlistStore" → toggle heart → see `wishlist/toggle` action

### TypeScript

```bash
npm run typecheck   # must print nothing
```

---

## What's Next — Module 4

- Scaffold Next.js 15 with TypeScript + Tailwind + Shadcn/ui
- Migrate ProductList, ProductCard, CartDrawer into App Router
- Zustand stores carry over unchanged (add `'use client'` directive)
- TanStack Query runs in Client Components; Server Components use `fetch()` directly
- RegisterForm becomes `/auth/register` page
