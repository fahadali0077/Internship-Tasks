import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/productSchema.js";
import * as ctrl from "../controllers/productController.js";
import * as reviewCtrl from "../controllers/reviewController.js";

const router = Router();

// Public
router.get("/", ctrl.getAllProducts);
router.get("/stats", ctrl.getProductStats);
router.get("/:id", ctrl.getProductById);
router.get("/:id/reviews", reviewCtrl.getProductReviews);

// Authenticated — create review
router.post("/:id/reviews", protect, reviewCtrl.createReview);
router.delete("/:id/reviews/:reviewId", protect, reviewCtrl.deleteReview);

// Admin-only
router.post("/", protect, authorize("admin"), validate(CreateProductSchema), ctrl.createProduct);
router.put("/:id", protect, authorize("admin"), validate(UpdateProductSchema), ctrl.updateProduct);
router.delete("/:id", protect, authorize("admin"), ctrl.deleteProduct);
router.post("/:id/image", protect, authorize("admin"), upload.single("image"), ctrl.uploadProductImage);

export default router;
