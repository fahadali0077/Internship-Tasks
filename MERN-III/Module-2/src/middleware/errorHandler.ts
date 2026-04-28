import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(process.env["NODE_ENV"] === "development" && { stack: err.stack }),
    });
    return;
  }

  console.error("💥 Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: process.env["NODE_ENV"] === "development"
      ? (err as Error)?.message ?? "Internal server error"
      : "Internal server error",
    code: "SERVER_ERROR",
  });
};
