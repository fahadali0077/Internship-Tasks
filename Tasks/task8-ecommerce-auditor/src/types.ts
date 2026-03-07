// types.ts — Shared interfaces, enums, and utility types for the Inventory Auditor

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum Category {
  Electronics = 'Electronics',
  Books       = 'Books',
  Clothing    = 'Clothing',
  Food        = 'Food',
}

export enum StockStatus {
  InStock  = 'in-stock',
  LowStock = 'low-stock',
  OutOfStock = 'out-of-stock',
}

// ─── Core Interfaces ─────────────────────────────────────────────────────────

export interface Product {
  id:       number;
  sku:      string;
  name:     string;
  price:    number;
  category: Category;
  stock:    number;
  sales:    number;
}

export interface AuditLogEntry {
  time:    string;
  message: string;
}

export interface AuditResult {
  auditNumber: number;
  issues:      string[];
  lowStock:    Product[];
  outOfStock:  Product[];
  timestamp:   string;
}

export interface InventoryStats {
  totalProducts:   number;
  totalValue:      number;
  totalSales:      number;
  lowStockCount:   number;
  outOfStockCount: number;
  topSeller:       Product | null;
}

// ─── Utility Types ────────────────────────────────────────────────────────────

// Partial<Pick<>>: update only name and price
export type ProductUpdate = Partial<Pick<Product, 'name' | 'price' | 'stock'>>;

// Record<Category, Product[]>: inventory grouped by category
export type Inventory = Record<Category, Product[]>;

// Readonly snapshot of a product
export type ReadonlyProduct = Readonly<Product>;

// Omit id + sku to create a new product form payload
export type NewProductPayload = Omit<Product, 'id' | 'sku'>;

// ReturnType: extract the return type of computeStats
type ComputeStatsFn = (items: Product[]) => InventoryStats;
export type StatsResult = ReturnType<ComputeStatsFn>; // resolves to InventoryStats

// Parameters: extract param types of the audit handler
type AuditHandlerFn = (products: Product[], auditNum: number) => AuditResult;
export type AuditHandlerParams = Parameters<AuditHandlerFn>; // [Product[], number]

// ─── Generic Table Column Definition ─────────────────────────────────────────

export interface ColumnDef<T> {
  label:    string;
  key:      keyof T;
  format?:  (val: T[keyof T], row: T) => string;
  cssClass?: string;
}
