import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/productSchema.js";
import * as ctrl from "../controllers/productController.js";

const router = Router();

// GET /api/v1/products         — list all (paginated, filtered, sorted, searched)
router.get("/", ctrl.getAllProducts);

// GET /api/v1/products/stats   — category breakdown (must be BEFORE /:id)
router.get("/stats", ctrl.getProductStats);

// GET /api/v1/products/:id     — single product
router.get("/:id", ctrl.getProductById);

// POST /api/v1/products        — create (Zod validated)
router.post("/", validate(CreateProductSchema), ctrl.createProduct);

// PUT /api/v1/products/:id     — update (Zod validated, partial)
router.put("/:id", validate(UpdateProductSchema), ctrl.updateProduct);

// DELETE /api/v1/products/:id  — delete
router.delete("/:id", ctrl.deleteProduct);

export default router;
