import type { Product } from "@/types";
import { env } from "@/env";

/**
 * lib/products.ts — data fetching layer (Server Components only).
 *
 * MODULE 8 CHANGE: uses `env.NEXT_PUBLIC_BASE_URL` from t3-env instead
 * of `process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"`.
 *
 * WHY THIS MATTERS:
 *   This file was the only place in the codebase still using raw process.env
 *   access after t3-env was introduced. That inconsistency means:
 *     • The value is not validated at startup (could be undefined silently)
 *     • The fallback "http://localhost:3000" bypasses t3-env's default
 *     • It's exactly the class of bug t3-env is designed to prevent
 *
 *   With env.NEXT_PUBLIC_BASE_URL:
 *     • Validated at startup — app crashes immediately if missing or invalid
 *     • Default is declared once, in env.ts, not scattered across files
 *     • TypeScript knows the type is `string`, not `string | undefined`
 *
 * CACHING STRATEGY (unchanged from Module 7):
 *   fetchProducts    → next: { revalidate: 60 }  ISR, fresh every 60s
 *   fetchProductById → force-cache (SSG) — product detail rarely changes
 */

const BASE_URL = env.NEXT_PUBLIC_BASE_URL;

// ── fetchProducts ──────────────────────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products.json`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  return res.json() as Promise<Product[]>;
}

// ── fetchProductById ───────────────────────────────────────────────────────────
export async function fetchProductById(id: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id) ?? null;
}

// ── fetchProductIds ────────────────────────────────────────────────────────────
export async function fetchProductIds(): Promise<string[]> {
  const products = await fetchProducts();
  return products.map((p) => p.id);
}
