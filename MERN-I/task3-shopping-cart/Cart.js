// Cart module
// handles adding removing updating items
// uses destructuring and spread operator

import { deepClone, formatCurrency } from './utils.js'

export class Cart {
  constructor(userId) {
    this.userId = userId
    this.items = []
  }

  // add item - using destructuring in parameter
  addItem({ product, quantity = 1 }) {
    const existing = this.items.find((i) => i.product.id === product.id)

    if (existing) {
      // spread to update without mutating
      const updated = { ...existing, quantity: existing.quantity + quantity }
      this.items = this.items.map((i) =>
        i.product.id === product.id ? updated : i
      )
    } else {
      // spread to add new item to array
      this.items = [...this.items, { product, quantity }]
    }
  }

  removeItem(productId) {
    this.items = this.items.filter((i) => i.product.id !== productId)
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId)
      return
    }
    this.items = this.items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    )
  }

  // get total price using reduce
  getTotal() {
    return this.items.reduce((total, { product, quantity }) => {
      // check if discounted product
      const price = product.getDiscountedPrice?.() ?? product.price
      return total + price * quantity
    }, 0)
  }

  // generate json summary with template literals
  getSummary() {
    const summary = {
      userId: this.userId,
      itemCount: this.items.length,
      items: this.items.map(({ product, quantity }) => ({
        name: product.name,
        quantity,
        unitPrice: product.getDiscountedPrice?.() ?? product.price,
        subtotal: (product.getDiscountedPrice?.() ?? product.price) * quantity,
      })),
      total: this.getTotal(),
      generatedAt: new Date().toISOString(),
    }
    return JSON.stringify(summary, null, 2)
  }

  // deep clone cart using structuredClone
  clone() {
    const cloned = new Cart(this.userId)
    cloned.items = deepClone(this.items)
    return cloned
  }

  display() {
    console.log(`\nCart for: ${this.userId}`)
    console.log('---------------------------')
    if (this.items.length === 0) {
      console.log('  cart is empty')
    } else {
      this.items.forEach(({ product, quantity }) => {
        const price = product.getDiscountedPrice?.() ?? product.price
        // template literal for formatting
        console.log(`  ${product.name} x${quantity}  ${formatCurrency(price * quantity)}`)
      })
    }
    console.log('---------------------------')
    console.log(`  Total: ${formatCurrency(this.getTotal())}`)
  }
}
