import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";
import { RegisterSchema, LoginSchema } from "../schemas/authSchema.js";
import * as ctrl from "../controllers/authController.js";

const router = Router();

// POST /api/v1/auth/register
router.post("/register", validate(RegisterSchema), ctrl.register);

// POST /api/v1/auth/login
router.post("/login", validate(LoginSchema), ctrl.login);

// POST /api/v1/auth/refresh  (reads refreshToken from HttpOnly cookie)
router.post("/refresh", ctrl.refresh);

// POST /api/v1/auth/logout
router.post("/logout", ctrl.logout);

// GET /api/v1/auth/me  (protected)
router.get("/me", protect, ctrl.getMe);

export default router;
