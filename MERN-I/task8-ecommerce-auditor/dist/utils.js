// utility functions - generic + product specific
import { Category } from './types.js';
// generic find by property
export function findByProp(items, key, value) {
    return items.find((item) => item[key] === value);
}
// generic sort
export function sortByKey(items, key, ascending = true) {
    return [...items].sort((a, b) => {
        if (a[key] < b[key])
            return ascending ? -1 : 1;
        if (a[key] > b[key])
            return ascending ? 1 : -1;
        return 0;
    });
}
// generic filter
export function filterBy(items, predicate) {
    return items.filter(predicate);
}
// generic group by key using Map
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
// group products by category - returns Record<Category, Product[]>
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
// compute stats using reduce
// return type is StatsResult = ReturnType<ComputeStatsFn>
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
// some - check if any out of stock
export function hasOutOfStock(items) {
    return items.some((p) => p.stock === 0);
}
// every - check if all have sales data
export function allHaveSalesData(items) {
    return items.every((p) => typeof p.sales === 'number');
}
export function isLowStock(p) { return p.stock > 0 && p.stock <= 5; }
export function isOutOfStock(p) { return p.stock === 0; }
export function getRevenue(p) { return p.price * p.sales; }
// debounce
export function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
// throttle
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
// type guard
export function isProduct(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'name' in value &&
        'price' in value &&
        'category' in value &&
        'stock' in value);
}
export function validateProduct(p) {
    if (!p.name?.trim())
        return 'name is required';
    if (!p.price || p.price <= 0)
        return 'price must be positive';
    if (p.stock == null || p.stock < 0)
        return 'stock cannot be negative';
    return null;
}
export function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}
