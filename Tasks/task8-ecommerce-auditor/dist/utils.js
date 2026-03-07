// utils.ts — Generic helpers, debounce, throttle, Map/Set utilities, reduce stats
import { Category } from './types.js';
// ─── Generic Functions ────────────────────────────────────────────────────────
/** Find an item by a property value — generic so it works for any type T */
export function findByProp(items, key, value) {
    return items.find((item) => item[key] === value);
}
/** Sort array by a key — generic with constraint: key must exist on T */
export function sortByKey(items, key, ascending = true) {
    return [...items].sort((a, b) => {
        if (a[key] < b[key])
            return ascending ? -1 : 1;
        if (a[key] > b[key])
            return ascending ? 1 : -1;
        return 0;
    });
}
/** Filter items with a typed predicate */
export function filterBy(items, predicate) {
    return items.filter(predicate);
}
/** Group items by a key using Map — generic */
export function groupByKey(items, key) {
    const map = new Map();
    items.forEach((item) => {
        const groupKey = item[key];
        if (!map.has(groupKey))
            map.set(groupKey, []);
        map.get(groupKey).push(item);
    });
    return map;
}
// ─── Product-Specific Utilities ───────────────────────────────────────────────
/** Deduplicate products by name using Set */
export function deduplicateByName(items) {
    const seen = new Set();
    return items.filter((p) => {
        const key = p.name.toLowerCase();
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
/** Group products by category using Map → Record<Category, Product[]> */
export function groupByCategory(items) {
    const inventory = {
        [Category.Electronics]: [],
        [Category.Books]: [],
        [Category.Clothing]: [],
        [Category.Food]: [],
    };
    items.forEach((p) => {
        inventory[p.category].push(p);
    });
    return inventory;
}
/**
 * Compute inventory statistics using reduce / some / every
 * Return type is StatsResult = ReturnType<ComputeStatsFn> = InventoryStats
 */
export function computeStats(items) {
    const stats = items.reduce((acc, p) => {
        acc.totalProducts++;
        acc.totalValue += p.price * p.stock;
        acc.totalSales += p.sales;
        if (p.stock > 0 && p.stock <= 5)
            acc.lowStockCount++;
        if (p.stock === 0)
            acc.outOfStockCount++;
        if (!acc.topSeller || p.sales > acc.topSeller.sales)
            acc.topSeller = p;
        return acc;
    }, { totalProducts: 0, totalValue: 0, totalSales: 0, lowStockCount: 0, outOfStockCount: 0, topSeller: null });
    return stats;
}
/** Check if any product is out of stock */
export function hasOutOfStock(items) {
    return items.some((p) => p.stock === 0);
}
/** Check if all products have sales data */
export function allHaveSalesData(items) {
    return items.every((p) => typeof p.sales === 'number');
}
// ─── Stock Status Helpers ─────────────────────────────────────────────────────
export function isLowStock(p) { return p.stock > 0 && p.stock <= 5; }
export function isOutOfStock(p) { return p.stock === 0; }
export function getRevenue(p) { return p.price * p.sales; }
// ─── Debounce ─────────────────────────────────────────────────────────────────
export function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
// ─── Throttle ────────────────────────────────────────────────────────────────
export function throttle(fn, interval) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= interval) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}
// ─── Type Guard ───────────────────────────────────────────────────────────────
/** Custom type guard: checks if an unknown value conforms to the Product interface */
export function isProduct(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'name' in value &&
        'price' in value &&
        'category' in value &&
        'stock' in value);
}
/** Validate a new product — returns error string or null */
export function validateProduct(p) {
    if (!p.name?.trim())
        return 'Name is required.';
    if (!p.price || p.price <= 0)
        return 'Price must be positive.';
    if (p.stock == null || p.stock < 0)
        return 'Stock cannot be negative.';
    return null;
}
/** Format currency */
export function formatCurrency(amount) {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
