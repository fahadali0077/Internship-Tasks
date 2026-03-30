import type { Product } from "@/types";



const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";


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

export async function fetchProductById(id: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id) ?? null;
}

// ─── fetchProductIds ────────────────────────────────────────────────────────

export async function fetchProductIds(): Promise<string[]> {
  const products = await fetchProducts();
  return products.map((p) => p.id);
}
