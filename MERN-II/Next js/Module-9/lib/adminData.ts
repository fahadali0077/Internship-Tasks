export interface StatCard {
  label: string;
  value: string;
  change: number;      // % change from last period (positive = up)
  icon: string;
  color: string;
}

export interface RevenuePoint {
  date: string;        // "Jan", "Feb", etc.
  revenue: number;
  orders: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;   // ISO timestamp
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  rating: number;
  badge?: string;
}

// ── Stat cards ────────────────────────────────────────────────────────────────
export const STAT_CARDS: StatCard[] = [
  { label: "Revenue", value: "$48,295", change: +12.4, icon: "💰", color: "#d97706" },
  { label: "Orders", value: "1,284", change: +8.1, icon: "📦", color: "#2563eb" },
  { label: "Users", value: "3,401", change: +23.5, icon: "👤", color: "#16a34a" },
  { label: "In Stock", value: "892", change: -4.2, icon: "🏷️", color: "#dc2626" },
];

// ── Revenue chart data (last 8 months) ────────────────────────────────────────
export const REVENUE_DATA: RevenuePoint[] = [
  { date: "Jul", revenue: 22000, orders: 540 },
  { date: "Aug", revenue: 28000, orders: 710 },
  { date: "Sep", revenue: 25000, orders: 630 },
  { date: "Oct", revenue: 34000, orders: 890 },
  { date: "Nov", revenue: 38000, orders: 980 },
  { date: "Dec", revenue: 52000, orders: 1340 },
  { date: "Jan", revenue: 41000, orders: 1050 },
  { date: "Feb", revenue: 48295, orders: 1284 },
];

// ── Products table data ───────────────────────────────────────────────────────
export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: "p-001", name: "Sony WH-1000XM5 Headphones", category: "Electronics", price: 279.99, stock: 45, sold: 234, rating: 4.8, badge: "Sale" },
  { id: "p-002", name: "Minimal Linen Shirt — Cream", category: "Fashion", price: 59.99, stock: 120, sold: 89, rating: 4.5, badge: "New" },
  { id: "p-003", name: "Cast Iron Skillet 10-inch", category: "Home & Kitchen", price: 44.95, stock: 78, sold: 512, rating: 4.9, badge: "Hot" },
  { id: "p-004", name: "Atomic Habits — James Clear", category: "Books", price: 14.99, stock: 200, sold: 1890, rating: 4.7 },
  { id: "p-005", name: "Logitech MX Master 3S Mouse", category: "Electronics", price: 99.99, stock: 32, sold: 320, rating: 4.6, badge: "New" },
  { id: "p-006", name: "Yoga Mat — Non-Slip Pro", category: "Sports", price: 39.99, stock: 67, sold: 67, rating: 4.4 },
  { id: "p-007", name: "Kindle Paperwhite 11th Gen", category: "Electronics", price: 139.99, stock: 28, sold: 982, rating: 4.7, badge: "Sale" },
  { id: "p-008", name: "Chelsea Leather Boots — Black", category: "Fashion", price: 189.00, stock: 15, sold: 44, rating: 4.3 },
  { id: "p-009", name: "Aeropress Coffee Maker", category: "Home & Kitchen", price: 34.99, stock: 90, sold: 710, rating: 4.8, badge: "Hot" },
  { id: "p-010", name: "Clean Code — Robert C. Martin", category: "Books", price: 34.99, stock: 150, sold: 1125, rating: 4.5 },
  { id: "p-011", name: "Resistance Bands Set (5-pack)", category: "Sports", price: 24.99, stock: 55, sold: 298, rating: 4.2, badge: "New" },
  { id: "p-012", name: "Samsung 27\" 4K Monitor", category: "Electronics", price: 329.99, stock: 12, sold: 154, rating: 4.6, badge: "Sale" },
];

// ── Mock live orders (used by useSocket) ──────────────────────────────────────
const CUSTOMERS = ["Fahad A.", "Sara K.", "Ali R.", "Zara A.", "Omar B.", "Hina S."];
const PRODUCTS = ADMIN_PRODUCTS.map((p) => p.name.slice(0, 28));
const STATUSES: AdminOrder["status"][] = ["pending", "processing"];

let orderCounter = 1000;

export function generateMockOrder(): AdminOrder {
  return {
    id: `ORD-${++orderCounter}`,
    customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)] ?? "Unknown",
    product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)] ?? "Unknown",
    amount: Math.round((Math.random() * 350 + 15) * 100) / 100,
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)] ?? "pending",
    createdAt: new Date().toISOString(),
  };
}
