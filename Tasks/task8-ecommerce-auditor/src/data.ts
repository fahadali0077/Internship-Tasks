// data.ts — Mock product data using the Product interface

import { Product, Category } from './types.js';

export const initialProducts: Product[] = [
  { id: 1,  sku: 'EL-001', name: 'Laptop Pro',           price: 999.99, category: Category.Electronics, stock: 8,   sales: 145 },
  { id: 2,  sku: 'EL-002', name: 'Wireless Mouse',        price:  29.99, category: Category.Electronics, stock: 3,   sales: 320 },
  { id: 3,  sku: 'EL-003', name: 'Mechanical Keyboard',   price:  89.99, category: Category.Electronics, stock: 5,   sales: 210 },
  { id: 4,  sku: 'BK-001', name: 'Clean Code Book',       price:  24.99, category: Category.Books,       stock: 30,  sales:  95 },
  { id: 5,  sku: 'BK-002', name: 'JS: Good Parts',        price:  19.99, category: Category.Books,       stock: 22,  sales: 180 },
  { id: 6,  sku: 'BK-003', name: 'TypeScript Handbook',   price:  34.99, category: Category.Books,       stock: 15,  sales:  65 },
  { id: 7,  sku: 'CL-001', name: 'Hoodie',                price:  49.99, category: Category.Clothing,    stock: 40,  sales:  88 },
  { id: 8,  sku: 'CL-002', name: 'Sneakers',              price:  79.99, category: Category.Clothing,    stock: 2,   sales: 115 },
  { id: 9,  sku: 'FD-001', name: 'Green Tea',             price:   9.99, category: Category.Food,        stock: 0,   sales: 420 },
  { id: 10, sku: 'FD-002', name: 'Protein Bar',           price:   3.99, category: Category.Food,        stock: 50,  sales: 530 },
];
