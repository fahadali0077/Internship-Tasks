# MERN-III — Module 5: Security Hardening

## What this module adds (on top of Module 4)
- express-rate-limit: 100 req/15min globally, 10 req/15min for auth routes
- express-mongo-sanitize: blocks NoSQL injection ($gt, $where attacks)
- hpp: HTTP Parameter Pollution prevention
- compression: gzip all responses
- multer: POST /api/v1/products/:id/image (5MB limit, images only)
- Stricter body size limit (10kb)

## No frontend changes
Module 5 is pure backend hardening. Use the same MERN-II-wired/Module-5
frontend as Module 4 — all files are identical.

## Setup
```bash
npm install && npm run seed && npm run db:seed && npm run dev
```

## New endpoint
POST /api/v1/products/:id/image   (Admin, multipart/form-data, field: "image")
