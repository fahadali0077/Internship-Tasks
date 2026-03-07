// ProductManager.ts — Extends AuditBase; manages products with full TS typing
import { AuditBase } from './AuditBase.js';
import { computeStats, groupByCategory, isLowStock, isOutOfStock, hasOutOfStock, allHaveSalesData, filterBy, sortByKey, validateProduct, } from './utils.js';
export class ProductManager extends AuditBase {
    constructor() {
        super(...arguments);
        this.products = [];
        this.nextId = 1;
    }
    // ── Abstract method implementations ─────────────────────────────────────────
    /** Implements AuditBase.runAudit — analyses the current product list */
    runAudit(products) {
        this.incrementAuditCount();
        const issues = [];
        if (hasOutOfStock(products))
            issues.push('Some products are out of stock.');
        if (!allHaveSalesData(products))
            issues.push('Some products are missing sales data.');
        const lowStock = filterBy(products, isLowStock);
        const outOfStock = filterBy(products, isOutOfStock);
        lowStock.forEach((p) => {
            issues.push(`Low stock: ${p.name} (${p.stock} left)`);
            this.log(`Low stock alert: ${p.name}`);
        });
        const result = {
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
    log(message) {
        const entry = this.buildLogEntry(message);
        this.logs.push(entry);
        // DOM forwarding is done by main.ts via getLogs()
    }
    // ── Product CRUD ─────────────────────────────────────────────────────────────
    load(products) {
        this.products = products.map((p) => ({ ...p }));
        this.nextId = Math.max(...products.map((p) => p.id), 0) + 1;
        this.log('Product data loaded');
    }
    getAll() {
        return [...this.products];
    }
    /** Add a new product — uses NewProductPayload (Omit<Product, 'id' | 'sku'>) */
    add(payload) {
        const error = validateProduct(payload);
        if (error)
            throw new Error(error);
        const id = this.nextId++;
        const sku = `${payload.category.substring(0, 2).toUpperCase()}-${String(id).padStart(3, '0')}`;
        const product = { id, sku, ...payload };
        this.products.push(product);
        this.log(`Added: ${product.name} [${product.sku}]`);
        return product;
    }
    /** Update only allowed fields — uses ProductUpdate = Partial<Pick<Product,...>> */
    update(id, changes) {
        const idx = this.products.findIndex((p) => p.id === id);
        if (idx === -1)
            throw new Error(`Product ${id} not found.`);
        this.products[idx] = { ...this.products[idx], ...changes };
        this.log(`Updated product #${id}`);
    }
    remove(id) {
        const before = this.products.length;
        this.products = this.products.filter((p) => p.id !== id);
        if (this.products.length === before)
            throw new Error(`Product ${id} not found.`);
        this.log(`Deleted product #${id}`);
    }
    // ── Queries ──────────────────────────────────────────────────────────────────
    search(query, category) {
        return filterBy(this.products, (p) => {
            const matchName = p.name.toLowerCase().includes(query.toLowerCase());
            const matchCat = !category || p.category === category;
            return matchName && matchCat;
        });
    }
    sortBy(field, ascending = true) {
        return sortByKey(this.products, field, ascending);
    }
    getInventory() {
        return groupByCategory(this.products);
    }
    getStats() {
        return computeStats(this.products);
    }
    getTopSellers(n = 5) {
        return sortByKey(this.products, 'sales', false).slice(0, n);
    }
    // ── Async Simulated Fetch ─────────────────────────────────────────────────────
    async fetchAndLoad(source) {
        this.log('Fetching product data (simulated async)...');
        await new Promise((resolve) => setTimeout(resolve, 300));
        this.load(source);
        this.log('Data loaded successfully');
    }
    // ── Export ────────────────────────────────────────────────────────────────────
    exportToJSON() {
        const inventory = this.getInventory();
        const stats = this.getStats();
        const result = {};
        Object.entries(inventory).forEach(([cat, items]) => {
            result[cat] = items.map((p) => ({
                id: p.id,
                sku: p.sku,
                name: p.name,
                price: p.price,
                stock: p.stock,
                sales: p.sales,
                revenue: p.price * p.sales,
            }));
        });
        return JSON.stringify({
            exportedAt: new Date().toISOString(),
            summary: stats,
            inventory: result,
        }, null, 2);
    }
}
