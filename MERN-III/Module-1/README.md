# MERN-III — Module 1: Node.js CLI Data Pipeline

## What this module covers
- Node.js runtime, fs/promises, path, async patterns
- Promise.all + Promise.allSettled for concurrent file reads
- process.argv for CLI flags
- JSON validation and graceful error handling
- Generating a seed file for MongoDB (used in Module 3)

## Setup
```bash
npm install
```

## Usage
```bash
# Generate products.json from all /data files
npm run seed

# Filter by category
npm run seed:electronics
npm run seed:fashion
npm run seed:home
npm run seed:books
npm run seed:sports

# Custom filter
npx tsx src/cli/seed.ts --filter "Home & Kitchen"
```

## Output
- `products.json` — written to project root
- Summary table printed to console (total, categories, avg price)
- Invalid/malformed JSON files are warned and skipped (don't crash)

## Frontend Wiring
Module 1 has no frontend wiring. It only generates the seed data
used in Module 3 when MongoDB is connected.

## Project Structure
```
Module-1/
  data/               ← 25 product JSON files (5 categories × 4-7 products)
  src/
    cli/
      seed.ts         ← Main CLI script
  products.json       ← Generated output (after running npm run seed)
  package.json
  tsconfig.json
```
