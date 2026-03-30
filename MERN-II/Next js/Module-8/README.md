# MERN-II · Module 8 — Type-Safe Product & Cart System

> **Stack:** Next.js 15 · TypeScript 5 (Strict) · Zod · t3-env · Husky · lint-staged

## Quick Start

```bash
npm install      # also runs `husky` to install git hooks
npm run dev
npm run type-check
```

## Husky Setup (one-time, after cloning)

```bash
# Husky installs automatically via the "prepare" script on npm install
# To verify the pre-commit hook is active:
cat .husky/pre-commit

# To manually trigger the pre-commit check:
npx lint-staged && npx tsc --noEmit
```

## Requirements → Implementation

| Requirement | File(s) |
|---|---|
| Shared types: Product, CartItem, User, ApiResponse | `types/index.ts` |
| Zod schemas: ProductSchema, CartItemSchema | `schemas/product.ts` |
| Zod schemas: RegisterSchema, LoginSchema | `schemas/auth.ts` |
| Validate API Route bodies with safeParse() | `app/api/products/route.ts`, `app/api/products/[id]/route.ts`, `app/api/cart/route.ts` |
| Validate Server Actions with Zod | `app/actions/cart.ts` |
| t3-env type-safe environment variables | `env.ts` |
| Husky pre-commit: ESLint + tsc --noEmit | `.husky/pre-commit` + `.lintstagedrc.json` |

## Mental Models

### Zod .safeParse() vs .parse()

```ts
// .parse() — throws ZodError on failure
// NEVER use in API routes — would crash with unhandled 500
const data = ProductSchema.parse(body); // throws!

// .safeParse() — never throws
// Returns a discriminated union — check .success before accessing .data
const result = ProductSchema.safeParse(body);
if (!result.success) {
  const errors = result.error.flatten().fieldErrors;
  return NextResponse.json({ success: false, error: "...", details: errors }, { status: 400 });
}
// result.data is now fully typed: Product
```

### Types vs Schemas — two layers

```
types/index.ts              schemas/product.ts
──────────────────          ──────────────────────────────
TypeScript only             Zod — survives at runtime
Compile-time                Runtime validation
No runtime cost             Validates actual API input
For IDE autocomplete        For input sanitisation

z.infer<typeof ProductSchema> === Product (they never drift)
```

### t3-env — validate at startup

```ts
// Before t3-env:
const url = process.env.DATABASE_URL; // string | undefined — silent failure!

// After t3-env:
import { env } from "@/env";
env.DATABASE_URL; // string | undefined — BUT validated at startup
// If it's present and not a valid URL → app crashes immediately with:
// "❌ Invalid environment variables: DATABASE_URL must be a valid MongoDB connection string"
```

### Husky pre-commit flow

```
git commit -m "feat: add product"
  ↓
.husky/pre-commit fires
  ↓
lint-staged → ESLint --fix on staged .ts/.tsx files
  ↓
tsc --noEmit → type-check the entire project
  ↓
✅ All pass → commit proceeds
❌ Any fail → commit aborted with error message
```

### ApiResponse<T> discriminated union

```ts
type ApiResponse<T> =
  | { success: true;  data: T;      message?: string }
  | { success: false; error: string; code?: string };

// TypeScript narrows the type based on `success`:
const res: ApiResponse<Product[]> = await fetch("/api/products").then(r => r.json());
if (res.success) {
  res.data;  // ✅ typed as Product[]
} else {
  res.error; // ✅ typed as string
  // res.data — ❌ TypeScript error: doesn't exist on failure branch
}
```

## Validation Layers

```
User types in form
  ↓ Layer 1: React Hook Form + zodResolver (client-side UX)
  ↓ Layer 2: Zod.safeParse() in Server Action (server-side, can't bypass)
  ↓ Layer 3: Zod.safeParse() in API Route (external consumers)
  ↓ Layer 4: TypeScript types (compile-time, tsc --noEmit in pre-commit)
```

## Testing the API (with validation)

```bash
# Valid request
curl "http://localhost:3000/api/products?category=Electronics"

# Invalid category → 400 with field errors
curl "http://localhost:3000/api/products?category=InvalidCat"
# Response: { "success": false, "error": "Invalid query parameters", "details": {...} }

# Invalid sort param → 400
curl "http://localhost:3000/api/products?sort=not-a-valid-sort"

# Invalid product ID format → 400
curl "http://localhost:3000/api/products/not-valid-id"
# Response: { "success": false, "error": "Product ID must match format p-NNN" }

# Valid product
curl "http://localhost:3000/api/products/p-001"

# Cart
curl "http://localhost:3000/api/cart"
```

## Verification Checklist

- [ ] `npm install` → `.husky/pre-commit` hook installed automatically
- [ ] `git commit` on clean code → passes, commit proceeds
- [ ] Introduce a TypeScript error → `git commit` aborted with tsc error
- [ ] `GET /api/products?category=InvalidCat` → 400 with validation details
- [ ] `GET /api/products/bad-id` → 400 "Product ID must match format p-NNN"
- [ ] `GET /api/products/p-001` → 200 with product data
- [ ] `GET /api/cart` → 200 with validated cart items
- [ ] Add `SKIP_ENV_VALIDATION=false` and remove `NEXT_PUBLIC_BASE_URL` → startup crash with message
- [ ] `npm run type-check` → no output (zero errors)
