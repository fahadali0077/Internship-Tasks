# MERN-III — Module 2: Express REST API (JSON File Backed)

## What this module covers
- Express.js routing, middleware, REST API design
- Custom middleware: asyncHandler, requestLogger, validate (Zod)
- Global error handling with AppError class
- morgan HTTP logging + custom colored requestLogger
- CORS configured for MERN-II frontend
- Full CRUD for products backed by products.json

## Setup
```bash
npm run seed       # generates products.json from /data files
npm install
npm run dev        # starts on http://localhost:5000
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/health | Health check |
| GET | /api/v1/products | List (paginated, filtered, sorted, searched) |
| GET | /api/v1/products/stats | Category breakdown |
| GET | /api/v1/products/:id | Single product |
| POST | /api/v1/products | Create (Zod validated) |
| PUT | /api/v1/products/:id | Update |
| DELETE | /api/v1/products/:id | Delete |

## Frontend Wiring
Set in MERN-II `.env.local`: NEXT_PUBLIC_API_URL=http://localhost:5000
Use files from MERN-II-wired/Module-2/ folder.
