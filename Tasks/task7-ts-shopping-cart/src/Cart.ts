// Cart.ts - TypeScript Cart with utility types

import { Product, CartItem, ProductUpdate, DraftOrder, Inventory, Category, ReadonlyCartItem, CartTotalResult } from './types';
import { validateCartItem, isProduct } from './validators';

export class Cart {
  private items: CartItem[] = [];
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Add product with validation
  addProduct(product: Product, quantity: number = 1): void {
    const cartItem: CartItem = { product, quantity };
    const error = validateCartItem(cartItem);
    if (error) throw new Error(error);

    const existing = this.items.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push(cartItem);
    }
  }

  // Update product using ProductUpdate (Partial<Pick<Product, ...>>)
  updateProduct(productId: number, update: ProductUpdate): void {
    const item = this.items.find((i) => i.product.id === productId);
    if (!item) throw new Error(`Product ${productId} not in cart.`);
    // Spread to apply partial update
    item.product = { ...item.product, ...update };
  }

  // Get readonly items (immutable view)
  getItems(): ReadonlyCartItem[] {
    return this.items.map((item) => Object.freeze({ ...item }) as ReadonlyCartItem);
  }

  // Calculate total — return type is CartTotalResult (= ReturnType<() => number> = number)
  getTotal(): CartTotalResult {
    return this.items.reduce((sum, { product, quantity }) => {
      const effectivePrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;
      return sum + effectivePrice * quantity;
    }, 0);
  }

  // Get a DraftOrder (Omit<Order, 'id' | 'createdAt'>)
  toDraftOrder(): DraftOrder {
    return {
      userId: this.userId,
      items: [...this.items],
      total: this.getTotal(),
    };
  }

  // displayTotal: returns CartTotalResult, demonstrating ReturnType<> in action
  displayTotal(): CartTotalResult {
    const total: CartTotalResult = this.getTotal();
    console.log(`  Cart total: $${total.toFixed(2)}`);
    return total;
  }

  display(): void {
    console.log(`\n  🛒 Cart [${this.userId}]`);
    if (this.items.length === 0) {
      console.log('  (empty)');
      return;
    }
    this.items.forEach(({ product, quantity }) => {
      const price = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;
      console.log(`    ${product.name.padEnd(20)} x${quantity}  $${(price * quantity).toFixed(2)}`);
    });
    this.displayTotal();
  }
}

// Build Inventory: Record<Category, Product[]>
export function buildInventory(products: Product[]): Inventory {
  // Initialize all categories
  const inventory: Inventory = {
    [Category.Electronics]: [],
    [Category.Books]: [],
    [Category.Clothing]: [],
    [Category.Food]: [],
  };

  products.forEach((p) => {
    // Type guard: only add valid products
    if (isProduct(p)) {
      inventory[p.category].push(p);
    }
  });

  return inventory;
}
