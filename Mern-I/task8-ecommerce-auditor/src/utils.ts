// utility functions - generic + product specific

import { Product, Inventory, Category, InventoryStats, StatsResult } from './types.js'

// generic find by property
export function findByProp<T>(items: T[], key: keyof T, value: T[keyof T]): T | undefined {
  return items.find((item) => item[key] === value)
}

// generic sort
export function sortByKey<T>(items: T[], key: keyof T, ascending = true): T[] {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1
    if (a[key] > b[key]) return ascending ? 1 : -1
    return 0
  })
}

// generic filter
export function filterBy<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate)
}

// generic group by key using Map
export function groupByKey<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>()
  items.forEach((item) => {
    const groupKey = item[key]
    if (!map.has(groupKey)) map.set(groupKey, [])
    map.get(groupKey)!.push(item)
  })
  return map
}

// group products by category - returns Record<Category, Product[]>
export function groupByCategory(items: Product[]): Inventory {
  const inventory = {
    [Category.Electronics]: [],
    [Category.Books]: [],
    [Category.Clothing]: [],
    [Category.Food]: [],
  } as Inventory

  items.forEach((p) => {
    inventory[p.category].push(p)
  })

  return inventory
}

// compute stats using reduce
// return type is StatsResult = ReturnType<ComputeStatsFn>
export function computeStats(items: Product[]): StatsResult {
  const stats = items.reduce<InventoryStats>(
    (acc, p) => {
      acc.totalProducts++
      acc.totalValue += p.price * p.stock
      acc.totalSales += p.sales
      if (p.stock > 0 && p.stock <= 5) acc.lowStockCount++
      if (p.stock === 0) acc.outOfStockCount++
      if (!acc.topSeller || p.sales > acc.topSeller.sales) acc.topSeller = p
      return acc
    },
    { totalProducts: 0, totalValue: 0, totalSales: 0, lowStockCount: 0, outOfStockCount: 0, topSeller: null }
  )
  return stats
}

// some - check if any out of stock
export function hasOutOfStock(items: Product[]): boolean {
  return items.some((p) => p.stock === 0)
}

// every - check if all have sales data
export function allHaveSalesData(items: Product[]): boolean {
  return items.every((p) => typeof p.sales === 'number')
}

export function isLowStock(p: Product): boolean { return p.stock > 0 && p.stock <= 5 }
export function isOutOfStock(p: Product): boolean { return p.stock === 0 }
export function getRevenue(p: Product): number { return p.price * p.sales }

// debounce
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  } as T
}

// throttle
export function throttle<T extends (...args: unknown[]) => void>(fn: T, interval: number): T {
  let lastTime = 0
  return function (this: unknown, ...args: unknown[]) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  } as T
}

// type guard
export function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'price' in value &&
    'category' in value &&
    'stock' in value
  )
}

export function validateProduct(p: Partial<Product>): string | null {
  if (!p.name?.trim()) return 'name is required'
  if (!p.price || p.price <= 0) return 'price must be positive'
  if (p.stock == null || p.stock < 0) return 'stock cannot be negative'
  return null
}

export function formatCurrency(amount: number): string {
  return '$' + amount.toFixed(2)
}
