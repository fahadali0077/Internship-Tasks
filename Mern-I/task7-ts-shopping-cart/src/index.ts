// ts shopping cart demo

import { Product, Category, CartTotalResult, CartHandlerReturn } from './types'
import { Cart, buildInventory } from './Cart'
import { isProduct, validateProduct } from './validators'

console.log('=== TS SHOPPING CART ===\n')

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999.99, category: Category.Electronics, stock: 10 },
  { id: 2, name: 'Headphones', price: 49.99, category: Category.Electronics, stock: 25, discount: 15 },
  { id: 3, name: 'TypeScript Book', price: 29.99, category: Category.Books, stock: 50 },
  { id: 4, name: 'T-Shirt', price: 19.99, category: Category.Clothing, stock: 100 },
  { id: 5, name: 'Python Book', price: 24.99, category: Category.Books, stock: 30 },
]

// validate products
console.log('product validation:')
products.forEach((p) => {
  const error = validateProduct(p)
  console.log(`  ${p.name}: ${error ? 'invalid - ' + error : 'valid'}`)
})

const badProduct = { id: -1, name: '', price: -5, category: Category.Food, stock: 0 }
console.log(`  bad product: ${validateProduct(badProduct)}`)

// type guard
console.log('\ntype guards:')
const unknown1: unknown = { id: 1, name: 'Mouse', price: 25 }
const unknown2: unknown = { title: 'not a product' }
console.log(`  unknown1 isProduct? ${isProduct(unknown1)}`)
console.log(`  unknown2 isProduct? ${isProduct(unknown2)}`)

// inventory using Record<Category, Product[]>
console.log('\ninventory by category:')
const inventory = buildInventory(products)
Object.entries(inventory).forEach(([category, items]) => {
  console.log(`  ${category}: ${items.length} items`)
  items.forEach((p) => console.log(`    - ${p.name} ($${p.price})`))
})

// cart
const cart = new Cart('user_42')
cart.addProduct(products[0], 1)
cart.addProduct(products[1], 2)
cart.addProduct(products[2], 1)
cart.display()

// update using Partial<Pick<Product,...>>
console.log('\nupdate laptop price:')
cart.updateProduct(1, { price: 899.99, discount: 10 })
cart.display()

// DraftOrder with Omit
console.log('\ndraft order:')
const draft = cart.toDraftOrder()
console.log(`  user: ${draft.userId}`)
console.log(`  items: ${draft.items.length}`)
console.log(`  total: $${draft.total.toFixed(2)}`)

// Readonly items
console.log('\nreadonly cart items:')
const readonlyItems = cart.getItems()
readonlyItems.forEach((item) => {
  console.log(`  ${item.product.name} x${item.quantity} (readonly)`)
})
// readonlyItems[0].quantity = 99 // this would cause a ts error

// ReturnType demo
console.log('\nReturnType<> utility type demo:')
const total: CartTotalResult = cart.displayTotal()
console.log(`  CartTotalResult = ReturnType<() => number> = number, value: ${total}`)

const draftHandler = (userId: string): CartHandlerReturn => ({ userId, items: [], total: 0 })
const result: CartHandlerReturn = draftHandler('demo-user')
console.log(`  CartHandlerReturn = ReturnType<fn> = DraftOrder, userId: ${result.userId}`)

// error handling
console.log('\nerror handling:')
try {
  cart.addProduct(products[0], 9999)
} catch (e: unknown) {
  if (e instanceof Error) console.log('  caught: ' + e.message)
}

console.log('\ndone!')
