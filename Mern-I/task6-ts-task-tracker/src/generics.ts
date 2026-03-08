// generic helper functions
// these work with any type T

// find item by a property - generic
export function findByProp<T>(items: T[], key: keyof T, value: T[keyof T]): T | undefined {
  return items.find((item) => item[key] === value)
}

// sort by key - generic
export function sortByKey<T>(items: T[], key: keyof T, ascending: boolean = true): T[] {
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

// group by key - generic
export function groupByKey<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>()
  items.forEach((item) => {
    const groupKey = item[key]
    if (!map.has(groupKey)) map.set(groupKey, [])
    map.get(groupKey)!.push(item)
  })
  return map
}
