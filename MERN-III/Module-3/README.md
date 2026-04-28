# MERN-III — Module 3: MongoDB + Mongoose

## What this module covers
- MongoDB Atlas setup + Mongoose ODM
- ProductSchema: types, required, enum, indexes, timestamps
- toJSON transform: _id → id (matches MERN-II frontend)
- Text index for full-text search
- Aggregation pipeline for category stats
- Pagination with .skip() .limit() .countDocuments()
- dbSeed.ts CLI — seeds MongoDB from products.json
- All controllers refactored from JSON file → Mongoose queries

## Setup

### Step 1 — Create MongoDB Atlas cluster
1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster (name: mernshop-cluster)
3. Create a DB user (username + password)
4. Add IP to allowlist (0.0.0.0/0 for dev)
5. Click Connect → Drivers → copy connection string

### Step 2 — Configure .env
```
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/mernshop
```

### Step 3 — Run
```bash
npm install
npm run seed        # generates products.json from /data
npm run db:seed     # seeds MongoDB from products.json
npm run dev         # starts server on http://localhost:5000
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/health | Health check |
| GET | /api/v1/products | List (paginated, filtered, sorted, text search) |
| GET | /api/v1/products/stats | Category aggregation |
| GET | /api/v1/products/:id | Single product by MongoDB ObjectId |
| POST | /api/v1/products | Create (Zod validated) |
| PUT | /api/v1/products/:id | Update |
| DELETE | /api/v1/products/:id | Delete |

## Query Parameters
```
?category=Electronics
?sort=price-asc | price-desc | rating-desc | reviews-desc
?search=headphones        ← uses MongoDB text index
?page=1&limit=12
```

## Frontend Wiring
Set in MERN-II `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Use MERN-II-wired/Module-3/ — same files as Module-2,
product IDs are now MongoDB ObjectIds (e.g. 664f2a3b1234567890abcdef)

## Important Notes
- Product IDs change from UUID strings to MongoDB ObjectIds after seeding
- The toJSON transform maps _id → id automatically, matching the frontend type
- Text search requires the text index (created automatically on first run)
