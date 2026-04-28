# MERN-III — Module 8: Testing & API Documentation

## What this module adds (on top of Module 7)
- Jest + Supertest integration tests against in-memory MongoDB
- Test suites: auth (register, login, me, logout), products (CRUD, RBAC, pagination), orders (transaction, stock decrement, 409 on out-of-stock)
- Swagger UI at GET /api/docs — all routes documented with JSDoc
- Coverage threshold enforced: >70% lines
- helmet CSP disabled for Swagger UI to render correctly

## Setup
```bash
npm install && npm run seed && npm run db:seed && npm run dev
```

## Run Tests
```bash
npm test                  # run all test suites
npm run test:coverage     # with coverage report
```

## Swagger Docs
Open: http://localhost:5000/api/docs
- Click "Authorize" → enter: Bearer <your-accessToken>
- All endpoints documented with request/response schemas

## Test Coverage
| Suite | Tests | What's verified |
|-------|-------|----------------|
| auth.test.ts | 9 tests | register, login, me, logout, 401/409/422 |
| products.test.ts | 11 tests | CRUD, pagination, filter, sort, RBAC, 422 |
| orders.test.ts | 6 tests | create order, stock decrement, 409 out-of-stock, rollback |

## Note on mongodb-memory-server
Tests use an in-memory MongoDB — no Atlas connection needed for testing.
Run npm test without setting MONGODB_URI.
