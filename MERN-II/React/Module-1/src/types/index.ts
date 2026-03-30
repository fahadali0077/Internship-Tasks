// ─── Product ────────────────────────────────────────────────────────────────
export type Category = "Electronics" | "Fashion" | "Home & Kitchen" | "Books" | "Sports";

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly image: string;
  readonly rating: number;         // 0–5, one decimal place
  readonly reviewCount: number;
  readonly category: Category;
  readonly badge?: "New" | "Sale" | "Hot";
  readonly originalPrice?: number; // set when badge === "Sale"
}

// ─── Cart ───────────────────────────────────────────────────────────────────
export type CartSet = ReadonlySet<string>;

export interface CartItem {
  readonly productId: string;
  readonly name: string;
  readonly price: number;
  readonly image: string;
  quantity: number;
}

// ─── API ────────────────────────────────────────────────────────────────────
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
