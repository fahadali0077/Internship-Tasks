// types for shopping cart

export interface Product {
  id: number
  name: string
  price: number
  category: Category
  stock: number
  discount?: number
}

export enum Category {
  Electronics = 'Electronics',
  Books = 'Books',
  Clothing = 'Clothing',
  Food = 'Food',
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: number
  userId: string
  items: CartItem[]
  total: number
  createdAt: string
}

// utility types

// Partial<Pick<>> - only update certain fields
export type ProductUpdate = Partial<Pick<Product, 'name' | 'price' | 'discount'>>

// Record - inventory by category
export type Inventory = Record<Category, Product[]>

// Readonly cart item
export type ReadonlyCartItem = Readonly<CartItem>

// Omit - draft order doesnt have id or createdAt yet
export type DraftOrder = Omit<Order, 'id' | 'createdAt'>

// ReturnType - extract return type of getTotal function
type GetTotalFn = () => number
export type CartTotalResult = ReturnType<GetTotalFn>  // = number

// another ReturnType example with DraftOrder
type CartHandlerFn = (userId: string) => DraftOrder
export type CartHandlerReturn = ReturnType<CartHandlerFn>  // = DraftOrder
