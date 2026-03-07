// Product.js - ES Module
// Demonstrates: classes, static methods, inheritance

export class Product {
  constructor(id, name, price, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
  }

  // Regular method
  getInfo() {
    return `${this.name} (${this.category}) - $${this.price.toFixed(2)}`;
  }

  // Static method: create product from plain object
  static fromObject({ id, name, price, category }) {
    return new Product(id, name, price, category);
  }

  // Static method: validate product data
  static isValid(product) {
    return (
      typeof product.name === 'string' &&
      typeof product.price === 'number' &&
      product.price > 0
    );
  }

  // Static method: compare by price (for sorting)
  static compareByPrice(a, b) {
    return a.price - b.price;
  }
}

// DiscountedProduct: inherits from Product
export class DiscountedProduct extends Product {
  constructor(id, name, price, category, discountPercent) {
    super(id, name, price, category); // call parent constructor
    this.discountPercent = discountPercent;
  }

  getDiscountedPrice() {
    return this.price * (1 - this.discountPercent / 100);
  }

  getInfo() {
    // Override parent method
    return `${super.getInfo()} [${this.discountPercent}% OFF → $${this.getDiscountedPrice().toFixed(2)}]`;
  }
}
