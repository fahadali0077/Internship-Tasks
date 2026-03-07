// utils.ts — Generic helpers, debounce, throttle, Map/Set utilities, reduce stats

import { Product, Inventory, Category, InventoryStats, StatsResult } from './types.js';

// ─── Generic Functions ────────────────────────────────────────────────────────

/** Find an item by a property value — generic so it works for any type T */
export function findByProp<T>(items: T[], key: keyof T, value: T[keyof T]): T | undefined {
  return items.find((item) => item[key] === value);
}

/** Sort array by a key — generic with constraint: key must exist on T */
export function sortByKey<T>(items: T[], key: keyof T, ascending = true): T[] {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
}

/** Filter items with a typed predicate */
export function filterBy<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

/** Group items by a key using Map — generic */
export function groupByKey<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>();
  items.forEach((item) => {
    const groupKey = item[key];
    if (!map.has(groupKey)) map.set(groupKey, []);
    map.get(groupKey)!.push(item);
  });
  return map;
}

// ─── Product-Specific Utilities ───────────────────────────────────────────────

/** Deduplicate products by name using Set */
export function deduplicateByName(items: Product[]): Product[] {
  const seen = new Set<string>();
  return items.filter((p) => {
    const key = p.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Group products by category using Map → Record<Category, Product[]> */
export function groupByCategory(items: Product[]): Inventory {
  const inventory = {
    [Category.Electronics]: [],
    [Category.Books]:       [],
    [Category.Clothing]:    [],
    [Category.Food]:        [],
  } as Inventory;

  items.forEach((p) => {
    inventory[p.category].push(p);
  });

  return inventory;
}

/**
 * Compute inventory statistics using reduce / some / every
 * Return type is StatsResult = ReturnType<ComputeStatsFn> = InventoryStats
 */
export function computeStats(items: Product[]): StatsResult {
  const stats = items.reduce<InventoryStats>(
    (acc, p) => {
      acc.totalProducts++;
      acc.totalValue  += p.price * p.stock;
      acc.totalSales  += p.sales;
      if (p.stock > 0 && p.stock <= 5) acc.lowStockCount++;
      if (p.stock === 0)               acc.outOfStockCount++;
      if (!acc.topSeller || p.sales > acc.topSeller.sales) acc.topSeller = p;
      return acc;
    },
    { totalProducts: 0, totalValue: 0, totalSales: 0, lowStockCount: 0, outOfStockCount: 0, topSeller: null }
  );

  return stats;
}

/** Check if any product is out of stock */
export function hasOutOfStock(items: Product[]): boolean {
  return items.some((p) => p.stock === 0);
}

/** Check if all products have sales data */
export function allHaveSalesData(items: Product[]): boolean {
  return items.every((p) => typeof p.sales === 'number');
}

// ─── Stock Status Helpers ─────────────────────────────────────────────────────

export function isLowStock(p: Product): boolean  { return p.stock > 0 && p.stock <= 5; }
export function isOutOfStock(p: Product): boolean { return p.stock === 0; }
export function getRevenue(p: Product): number    { return p.price * p.sales; }

// ─── Debounce ─────────────────────────────────────────────────────────────────

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  } as T;
}

// ─── Throttle ────────────────────────────────────────────────────────────────

export function throttle<T extends (...args: unknown[]) => void>(fn: T, interval: number): T {
  let lastTime = 0;
  return function (this: unknown, ...args: unknown[]) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  } as T;
}

// ─── Type Guard ───────────────────────────────────────────────────────────────

/** Custom type guard: checks if an unknown value conforms to the Product interface */
export function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id'       in value &&
    'name'     in value &&
    'price'    in value &&
    'category' in value &&
    'stock'    in value
  );
}

/** Validate a new product — returns error string or null */
export function validateProduct(p: Partial<Product>): string | null {
  if (!p.name?.trim())          return 'Name is required.';
  if (!p.price || p.price <= 0) return 'Price must be positive.';
  if (p.stock == null || p.stock < 0) return 'Stock cannot be negative.';
  return null;
}

/** Format currency */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
