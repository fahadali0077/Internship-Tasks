# MERN-II · Module 9 — Admin Dashboard + Live Order Feed

> **Stack:** Next.js 15 · Recharts · TanStack Table · Socket.IO (mock) · Framer Motion · cmdk

## Quick Start

```bash
npm install
npm run dev
# Visit http://localhost:3000/admin → redirected to /admin/login
# Click "Sign in" → admin dashboard loads
```

## Requirements → Implementation

| Requirement | File |
|---|---|
| Admin layout at /admin: sidebar + header | `app/admin/layout.tsx` |
| Protected via middleware | `middleware.ts` (admin_session cookie) |
| Stat cards with Recharts AreaChart | `components/admin/StatCards.tsx` + `RevenueChart.tsx` |
| TanStack Table: sort/filter/paginate | `components/admin/ProductsTable.tsx` |
| useSocket hook: mock live orders | `hooks/useSocket.ts` |
| Live order feed with Framer Motion | `components/admin/LiveOrderFeed.tsx` |
| Cmd+K command palette with cmdk | `components/admin/CommandPalette.tsx` |

## Mental Models

### Admin protection via middleware

```
GET /admin → middleware.ts
  request.cookies.get("admin_session")
  ├─ cookie exists → allow → AdminLayout renders
  └─ no cookie    → redirect /admin/login?from=/admin
```

### useSocket — mock + real pattern

```ts
// Mock (Module 9):
setInterval(() => { onOrder(generateMockOrder()); }, 3000–6000ms)

// Real (MERN-III):
import { io } from "socket.io-client";
const socket = io("https://api.mernshop.com");
socket.on("order:new", onOrder);
return () => { socket.off("order:new", onOrder); socket.disconnect(); }
```
Same hook API — only the internals change.

### TanStack Table — headless principle

```ts
const table = useReactTable({
  data: products,    // raw data
  columns,           // column definitions
  getCoreRowModel(), getSortedRowModel(), getFilteredRowModel(), getPaginationRowModel(),
});
// table provides state + logic, YOU provide ALL the markup
table.getHeaderGroups() → render <thead>
table.getRowModel().rows → render <tbody>
table.nextPage()         → pagination
```

### AnimatePresence + layout for live feed

```tsx
<AnimatePresence initial={false}>
  {orders.map((order) => (
    <motion.div
      key={order.id}
      layout              // existing items animate downward
      initial={{ x: -24, opacity: 0, height: 0 }}
      animate={{ x: 0, opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    />
  ))}
</AnimatePresence>
```

## Verification Checklist

- [ ] `/admin` without cookie → redirected to `/admin/login`
- [ ] Click "Sign in" → `admin_session` cookie set → /admin loads
- [ ] Stat cards animate in with staggered delay
- [ ] Revenue chart renders with gradient fills
- [ ] DevTools: `admin_session` cookie appears under Application → Cookies
- [ ] Products table: click "Price" header → sorts ascending then descending
- [ ] Products table: select "Electronics" → filters to 4 products
- [ ] Products table: search "Sony" → shows 1 result
- [ ] Live order feed: wait 3–6s → new order slides in from left
- [ ] Feed shows "Live" badge with green dot when connected
- [ ] Press **Cmd+K** (Mac) or **Ctrl+K** (Win) → command palette opens
- [ ] Type "prod" in palette → "Products Table" highlighted
- [ ] Press Enter → navigates to /admin/products
- [ ] Press Escape → palette closes
- [ ] Sidebar highlights active route (amber background)
- [ ] Mobile: hamburger menu opens sidebar overlay
- [ ] `npm run type-check` → no output
