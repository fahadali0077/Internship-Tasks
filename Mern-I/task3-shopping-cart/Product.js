// Product and DiscountedProduct classes
// static methods for validation and comparison

export class Product {
  constructor(id, name, price, category) {
    this.id = id
    this.name = name
    this.price = price
    this.category = category
  }

  getInfo() {
    return `${this.name} (${this.category}) - $${this.price.toFixed(2)}`
  }

  // static method to create product from plain object
  static fromObject({ id, name, price, category }) {
    return new Product(id, name, price, category)
  }

  // static method to validate
  static isValid(product) {
    return (
      typeof product.name === 'string' &&
      typeof product.price === 'number' &&
      product.price > 0
    )
  }

  static compareByPrice(a, b) {
    return a.price - b.price
  }
}

// DiscountedProduct inherits from Product
export class DiscountedProduct extends Product {
  constructor(id, name, price, category, discountPercent) {
    super(id, name, price, category)
    this.discountPercent = discountPercent
  }

  getDiscountedPrice() {
    return this.price * (1 - this.discountPercent / 100)
  }

  // override parent getInfo
  getInfo() {
    return `${super.getInfo()} [${this.discountPercent}% off = $${this.getDiscountedPrice().toFixed(2)}]`
  }
}
