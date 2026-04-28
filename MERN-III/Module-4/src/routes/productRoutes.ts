import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/productSchema.js";
import * as ctrl from "../controllers/productController.js";

const router = Router();

// Public routes
router.get("/", ctrl.getAllProducts);
router.get("/stats", ctrl.getProductStats);
router.get("/:id", ctrl.getProductById);

// Admin-only routes (requires valid JWT + admin role)
router.post("/", protect, authorize("admin"), validate(CreateProductSchema), ctrl.createProduct);
router.put("/:id", protect, authorize("admin"), validate(UpdateProductSchema), ctrl.updateProduct);
router.delete("/:id", protect, authorize("admin"), ctrl.deleteProduct);

export default router;
