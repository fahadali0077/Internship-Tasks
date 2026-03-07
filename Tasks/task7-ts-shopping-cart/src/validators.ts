// validators.ts - Generic validators + custom type guards

import { Product, CartItem } from './types';

// Generic validator with constraint: T must have an 'id' field
export function hasValidId<T extends { id: unknown }>(item: T): boolean {
  return typeof item.id === 'number' && item.id > 0;
}

// Generic validator function type
export type Validator<T> = (value: T) => string | null; // null = valid

// Product validator
export const validateProduct: Validator<Product> = (product) => {
  if (!product.name || product.name.trim() === '') return 'Product name is required.';
  if (product.price <= 0) return 'Product price must be positive.';
  if (product.stock < 0) return 'Stock cannot be negative.';
  return null;
};

// CartItem validator
export const validateCartItem: Validator<CartItem> = (item) => {
  if (item.quantity <= 0) return 'Quantity must be at least 1.';
  if (item.quantity > item.product.stock) {
    return `Not enough stock. Available: ${item.product.stock}`;
  }
  return null;
};

// ---- Custom Type Guards ----

// Type guard: is this a Product?
export function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'price' in value
  );
}

// Type guard: is this a CartItem?
export function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'product' in value &&
    'quantity' in value &&
    isProduct((value as CartItem).product)
  );
}
