// utils module
// groupBy, dedup, sort using Map and Set

// group items by a key using Map
export function groupBy(items, key) {
  const grouped = new Map()

  items.forEach((item) => {
    const groupKey = item[key]
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, [])
    }
    grouped.get(groupKey).push(item)
  })

  return grouped
}

// remove duplicates by id using Set
export function deduplicateById(items) {
  const seen = new Set()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

export function sortBy(items, key, ascending = true) {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1
    if (a[key] > b[key]) return ascending ? 1 : -1
    return 0
  })
}

// deep clone using structuredClone
export function deepClone(obj) {
  return structuredClone(obj)
}

export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`
}
