# MERN-III — Module 6: Orders, Reviews & MongoDB Transactions

## What this module adds (on top of Module 5)
- OrderSchema: user ref, items[], totalAmount, status, shippingAddress
- ReviewSchema: product ref, user ref, rating, comment
- One review per user per product (compound unique index)
- Auto-recalculates product rating on every review save/delete
- MongoDB transaction: POST /orders atomically decrements stock
- RBAC: customer sees own orders, admin sees all

## Setup
```bash
npm install && npm run seed && npm run db:seed && npm run dev
```

## New API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/v1/orders | Bearer | Create order (transaction) |
| GET | /api/v1/orders/my | Bearer | My orders (paginated) |
| GET | /api/v1/orders | Admin | All orders |
| PUT | /api/v1/orders/:id/status | Admin | Update status |
| POST | /api/v1/products/:id/reviews | Bearer | Submit review |
| GET | /api/v1/products/:id/reviews | Public | Get reviews |
| DELETE | /api/v1/products/:id/reviews/:reviewId | Bearer (owner) | Delete review |

## Frontend Wiring (MERN-II-wired/Module-6)
- app/checkout/page.tsx → real POST /api/v1/orders with Bearer token
- Shows real order ID after successful checkout
- Stock is decremented atomically in MongoDB transaction
