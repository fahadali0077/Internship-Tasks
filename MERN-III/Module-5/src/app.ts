import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── GZIP compression ──────────────────────────────────────────────────────────
app.use(compression());

// ── Rate limiting: 100 req / 15 min per IP ────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please slow down.", code: "RATE_LIMITED" },
});

// Stricter limit for auth routes: 10 req / 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: "Too many auth attempts. Please try again later.", code: "RATE_LIMITED" },
});

app.use("/api/", limiter);
app.use("/api/v1/auth/", authLimiter);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env["FRONTEND_URL"] ?? "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ── NoSQL injection prevention ────────────────────────────────────────────────
app.use(mongoSanitize());

// ── HTTP parameter pollution prevention ──────────────────────────────────────
app.use(hpp());

// ── Logging ───────────────────────────────────────────────────────────────────
if (process.env["NODE_ENV"] !== "test") app.use(morgan("dev"));
app.use(requestLogger);

// ── Static uploads ────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    module: "Module 5 — Security Hardened API",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found", code: "NOT_FOUND" });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
