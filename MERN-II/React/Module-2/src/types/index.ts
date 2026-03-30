// ─── Product ────────────────────────────────────────────────────────────────
export type Category = "Electronics" | "Fashion" | "Home & Kitchen" | "Books" | "Sports";

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly image: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly category: Category;
  readonly badge?: "New" | "Sale" | "Hot";
  readonly originalPrice?: number;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// ─── Wishlist ────────────────────────────────────────────────────────────────
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

// ─── Sort ─────────────────────────────────────────────────────────────────────
export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "reviews-desc"
  | "name-asc";

// ─── API ─────────────────────────────────────────────────────────────────────
export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; message?: string };
