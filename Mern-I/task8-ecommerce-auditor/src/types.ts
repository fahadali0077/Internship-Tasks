// types for inventory auditor

export enum Category {
  Electronics = 'Electronics',
  Books = 'Books',
  Clothing = 'Clothing',
  Food = 'Food',
}

export interface Product {
  id: number
  sku: string
  name: string
  price: number
  category: Category
  stock: number
  sales: number
}

export interface AuditLogEntry {
  time: string
  message: string
}

export interface AuditResult {
  auditNumber: number
  issues: string[]
  lowStock: Product[]
  outOfStock: Product[]
  timestamp: string
}

export interface InventoryStats {
  totalProducts: number
  totalValue: number
  totalSales: number
  lowStockCount: number
  outOfStockCount: number
  topSeller: Product | null
}

// utility types

// Partial<Pick<>> - only update certain product fields
export type ProductUpdate = Partial<Pick<Product, 'name' | 'price' | 'stock'>>

// Record - inventory grouped by category
export type Inventory = Record<Category, Product[]>

// Readonly product snapshot
export type ReadonlyProduct = Readonly<Product>

// Omit - new product doesnt have id or sku yet
export type NewProductPayload = Omit<Product, 'id' | 'sku'>

// ReturnType - get return type of computeStats
type ComputeStatsFn = (items: Product[]) => InventoryStats
export type StatsResult = ReturnType<ComputeStatsFn>  // = InventoryStats

// Parameters - get param types of audit function
type AuditHandlerFn = (products: Product[], auditNum: number) => AuditResult
export type AuditHandlerParams = Parameters<AuditHandlerFn>  // = [Product[], number]

// column definition for GenericTable<T>
export interface ColumnDef<T> {
  label: string
  key: keyof T
  format?: (val: T[keyof T], row: T) => string
  cssClass?: string
}
