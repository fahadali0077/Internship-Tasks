// main - shopping cart demo

import { Product, DiscountedProduct } from './Product.js'
import { Cart } from './Cart.js'
import { groupBy, deduplicateById, sortBy } from './utils.js'

console.log('=== MODULAR SHOPPING CART ===\n')

const products = [
  new Product(1, 'Laptop', 999.99, 'Electronics'),
  new Product(2, 'Headphones', 49.99, 'Electronics'),
  new Product(3, 'JavaScript Book', 29.99, 'Books'),
  new DiscountedProduct(4, 'Mouse', 39.99, 'Electronics', 20),
  new Product(5, 'Python Book', 24.99, 'Books'),
  new Product(1, 'Laptop', 999.99, 'Electronics'), // duplicate to test dedup
]

console.log('all products:')
products.forEach((p) => console.log('  ' + p.getInfo()))

// remove duplicates using Set
const unique = deduplicateById(products)
console.log(`\nafter dedup: ${unique.length} products`)

// sort by price descending
const sorted = sortBy(unique, 'price', false)
console.log('\nsorted by price (high to low):')
sorted.forEach((p) => console.log(`  ${p.name} - $${p.price}`))

// group by category using Map
const grouped = groupBy(unique, 'category')
console.log('\ngrouped by category:')
grouped.forEach((items, category) => {
  console.log(`  ${category}:`)
  items.forEach((p) => console.log(`    - ${p.name}`))
})

// dynamic import
const { formatCurrency } = await import('./utils.js')
console.log('\ndynamic import test:')
console.log('  ' + formatCurrency(1234.5))

// cart stuff
const cart = new Cart('user_001')

cart.addItem({ product: products[0], quantity: 1 })
cart.addItem({ product: products[1], quantity: 2 })
cart.addItem({ product: products[3], quantity: 1 })
cart.addItem({ product: products[2], quantity: 1 })

cart.display()

// clone cart before modifying
const savedCart = cart.clone()

cart.removeItem(1)
cart.updateQuantity(2, 3)
console.log('\nafter changes:')
cart.display()

console.log('\nsaved cart (cloned before changes):')
savedCart.display()

console.log('\ncart json summary:')
console.log(cart.getSummary())

// validate products
console.log('\nproduct validation:')
const bad = { name: 'Broken', price: -5 }
console.log('  bad product valid? ' + Product.isValid(bad))
console.log('  laptop valid? ' + Product.isValid(products[0]))
