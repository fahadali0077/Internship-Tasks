// validators - generic validators and type guards

import { Product, CartItem } from './types'

// generic validator - T must have an id field
export function hasValidId<T extends { id: unknown }>(item: T): boolean {
  return typeof item.id === 'number' && item.id > 0
}

// validator function type
export type Validator<T> = (value: T) => string | null

// product validator
export const validateProduct: Validator<Product> = (product) => {
  if (!product.name || product.name.trim() === '') return 'name is required'
  if (product.price <= 0) return 'price must be positive'
  if (product.stock < 0) return 'stock cant be negative'
  return null
}

// cart item validator
export const validateCartItem: Validator<CartItem> = (item) => {
  if (item.quantity <= 0) return 'quantity must be at least 1'
  if (item.quantity > item.product.stock) {
    return `not enough stock. only ${item.product.stock} available`
  }
  return null
}

// type guard - is this a Product?
export function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'price' in value
  )
}

// type guard - is this a CartItem?
export function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'product' in value &&
    'quantity' in value &&
    isProduct((value as CartItem).product)
  )
}
