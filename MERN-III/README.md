# MERN-III — Backend Modules

Node.js + Express.js + MongoDB + Mongoose + JWT + Deployment

## Structure
Each module folder is a **complete, standalone, runnable backend**.
Every module includes everything from the previous module PLUS new features.

| Module | What's added | Run on port |
|--------|-------------|-------------|
| Module-1 | CLI Data Pipeline (seed tool) | — |
| Module-2 | Express REST API (JSON backed) | 5000 |
| Module-3 | MongoDB + Mongoose (real DB) | 5000 |
| Module-4 | JWT Auth + RBAC | 5000 |
| Module-5 | Security hardening + file uploads | 5000 |
| Module-6 | Orders + Reviews + Transactions | 5000 |
| Module-7 | Socket.IO + Email + Cloudinary | 5000 |
| Module-8 | Tests (Jest) + Swagger docs | 5000 |
| Module-9 | Docker + Railway deployment | 5000 |
| Final | All modules combined | 5000 |

## Quick Start (any module)
```bash
cd Module-X
npm install
npm run seed      # generate products.json (all modules)
npm run db:seed   # seed MongoDB (Module 3+)
npm run dev       # start server
```
