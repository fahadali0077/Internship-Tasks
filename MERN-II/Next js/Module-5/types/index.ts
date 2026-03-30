export type Category =
  | "Electronics"
  | "Fashion"
  | "Home & Kitchen"
  | "Books"
  | "Sports";

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
  readonly description?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "reviews-desc";

// Generic API response wrapper — used in Module 8
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
