// ProductManager.ts — Extends AuditBase; manages products with full TS typing

import { AuditBase } from './AuditBase.js';
import {
  Product, AuditResult, ProductUpdate, NewProductPayload,
  Category, Inventory,
} from './types.js';
import {
  computeStats, groupByCategory, isLowStock, isOutOfStock,
  hasOutOfStock, allHaveSalesData, filterBy, sortByKey, validateProduct,
} from './utils.js';

export class ProductManager extends AuditBase {
  private products: Product[]  = [];
  private nextId:   number     = 1;

  // ── Abstract method implementations ─────────────────────────────────────────

  /** Implements AuditBase.runAudit — analyses the current product list */
  runAudit(products: Product[]): AuditResult {
    this.incrementAuditCount();
    const issues: string[] = [];

    if (hasOutOfStock(products))       issues.push('Some products are out of stock.');
    if (!allHaveSalesData(products))   issues.push('Some products are missing sales data.');

    const lowStock  = filterBy(products, isLowStock);
    const outOfStock = filterBy(products, isOutOfStock);

    lowStock.forEach((p) => {
      issues.push(`Low stock: ${p.name} (${p.stock} left)`);
      this.log(`Low stock alert: ${p.name}`);
    });

    const result: AuditResult = {
      auditNumber: this.auditCount,
      issues,
      lowStock,
      outOfStock,
      timestamp: new Date().toISOString(),
    };

    this.log(`Audit #${this.auditCount}: ${issues.length} issue(s) found`);
    return result;
  }

  /** Implements AuditBase.log — stores entries and optionally forwards to DOM */
  log(message: string): void {
    const entry = this.buildLogEntry(message);
    this.logs.push(entry);
    // DOM forwarding is done by main.ts via getLogs()
  }

  // ── Product CRUD ─────────────────────────────────────────────────────────────

  load(products: Product[]): void {
    this.products = products.map((p) => ({ ...p }));
    this.nextId   = Math.max(...products.map((p) => p.id), 0) + 1;
    this.log('Product data loaded');
  }

  getAll(): Product[] {
    return [...this.products];
  }

  /** Add a new product — uses NewProductPayload (Omit<Product, 'id' | 'sku'>) */
  add(payload: NewProductPayload): Product {
    const error = validateProduct(payload);
    if (error) throw new Error(error);

    const id  = this.nextId++;
    const sku = `${payload.category.substring(0, 2).toUpperCase()}-${String(id).padStart(3, '0')}`;
    const product: Product = { id, sku, ...payload };

    this.products.push(product);
    this.log(`Added: ${product.name} [${product.sku}]`);
    return product;
  }

  /** Update only allowed fields — uses ProductUpdate = Partial<Pick<Product,...>> */
  update(id: number, changes: ProductUpdate): void {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Product ${id} not found.`);
    this.products[idx] = { ...this.products[idx], ...changes };
    this.log(`Updated product #${id}`);
  }

  remove(id: number): void {
    const before = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    if (this.products.length === before) throw new Error(`Product ${id} not found.`);
    this.log(`Deleted product #${id}`);
  }

  // ── Queries ──────────────────────────────────────────────────────────────────

  search(query: string, category?: Category): Product[] {
    return filterBy(this.products, (p) => {
      const matchName = p.name.toLowerCase().includes(query.toLowerCase());
      const matchCat  = !category || p.category === category;
      return matchName && matchCat;
    });
  }

  sortBy(field: keyof Product, ascending = true): Product[] {
    return sortByKey(this.products, field, ascending);
  }

  getInventory(): Inventory {
    return groupByCategory(this.products);
  }

  getStats(): ReturnType<typeof computeStats> {
    return computeStats(this.products);
  }

  getTopSellers(n = 5): Product[] {
    return sortByKey(this.products, 'sales', false).slice(0, n);
  }

  // ── Async Simulated Fetch ─────────────────────────────────────────────────────

  async fetchAndLoad(source: Product[]): Promise<void> {
    this.log('Fetching product data (simulated async)...');
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
    this.load(source);
    this.log('Data loaded successfully');
  }

  // ── Export ────────────────────────────────────────────────────────────────────

  exportToJSON(): string {
    const inventory = this.getInventory();
    const stats     = this.getStats();
    const result: Record<string, unknown[]> = {};

    (Object.entries(inventory) as [Category, Product[]][]).forEach(([cat, items]) => {
      result[cat] = items.map((p) => ({
        id:      p.id,
        sku:     p.sku,
        name:    p.name,
        price:   p.price,
        stock:   p.stock,
        sales:   p.sales,
        revenue: p.price * p.sales,
      }));
    });

    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      summary:    stats,
      inventory:  result,
    }, null, 2);
  }
}
