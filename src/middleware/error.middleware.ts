import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(
    {
      err,
      method: req.method,
      path: req.path,
      stack: err?.stack,
    },
    "Request failed",
  );

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      err.message || "Internal server error",
  });
}