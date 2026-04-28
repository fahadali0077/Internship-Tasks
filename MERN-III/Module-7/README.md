# MERN-III — Module 7: Socket.IO, Email & Cloudinary

## What this module adds (on top of Module 6)
- Socket.IO server attached to http server
- Admin dashboard receives "newOrder" events in real time
- User receives "orderConfirmed" and "orderStatusChanged" events
- Nodemailer: order confirmation email on every checkout
- Nodemailer: password reset flow (forgot-password → email → reset)
- Cloudinary: product image upload (buffer → Cloudinary → secure_url)
- Password reset token: crypto.randomBytes → SHA-256 hash → DB, 10min expiry

## Setup
```bash
npm install && npm run seed && npm run db:seed && npm run dev
```

## Fill in .env:
- CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET → https://cloudinary.com/console
- SMTP_HOST / USER / PASS → https://mailtrap.io (dev) or real SMTP (prod)

## New API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/v1/auth/forgot-password | Public | Send reset email |
| POST | /api/v1/auth/reset-password | Public | Reset with token |
| POST | /api/v1/products/:id/image | Admin | Upload to Cloudinary |

## Socket.IO Events
| Event | Direction | Payload |
|-------|-----------|---------|
| join:admin | Client → Server | — |
| join:user | Client → Server | userId |
| newOrder | Server → admin-room | { order, timestamp } |
| orderConfirmed | Server → user room | { orderId, totalAmount } |
| orderStatusChanged | Server → user room | { orderId, status } |

## Frontend Wiring (MERN-II-wired/Module-7)
- hooks/useSocket.ts → real socket.io-client connection to backend
- Admin Dashboard LiveOrderFeed now receives genuine checkout events
