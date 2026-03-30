// ─── Product ─────────────────────────────────────────────────────────────────
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

// ─── Cart ─────────────────────────────────────────────────────────────────────
// Module 3: upgrade from a bare Set<id> to full CartItem objects with quantity
export interface CartItem {
  product: Product;
  qty: number;
}

// ─── Search / Sort ────────────────────────────────────────────────────────────
// Single source of truth — shared by ProductsPage SORT_FNS, SortControl, and state.
export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "reviews-desc"
  | "name-asc";

// ─── Auth / Forms (Module 3.5) ────────────────────────────────────────────────
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: FileList;
}

// ─── API response wrapper ─────────────────────────────────────────────────────
// Discriminated union — callers must narrow on `success` before accessing
// `data` (success branch) or `error` (failure branch).
// Mirrors what the Express backend returns in MERN-III.
export type ApiResponse<T> =
  | { success: true;  data: T;       message?: string }
  | { success: false; error: string; message?: string };
