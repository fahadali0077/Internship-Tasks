# MERN-III — Module 9: Deployment & CI/CD

## What this module adds (on top of Module 8)
- Dockerfile — multi-stage build (builder + production, node:20-alpine)
- docker-compose.yml — local full stack (API + MongoDB with healthcheck)
- .dockerignore — excludes node_modules, .env, uploads, dist
- railway.json — Railway deployment config with healthcheck path
- GitHub Actions CI/CD — test → build Docker → deploy to Railway
- Production health check — includes DB connection status (503 if disconnected)

## Local Development with Docker
```bash
# Copy .env to set your secrets
cp .env.example .env
# Edit .env with your MongoDB Atlas URI, JWT secrets etc

# Build + start full stack (API + MongoDB)
docker compose up --build

# Verify
curl http://localhost:5000/api/health
# → { status: "ok", db: "connected", uptime: N }

# Seed database (inside running container)
docker compose exec api node dist/cli/dbSeed.js
```

## Deploy to Railway
1. Push this folder to a GitHub repo
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard:
   - MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
   - FRONTEND_URL (your Vercel URL)
   - CLOUDINARY_*, SMTP_*
4. Railway auto-detects Dockerfile and deploys
5. Copy the Railway HTTPS URL

## Update MERN-II Frontend
In your Vercel project → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```
Redeploy the frontend. Full stack is live end-to-end.

## GitHub Actions Setup
1. In your GitHub repo → Settings → Secrets → Actions:
   - RAILWAY_TOKEN (generate from Railway dashboard → Account → Tokens)
   - JWT_SECRET
   - JWT_REFRESH_SECRET
2. Push to main → CI runs automatically:
   - TypeScript typecheck
   - Jest tests with coverage
   - Docker build verification
   - Railway deployment

## Environment Variables (all of them)
```bash
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<32+ random chars>
JWT_REFRESH_SECRET=<32+ random chars>
FRONTEND_URL=https://your-vercel-app.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=noreply@mernshop.com
```
