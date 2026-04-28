import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/productSchema.js";
import * as ctrl from "../controllers/productController.js";

const router = Router();

// Public
router.get("/", ctrl.getAllProducts);
router.get("/stats", ctrl.getProductStats);
router.get("/:id", ctrl.getProductById);

// Admin-only
router.post("/", protect, authorize("admin"), validate(CreateProductSchema), ctrl.createProduct);
router.put("/:id", protect, authorize("admin"), validate(UpdateProductSchema), ctrl.updateProduct);
router.delete("/:id", protect, authorize("admin"), ctrl.deleteProduct);

// Image upload (admin only, multipart/form-data, field name: "image")
router.post("/:id/image", protect, authorize("admin"), upload.single("image"), ctrl.uploadProductImage);

export default router;
