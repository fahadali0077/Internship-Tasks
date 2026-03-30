import type { Product, ApiResponse, CartItem } from "@/types";


const BASE = "/api";

// ─── Products ─────────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: failed to fetch products`);
  return res.json() as Promise<Product[]>;
}

// ─── Cart (mock POST/DELETE — simulates the MERN-III Express API) ─────────────

export async function addToCartApi(
  productId: string,
  qty = 1,
): Promise<ApiResponse<CartItem>> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));


  return {
    success: true,
    data: { id: productId, name: "", price: 0, image: "", quantity: qty },
    message: "Added to cart",
  };
}

export async function removeFromCartApi(
  productId: string,
): Promise<ApiResponse<{ id: string }>> {
  await new Promise((r) => setTimeout(r, 200));
  return { success: true, data: { id: productId }, message: "Removed from cart" };
}
