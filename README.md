# Mern-I
---

## 📁 Project Structure

```
Tasks/
├── task1-task-tracker/        # JS: OOP, Closures, reduce/some/every, JSON, CLI
├── task2-bank-account/        # JS: Prototypal Inheritance, Closures, Currying, call/apply/bind
├── task3-shopping-cart/       # JS: ES Modules, Classes, Map/Set, Spread/Destructuring
├── task4-api-dashboard/       # JS: Async/Await, Promise.allSettled, Debounce, Throttle, WeakMap
├── task5-form-validator/      # JS: DOM, Event Delegation, Debounce, Throttle, localStorage
├── task6-ts-task-tracker/     # TS: Interfaces, Enums, Generics, Union/Intersection types
├── task7-ts-shopping-cart/    # TS: Utility Types (Partial, Pick, Omit, Record, Readonly)
└── task8-ecommerce-auditor/   # Final: Everything combined in browser app
```

---

## 🚀 How to Run Each Task

### Task 1 – Task Tracker CLI (Node.js)
```bash
cd task1-task-tracker
node index.js
```
**Demonstrates:** JSON file I/O, closures (private counter), reduce/some/every, try/catch, process.stdin

---

### Task 2 – Bank Account Simulator (Node.js)
```bash
cd task2-bank-account
node index.js
```
**Demonstrates:** Prototypal inheritance (Account → SavingsAccount, CheckingAccount), closures for private balance, currying for fee calculators, call/apply/bind, event-like callbacks

---

### Task 3 – Modular Shopping Cart (ES Modules)
```bash
cd task3-shopping-cart
npm install   # (no deps, just sets type:module)
node main.js
```
**Demonstrates:** ES Modules (import/export), Classes + inheritance, Map/Set, structuredClone, dynamic import

---

### Task 4 – API Data Dashboard (Browser)
Open `task4-api-dashboard/index.html` in a browser.

**Demonstrates:** fetch API + async/await, Promise.allSettled, custom Error classes, debounce (400ms), throttle (300ms), WeakMap caching

---

### Task 5 – Dynamic Form Validator SPA (Browser)
Open `task5-form-validator/index.html` in a browser.

**Demonstrates:** Event delegation (one listener handles all buttons), debounced input validation, throttled resize handler, DOM tree traversal, localStorage persistence, preventDefault

---

### Task 6 – TypeScript Task Tracker (Node.js + TS)
```bash
cd task6-ts-task-tracker
npm install
npx ts-node src/index.ts
```
**Demonstrates:** Interfaces (Task, User), Enums (Priority), Generics (`findByProp<T>`, `sortByKey<T>`), Union/Intersection types, try/catch with `instanceof`

---

### Task 7 – TypeScript Shopping Cart (Node.js + TS)
```bash
cd task7-ts-shopping-cart
npm install
npx ts-node src/index.ts
```
**Demonstrates:** Utility types (`Partial<Pick<>>`, `Record<>`, `Readonly<>`, `Omit<>`), custom type guards (`isProduct`, `isCartItem`), generic validators with constraints

---

### Task 8 – E-Commerce Inventory Auditor (Browser) ⭐ Final Project
Open `task8-ecommerce-auditor/index.html` in a browser.

**Demonstrates everything:**
- OOP prototypes: `Product` + `Item` (inheritance)
- Closures: private audit counter
- ES6+: Map, Set, spread, destructuring, arrow functions
- Async: simulated fetch with async/await
- DOM: event delegation on product grid, debounced search, throttled scroll
- reduce/some/every for stats and alerts
- JSON export with grouped inventory
- TypeScript concepts: type guards (`isValidProduct`), interfaces as plain JSDoc comments

--
