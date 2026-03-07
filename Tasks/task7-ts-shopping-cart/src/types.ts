// types.ts - Advanced TypeScript types for Shopping Cart

// Base Product interface
export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  stock: number;
  discount?: number; // optional
}

// Enum for categories
export enum Category {
  Electronics = 'Electronics',
  Books = 'Books',
  Clothing = 'Clothing',
  Food = 'Food',
}

// Cart item
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order
export interface Order {
  id: number;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
}

// ---- Utility Types in action ----

// Partial<Pick<Product, 'name' | 'price'>>: for updating only name or price
export type ProductUpdate = Partial<Pick<Product, 'name' | 'price' | 'discount'>>;

// Record<Category, Product[]>: inventory grouped by category
export type Inventory = Record<Category, Product[]>;

// Readonly cart item (cannot be modified after creation)
export type ReadonlyCartItem = Readonly<CartItem>;

// Omit some fields from Order to create a draft
export type DraftOrder = Omit<Order, 'id' | 'createdAt'>;

// ---- ReturnType utility type ----
// Extracts the return type of a function type signature
type GetTotalFn = () => number;
export type CartTotalResult = ReturnType<GetTotalFn>; // resolves to: number

// ReturnType with a more complex function: a cart handler that returns a DraftOrder
type CartHandlerFn = (userId: string) => DraftOrder;
export type CartHandlerReturn = ReturnType<CartHandlerFn>; // resolves to: DraftOrder
