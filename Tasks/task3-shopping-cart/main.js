// main.js - Shopping Cart Demo (ES Modules)
// Run with: node --input-type=module < main.js  OR rename to main.mjs

import { Product, DiscountedProduct } from './Product.js';
import { Cart } from './Cart.js';
import { groupBy, deduplicateById, sortBy } from './utils.js';

console.log('========== MODULAR SHOPPING CART ==========\n');

// Create products
const products = [
  new Product(1, 'Laptop', 999.99, 'Electronics'),
  new Product(2, 'Headphones', 49.99, 'Electronics'),
  new Product(3, 'JavaScript Book', 29.99, 'Books'),
  new DiscountedProduct(4, 'Mouse', 39.99, 'Electronics', 20),
  new Product(5, 'Python Book', 24.99, 'Books'),
  new Product(1, 'Laptop', 999.99, 'Electronics'), // duplicate
];

console.log('--- All Products ---');
products.forEach((p) => console.log('  ' + p.getInfo()));

// Deduplicate
const unique = deduplicateById(products);
console.log(`\n--- After Deduplication: ${unique.length} products ---`);

// Sort by price
const sorted = sortBy(unique, 'price', false); // descending
console.log('\n--- Sorted by Price (High to Low) ---');
sorted.forEach((p) => console.log(`  ${p.name} - $${p.price}`));

// Group by category using Map
const grouped = groupBy(unique, 'category');
console.log('\n--- Grouped by Category ---');
grouped.forEach((items, category) => {
  console.log(`  ${category}:`);
  items.forEach((p) => console.log(`    - ${p.name}`));
});

// Dynamic import example (lazy loading)
const { formatCurrency } = await import('./utils.js');
console.log('\n--- Dynamic Import Test ---');
console.log('  Formatted: ' + formatCurrency(1234.5));

// Cart operations
const cart = new Cart('user_001');

cart.addItem({ product: products[0], quantity: 1 }); // Laptop
cart.addItem({ product: products[1], quantity: 2 }); // Headphones
cart.addItem({ product: products[3], quantity: 1 }); // Discounted Mouse
cart.addItem({ product: products[2], quantity: 1 }); // Book

cart.display();

// Clone cart (deep copy)
const savedCart = cart.clone();

// Modify original
cart.removeItem(1); // remove Laptop
cart.updateQuantity(2, 3); // update headphones to 3
console.log('\n--- After modification ---');
cart.display();

// Original was cloned (unchanged)
console.log('\n--- Saved cart (unchanged clone) ---');
savedCart.display();

// JSON Summary
console.log('\n--- Cart JSON Summary ---');
console.log(cart.getSummary());

// Validate products using static method
console.log('\n--- Product Validation ---');
const invalid = { name: 'Broken', price: -5 };
console.log(`  Is valid product? ${Product.isValid(invalid)}`);
console.log(`  Is Laptop valid? ${Product.isValid(products[0])}`);
