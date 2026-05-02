// ProductManager extends AuditBase
// handles product crud + audit logic

import { AuditBase } from './AuditBase.js'
import { Product, AuditResult, ProductUpdate, NewProductPayload, Category, Inventory } from './types.js'
import {
  computeStats, groupByCategory, isLowStock, isOutOfStock,
  hasOutOfStock, allHaveSalesData, filterBy, sortByKey, validateProduct,
} from './utils.js'

export class ProductManager extends AuditBase {
  private products: Product[] = []
  private nextId: number = 1

  // implements abstract method from AuditBase
  runAudit(products: Product[]): AuditResult {
    this.incrementAuditCount()
    const issues: string[] = []

    if (hasOutOfStock(products)) issues.push('some products are out of stock')
    if (!allHaveSalesData(products)) issues.push('some products missing sales data')

    const lowStock = filterBy(products, isLowStock)
    const outOfStock = filterBy(products, isOutOfStock)

    lowStock.forEach((p) => {
      issues.push(`low stock: ${p.name} (${p.stock} left)`)
      this.log(`low stock alert: ${p.name}`)
    })

    const result: AuditResult = {
      auditNumber: this.auditCount,
      issues,
      lowStock,
      outOfStock,
      timestamp: new Date().toISOString(),
    }

    this.log(`audit #${this.auditCount}: ${issues.length} issues found`)
    return result
  }

  // implements abstract log method
  log(message: string): void {
    const entry = this.buildLogEntry(message)
    this.logs.push(entry)
  }

  load(products: Product[]): void {
    this.products = products.map((p) => ({ ...p }))
    this.nextId = Math.max(...products.map((p) => p.id), 0) + 1
    this.log('products loaded')
  }

  getAll(): Product[] {
    return [...this.products]
  }

  // add using NewProductPayload = Omit<Product, 'id' | 'sku'>
  add(payload: NewProductPayload): Product {
    const error = validateProduct(payload)
    if (error) throw new Error(error)

    const id = this.nextId++
    // auto generate sku
    const sku = payload.category.substring(0, 2).toUpperCase() + '-' + String(id).padStart(3, '0')
    const product: Product = { id, sku, ...payload }

    this.products.push(product)
    this.log('added: ' + product.name)
    return product
  }

  // update using ProductUpdate = Partial<Pick<Product,...>>
  update(id: number, changes: ProductUpdate): void {
    const idx = this.products.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error('product ' + id + ' not found')
    this.products[idx] = { ...this.products[idx], ...changes }
    this.log('updated product #' + id)
  }

  remove(id: number): void {
    const before = this.products.length
    this.products = this.products.filter((p) => p.id !== id)
    if (this.products.length === before) throw new Error('product ' + id + ' not found')
    this.log('deleted product #' + id)
  }

  search(query: string, category?: Category): Product[] {
    return filterBy(this.products, (p) => {
      const matchName = p.name.toLowerCase().includes(query.toLowerCase())
      const matchCat = !category || p.category === category
      return matchName && matchCat
    })
  }

  sortBy(field: keyof Product, ascending = true): Product[] {
    return sortByKey(this.products, field, ascending)
  }

  getInventory(): Inventory {
    return groupByCategory(this.products)
  }

  getStats(): ReturnType<typeof computeStats> {
    return computeStats(this.products)
  }

  getTopSellers(n = 5): Product[] {
    return sortByKey(this.products, 'sales', false).slice(0, n)
  }

  async fetchAndLoad(source: Product[]): Promise<void> {
    this.log('fetching data...')
    await new Promise<void>((resolve) => setTimeout(resolve, 300))
    this.load(source)
    this.log('data loaded')
  }

  exportToJSON(): string {
    const inventory = this.getInventory()
    const stats = this.getStats()
    const result: Record<string, unknown[]> = {}

    ;(Object.entries(inventory) as [Category, Product[]][]).forEach(([cat, items]) => {
      result[cat] = items.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        price: p.price,
        stock: p.stock,
        sales: p.sales,
        revenue: p.price * p.sales,
      }))
    })

    return JSON.stringify({ exportedAt: new Date().toISOString(), summary: stats, inventory: result }, null, 2)
  }
}
