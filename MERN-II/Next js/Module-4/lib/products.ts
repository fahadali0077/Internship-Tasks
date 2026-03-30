import type { Product } from "@/types";

/**
 * Data fetching layer — called ONLY from Server Components.
 *
 * MENTAL MODEL — fetch() in Next.js 15:
 *
 * Next.js extends the native fetch() API with caching options:
 *
 *   force-cache  (default) — cache indefinitely (SSG equivalent)
 *   no-store               — never cache (SSR on every request)
 *   next: { revalidate: N } — ISR: cache for N seconds, then background refresh
 *
 * These functions run on the SERVER — they are never bundled into client JS.
 * The component tree that calls them (Server Components) also renders on
 * the server and ships only HTML to the browser — zero JS for these pages.
 *
 * In development: fetch always runs fresh (no caching to avoid stale data).
 * In production: caching kicks in per the cache option.
 *
 * WHY A SEPARATE FILE:
 *   Centralising fetch logic makes it easy to swap the mock JSON for a real
 *   API in Module 6 without touching any page or component file.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

// ─── fetchProducts ─────────────────────────────────────────────────────────
/**
 * Fetches all products.
 * Cache strategy: revalidate every 60 seconds (ISR).
 * In Module 6 this will point to the Express/MongoDB backend.
 */
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products.json`, {
    next: { revalidate: 60 }, // ISR — revalidate every 60s
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  return res.json() as Promise<Product[]>;
}

// ─── fetchProductById ───────────────────────────────────────────────────────
/**
 * Fetches a single product by id.
 * We still fetch all products (mock limitation) and filter client-side.
 * In Module 6 this becomes: GET /api/products/:id — a real endpoint.
 *
 * Cache strategy: force-cache (SSG) — product data rarely changes.
 * generateStaticParams will pre-render all product pages at build time.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id) ?? null;
}

// ─── fetchProductIds ────────────────────────────────────────────────────────
/**
 * Returns all product IDs — used by generateStaticParams to pre-render
 * all /products/[id] pages at build time (Static Site Generation).
 */
export async function fetchProductIds(): Promise<string[]> {
  const products = await fetchProducts();
  return products.map((p) => p.id);
}
