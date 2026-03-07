// generics.ts - Generic reusable functions

// Generic function to find an item by a property value
export function findByProp<T>(items: T[], key: keyof T, value: T[keyof T]): T | undefined {
  return items.find((item) => item[key] === value);
}

// Generic sort function with constraint: T must have a specific key
export function sortByKey<T>(items: T[], key: keyof T, ascending: boolean = true): T[] {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
}

// Generic filter function
export function filterBy<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

// Generic function to group items by a key
export function groupByKey<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>();
  items.forEach((item) => {
    const groupKey = item[key];
    if (!map.has(groupKey)) map.set(groupKey, []);
    map.get(groupKey)!.push(item);
  });
  return map;
}
