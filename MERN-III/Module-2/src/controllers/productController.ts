import type { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "../../products.json");

// ── File helpers ──────────────────────────────────────────────────────────────
async function readProducts(): Promise<Record<string, unknown>[]> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Record<string, unknown>[];
  } catch {
    return [];
  }
}

async function writeProducts(products: Record<string, unknown>[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf-8");
}

// ── GET /api/v1/products ──────────────────────────────────────────────────────
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await readProducts();
  const { category, sort, search, page = "1", limit = "12" } =
    req.query as Record<string, string>;

  let filtered = [...products];

  if (category && category !== "All") {
    filtered = filtered.filter((p) => p["category"] === category);
  }

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((p) => {
      const name = String(p["name"] ?? "").toLowerCase();
      const desc = String(p["description"] ?? "").toLowerCase();
      const cat  = String(p["category"] ?? "").toLowerCase();
      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }

  const sortMap: Record<string, (a: Record<string, unknown>, b: Record<string, unknown>) => number> = {
    "price-asc":    (a, b) => (a["price"] as number) - (b["price"] as number),
    "price-desc":   (a, b) => (b["price"] as number) - (a["price"] as number),
    "rating-desc":  (a, b) => (b["rating"] as number) - (a["rating"] as number),
    "reviews-desc": (a, b) => (b["reviewCount"] as number) - (a["reviewCount"] as number),
  };
  if (sort && sortMap[sort]) filtered.sort(sortMap[sort]);

  const pageNum  = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const total    = filtered.length;
  const pages    = Math.ceil(total / limitNum);
  const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    success: true,
    data: paginated,
    message: `${paginated.length} products`,
    pagination: { page: pageNum, limit: limitNum, total, pages },
  });
});

// ── GET /api/v1/products/stats ────────────────────────────────────────────────
export const getProductStats = asyncHandler(async (_req: Request, res: Response) => {
  const products = await readProducts();
  const statsMap: Record<string, { count: number; totalPrice: number }> = {};

  for (const p of products) {
    const cat = String(p["category"] ?? "Unknown");
    if (!statsMap[cat]) statsMap[cat] = { count: 0, totalPrice: 0 };
    statsMap[cat]!.count++;
    statsMap[cat]!.totalPrice += (p["price"] as number) ?? 0;
  }

  const stats = Object.entries(statsMap).map(([_id, val]) => ({
    _id,
    count: val.count,
    avgPrice: Math.round((val.totalPrice / val.count) * 100) / 100,
  }));

  res.json({ success: true, data: stats });
});

// ── GET /api/v1/products/:id ──────────────────────────────────────────────────
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const products = await readProducts();
  const product = products.find((p) => p["id"] === req.params["id"]);
  if (!product) throw new AppError("Product not found", 404);
  res.json({ success: true, data: product });
});

// ── POST /api/v1/products ─────────────────────────────────────────────────────
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const products = await readProducts();
  const newProduct = { id: uuidv4(), ...(req.body as object) };
  products.push(newProduct);
  await writeProducts(products);
  res.status(201).json({ success: true, data: newProduct });
});

// ── PUT /api/v1/products/:id ──────────────────────────────────────────────────
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const products = await readProducts();
  const idx = products.findIndex((p) => p["id"] === req.params["id"]);
  if (idx === -1) throw new AppError("Product not found", 404);
  products[idx] = { ...products[idx], ...(req.body as object) };
  await writeProducts(products);
  res.json({ success: true, data: products[idx] });
});

// ── DELETE /api/v1/products/:id ───────────────────────────────────────────────
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const products = await readProducts();
  const idx = products.findIndex((p) => p["id"] === req.params["id"]);
  if (idx === -1) throw new AppError("Product not found", 404);
  const [deleted] = products.splice(idx, 1);
  await writeProducts(products);
  res.json({ success: true, data: deleted });
});
