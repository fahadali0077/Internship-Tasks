import type { Request, Response } from "express";
import { User } from "../models/User.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env["NODE_ENV"] === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ── POST /api/v1/auth/register ────────────────────────────────────────────────
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as { name: string; email: string; password: string };

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already registered", 409);

  const user = await User.create({ name, email, password });

  const accessToken  = signAccessToken(user.id as string, user.role);
  const refreshToken = signRefreshToken(user.id as string);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  res.status(201).json({
    success: true,
    data: { user, accessToken },
    message: "Account created successfully",
  });
});

// ── POST /api/v1/auth/login ───────────────────────────────────────────────────
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  // select: false fields must be explicitly requested
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user || !(await (user as { comparePassword(p: string): Promise<boolean> }).comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken  = signAccessToken(user.id as string, user.role);
  const refreshToken = signRefreshToken(user.id as string);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  res.json({
    success: true,
    data: { user, accessToken },
    message: "Welcome back!",
  });
});

// ── POST /api/v1/auth/refresh ─────────────────────────────────────────────────
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = (req.cookies as Record<string, string>)?.["refreshToken"];
  if (!token) throw new AppError("No refresh token provided", 401);

  const { userId } = verifyRefreshToken(token);
  const user = await User.findById(userId).select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    throw new AppError("Invalid refresh token. Please log in again.", 401);
  }

  // Rotate tokens — issue both new access + refresh
  const newAccessToken  = signAccessToken(user.id as string, user.role);
  const newRefreshToken = signRefreshToken(user.id as string);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
  res.json({ success: true, data: { accessToken: newAccessToken } });
});

// ── POST /api/v1/auth/logout ──────────────────────────────────────────────────
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = (req.cookies as Record<string, string>)?.["refreshToken"];
  if (token) {
    await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
  }
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out successfully" });
});

// ── GET /api/v1/auth/me ───────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId).lean();
  if (!user) throw new AppError("User not found", 404);
  res.json({ success: true, data: user });
});
