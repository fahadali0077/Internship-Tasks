// utils.js - ES Module
// Demonstrates: Map, Set, sorting, grouping, reduce

// Group array of items by a property key
export function groupBy(items, key) {
  const grouped = new Map();

  items.forEach((item) => {
    const groupKey = item[key];
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, []);
    }
    grouped.get(groupKey).push(item);
  });

  return grouped;
}

// Remove duplicate products by id using Set
export function deduplicateById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// Sort items by a given property
export function sortBy(items, key, ascending = true) {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
}

// Deep clone using structuredClone
export function deepClone(obj) {
  return structuredClone(obj);
}

// Format currency
export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}
