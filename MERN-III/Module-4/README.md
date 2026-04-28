# MERN-III — Module 4: Authentication & Authorization (JWT)

## What this module covers
- UserSchema with bcrypt pre-save hook (salt rounds: 12)
- JWT: access token (15min) + refresh token (7d) with rotation
- HttpOnly cookie for refresh token — XSS-safe storage
- Role-Based Access Control: customer | admin | moderator
- protect middleware — validates Bearer token, attaches req.user
- authorize(...roles) middleware — factory function for RBAC
- Register, Login, Refresh, Logout, GetMe endpoints
- Admin-only product write routes (POST/PUT/DELETE)

## Setup
```bash
npm install
npm run seed        # generate products.json
npm run db:seed     # seed MongoDB

# Generate JWT secrets:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set in .env:
# JWT_SECRET=<generated>
# JWT_REFRESH_SECRET=<generated>

npm run dev
```

## Auth Flow
```
Register/Login → access token (15min) in response body
              → refresh token (7d) in HttpOnly cookie

Access protected route → Authorization: Bearer <accessToken>
Token expired? → POST /api/v1/auth/refresh (uses cookie) → new access token
Logout → clears refreshToken from DB + deletes cookie
```

## New API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/v1/auth/register | Public | Create account |
| POST | /api/v1/auth/login | Public | Login, get tokens |
| POST | /api/v1/auth/refresh | Cookie | Rotate tokens |
| POST | /api/v1/auth/logout | Public | Clear tokens |
| GET | /api/v1/auth/me | Bearer | Current user |
| POST | /api/v1/products | Admin | Now protected |
| PUT | /api/v1/products/:id | Admin | Now protected |
| DELETE | /api/v1/products/:id | Admin | Now protected |

## Testing Auth (Postman/Thunder Client)
```bash
# 1. Register
POST /api/v1/auth/register
{ "name": "Test User", "email": "test@example.com", "password": "Password1" }

# 2. Login as admin (seed an admin user first via db:seed or MongoDB Compass)
POST /api/v1/auth/login
{ "email": "admin@mernshop.com", "password": "Admin@1234" }
→ copy accessToken from response

# 3. Protected route
GET /api/v1/auth/me
Authorization: Bearer <accessToken>

# 4. Admin-only route
DELETE /api/v1/products/:id
Authorization: Bearer <adminAccessToken>
```

## Frontend Wiring (MERN-II-wired/Module-4)
- `app/actions/auth.ts` → calls real backend login/register/logout
- `app/api/auth/login/route.ts` → proxies to backend, sets cookies
- `app/api/auth/logout/route.ts` → clears all auth cookies
- `stores/authStore.ts` → stores real user object + accessToken
- `components/auth/LoginForm.tsx` → wired to loginAction
- `components/auth/RegisterForm.tsx` → wired to registerAction
