// index.ts - TS Shopping Cart Demo with Utility Types

import { Product, Category, CartTotalResult, CartHandlerReturn } from './types';
import { Cart, buildInventory } from './Cart';
import { isProduct, validateProduct } from './validators';

console.log('========== TS SHOPPING CART (Advanced Types) ==========\n');

// Sample products
const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999.99, category: Category.Electronics, stock: 10 },
  { id: 2, name: 'Headphones', price: 49.99, category: Category.Electronics, stock: 25, discount: 15 },
  { id: 3, name: 'TypeScript Book', price: 29.99, category: Category.Books, stock: 50 },
  { id: 4, name: 'T-Shirt', price: 19.99, category: Category.Clothing, stock: 100 },
  { id: 5, name: 'Python Book', price: 24.99, category: Category.Books, stock: 30 },
];

// Validate products
console.log('--- Product Validation ---');
products.forEach((p) => {
  const error = validateProduct(p);
  console.log(`  ${p.name}: ${error ? '❌ ' + error : '✅ valid'}`);
});

// Invalid product test
const badProduct = { id: -1, name: '', price: -5, category: Category.Food, stock: 0 };
console.log(`  Bad product: ${validateProduct(badProduct)}`);

// Type guard check
console.log('\n--- Type Guard Check ---');
const unknown1: unknown = { id: 1, name: 'Mouse', price: 25 };
const unknown2: unknown = { title: 'Not a product' };
console.log(`  unknown1 isProduct? ${isProduct(unknown1)}`);
console.log(`  unknown2 isProduct? ${isProduct(unknown2)}`);

// Build Inventory using Record<Category, Product[]>
console.log('\n--- Inventory by Category ---');
const inventory = buildInventory(products);
Object.entries(inventory).forEach(([category, items]) => {
  console.log(`  ${category}: ${items.length} items`);
  items.forEach((p) => console.log(`    - ${p.name} ($${p.price})`));
});

// Cart operations
const cart = new Cart('user_42');

cart.addProduct(products[0], 1); // Laptop
cart.addProduct(products[1], 2); // Headphones (discounted)
cart.addProduct(products[2], 1); // TypeScript Book

cart.display();

// Update product using Partial<Pick<Product, ...>>
console.log('\n--- Update Product Price (ProductUpdate / Partial<Pick>) ---');
cart.updateProduct(1, { price: 899.99, discount: 10 });
console.log('  Laptop updated with $899.99 price and 10% discount:');
cart.display();

// DraftOrder using Omit<Order, 'id' | 'createdAt'>
console.log('\n--- Draft Order (Omit utility type) ---');
const draft = cart.toDraftOrder();
console.log(`  User: ${draft.userId}`);
console.log(`  Items: ${draft.items.length}`);
console.log(`  Total: $${draft.total.toFixed(2)}`);

// Readonly items
console.log('\n--- Readonly Cart Items ---');
const readonlyItems = cart.getItems();
readonlyItems.forEach((item) => {
  console.log(`  ${item.product.name} x${item.quantity} (readonly)`);
});

// Try to mutate (TypeScript would block this at compile time)
// readonlyItems[0].quantity = 99; // <-- TS Error: Cannot assign to 'quantity' because it is a read-only property

// Error handling
console.log('\n--- Error Handling ---');
try {
  cart.addProduct(products[0], 9999); // exceeds stock
} catch (e: unknown) {
  if (e instanceof Error) console.log('  Caught:', e.message);
}

// ReturnType utility type demo
console.log('\n--- ReturnType<> Utility Type Demo ---');
// CartTotalResult = ReturnType<() => number> = number
const total: CartTotalResult = cart.displayTotal();
console.log(`  CartTotalResult type resolves to: number → value = ${total}`);

// CartHandlerReturn = ReturnType<(userId: string) => DraftOrder> = DraftOrder
const draftHandler = (userId: string): CartHandlerReturn => ({ userId, items: [], total: 0 });
const result: CartHandlerReturn = draftHandler('demo-user');
console.log(`  CartHandlerReturn type resolves to: DraftOrder → userId = ${result.userId}`);

console.log('\n✅ TS Shopping Cart complete!');
