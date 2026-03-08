// Cart class with utility types

import { Product, CartItem, ProductUpdate, DraftOrder, Inventory, Category, ReadonlyCartItem, CartTotalResult } from './types'
import { validateCartItem, isProduct } from './validators'

export class Cart {
  private items: CartItem[] = []
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  addProduct(product: Product, quantity: number = 1): void {
    const cartItem: CartItem = { product, quantity }
    const error = validateCartItem(cartItem)
    if (error) throw new Error(error)

    const existing = this.items.find((i) => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      this.items.push(cartItem)
    }
  }

  // ProductUpdate uses Partial<Pick<Product, ...>>
  updateProduct(productId: number, update: ProductUpdate): void {
    const item = this.items.find((i) => i.product.id === productId)
    if (!item) throw new Error(`product ${productId} not in cart`)
    item.product = { ...item.product, ...update }
  }

  // returns ReadonlyCartItem array - cant be mutated
  getItems(): ReadonlyCartItem[] {
    return this.items.map((item) => Object.freeze({ ...item }) as ReadonlyCartItem)
  }

  // return type is CartTotalResult which = ReturnType<() => number> = number
  getTotal(): CartTotalResult {
    return this.items.reduce((sum, { product, quantity }) => {
      const effectivePrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price
      return sum + effectivePrice * quantity
    }, 0)
  }

  // DraftOrder uses Omit<Order, 'id' | 'createdAt'>
  toDraftOrder(): DraftOrder {
    return {
      userId: this.userId,
      items: [...this.items],
      total: this.getTotal(),
    }
  }

  // returns CartTotalResult (ReturnType demo)
  displayTotal(): CartTotalResult {
    const total: CartTotalResult = this.getTotal()
    console.log(`  total: $${total.toFixed(2)}`)
    return total
  }

  display(): void {
    console.log(`\n  cart [${this.userId}]`)
    if (this.items.length === 0) {
      console.log('  empty')
      return
    }
    this.items.forEach(({ product, quantity }) => {
      const price = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price
      console.log(`    ${product.name} x${quantity}  $${(price * quantity).toFixed(2)}`)
    })
    this.displayTotal()
  }
}

// build inventory using Record<Category, Product[]>
export function buildInventory(products: Product[]): Inventory {
  const inventory: Inventory = {
    [Category.Electronics]: [],
    [Category.Books]: [],
    [Category.Clothing]: [],
    [Category.Food]: [],
  }

  products.forEach((p) => {
    if (isProduct(p)) {
      inventory[p.category].push(p)
    }
  })

  return inventory
}
