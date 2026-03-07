// Cart.js - ES Module
// Demonstrates: destructuring, spread operator, Map operations

import { deepClone, formatCurrency } from './utils.js';

export class Cart {
  constructor(userId) {
    this.userId = userId;
    this.items = []; // array of { product, quantity }
  }

  // Add item with destructuring
  addItem({ product, quantity = 1 }) {
    const existing = this.items.find((i) => i.product.id === product.id);

    if (existing) {
      // Spread to update quantity
      const updated = { ...existing, quantity: existing.quantity + quantity };
      this.items = this.items.map((i) =>
        i.product.id === product.id ? updated : i
      );
    } else {
      this.items = [...this.items, { product, quantity }];
    }
  }

  // Remove item by id
  removeItem(productId) {
    this.items = this.items.filter((i) => i.product.id !== productId);
  }

  // Update quantity
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items = this.items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
  }

  // Get total price
  getTotal() {
    return this.items.reduce((total, { product, quantity }) => {
      const price = product.getDiscountedPrice?.() ?? product.price;
      return total + price * quantity;
    }, 0);
  }

  // Generate JSON summary
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
    };
    return JSON.stringify(summary, null, 2);
  }

  // Clone this cart (for undo/restore functionality)
  clone() {
    const cloned = new Cart(this.userId);
    cloned.items = deepClone(this.items);
    return cloned;
  }

  // Display cart with template literals
  display() {
    console.log(`\n🛒 Cart for User: ${this.userId}`);
    console.log('─'.repeat(45));
    if (this.items.length === 0) {
      console.log('  Cart is empty.');
    } else {
      this.items.forEach(({ product, quantity }) => {
        const price = product.getDiscountedPrice?.() ?? product.price;
        console.log(`  ${product.name.padEnd(20)} x${quantity}  ${formatCurrency(price * quantity)}`);
      });
    }
    console.log('─'.repeat(45));
    console.log(`  Total: ${formatCurrency(this.getTotal())}`);
  }
}
