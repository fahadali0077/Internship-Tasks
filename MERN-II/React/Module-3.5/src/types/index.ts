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
export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "reviews-desc";

// ─── Auth / Forms (Module 3.5) ────────────────────────────────────────────────
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: FileList;
}

// ─── API response wrapper (preview of Module 8 pattern) ──────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
