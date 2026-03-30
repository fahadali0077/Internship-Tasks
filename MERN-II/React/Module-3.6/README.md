# MERN-II · Module 3 — Cart & Wishlist State

> **Stack:** React 19 · Vite 5 · TypeScript 5 (Strict)
> **New libraries:** Zustand 5 · TanStack Query v5 · React Hook Form v7 · Zod v3

---

## Quick Start

```bash
npm install
npm run dev    # → http://localhost:5173
npx tsc --noEmit
```

---

## What Changed from Module 2

| Concern           | Module 2              | Module 3                          |
|-------------------|-----------------------|-----------------------------------|
| Data fetching     | useFetch (raw)        | useQuery via TanStack Query       |
| Cart state        | useCart (useState Set)| Zustand cartStore                 |
| Wishlist          | None                  | Zustand wishlistStore + persist   |
| Cart UI           | Button only           | CartDrawer (slide-in panel)       |
| Form validation   | None                  | React Hook Form + Zod             |
| File upload       | None                  | useRef uncontrolled input         |
| Server sync       | None                  | useMutation + optimistic update   |

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
        name: "mern-ii-wishlist",      // localStorage key
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
// You wrote: loading state, error state, AbortController, cleanup, refetch

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
export const RegisterSchema = z.object({ ... }).refine(passwords match);

// Use 1: React Hook Form validation (client-side)
zodResolver(RegisterSchema)

// Use 2: TypeScript type (no duplicate interface)
type RegisterFormValues = z.infer<typeof RegisterSchema>;

// Module 8 use 3: API route body validation (server-side)
RegisterSchema.safeParse(await request.json())
```

---

## File Map

```
src/
├── lib/
│   └── queryClient.ts      ← NEW: QueryClient singleton (staleTime, gcTime, retry)
├── stores/
│   ├── cartStore.ts         ← NEW: Zustand (addItem, removeItem, updateQty, drawer)
│   └── wishlistStore.ts     ← NEW: Zustand + persist middleware → localStorage
├── schemas/
│   └── auth.ts              ← NEW: RegisterSchema + LoginSchema (Zod)
├── hooks/
│   ├── useDebounce.ts       ← carried from Module 2
│   └── useProducts.ts       ← NEW: useQuery + useAddToCartMutation
├── components/
│   ├── CartDrawer/          ← NEW: slide-in panel, reads cartStore directly
│   ├── WishlistButton/      ← NEW: heart toggle, reads wishlistStore directly
│   ├── RegisterForm/        ← NEW: RHF + Zod + uncontrolled file input
│   ├── AppHeader/           ← UPDATED: onCartClick + onRegisterClick props
│   └── ProductCard/         ← UPDATED: WishlistButton + full Product to onToggleCart
└── main.tsx                 ← UPDATED: QueryClientProvider + ReactQueryDevtools
```

---

## Step 3 — Verification Checklist

### Browser

- [ ] Products load with skeleton shimmer, then render grid
- [ ] Click "Add to Cart" → CartDrawer slides in from right with the item
- [ ] Qty stepper (+ / −) updates total in drawer footer
- [ ] Remove (✕) removes item from drawer
- [ ] Heart (♡) button wishlists a product → turns red (♥)
- [ ] **Refresh the page** → wishlist persists (localStorage); cart does NOT (ephemeral)
- [ ] Click "Register" in header → RegisterForm appears
- [ ] Submit empty form → all 4 field errors appear simultaneously
- [ ] Type a password → strength bar fills (Weak → Fair → Good → Strong)
- [ ] Mismatched passwords → "Passwords do not match" under confirmPassword
- [ ] Valid form → Submit button shows spinner → success screen appears

### TanStack Query DevTools (bottom-right ◈ button)

- [ ] Open panel → see `["products"]` query in status "success"
- [ ] Note `staleTime`: 60s — the query stays green for 1 minute
- [ ] Click the invalidate button → query goes stale → background refetch fires
- [ ] After "Add to Cart" → see `["cart"]` query appear briefly (optimistic update)

### Zustand DevTools (Redux DevTools browser extension)

- [ ] Open Redux DevTools → select "CartStore"
- [ ] Add a product → see `cart/addItem` action with full state diff
- [ ] Update qty → see `cart/updateQty`
- [ ] Open Redux DevTools → select "WishlistStore"
- [ ] Toggle wishlist → see `wishlist/toggle` action

### React DevTools — Profiler

- [ ] Record while typing in search → only SearchBar + ProductList re-render
- [ ] Record while toggling cart → CartDrawer re-renders, AppHeader re-renders
  (both subscribe to cart count), ProductCard re-renders
- [ ] Confirm: CategoryFilter does NOT re-render on cart toggle (unsubscribed)

### TypeScript

```bash
npx tsc --noEmit   # must print nothing
```

---

## What's Next — Module 3.5 (Registration Form) ✓ Already Included

Module 3.5 is built into this module:
- RegisterForm with RHF + Zod (email, password strength, confirm match)
- Uncontrolled file input for avatar via useRef
- Inline errors under each field, only after touched
- Submit disabled while invalid or submitting

## What's Next — Module 4

- Migrate everything to Next.js 15 App Router
- ProductList and ProductCard carry over unchanged
- Zustand stores carry over unchanged
- TanStack Query replaces useFetch in Server Components (fetch with cache options)
- CartDrawer becomes a Client Component ('use client')
