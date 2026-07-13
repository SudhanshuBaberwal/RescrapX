import { NextFunction, Request, Response } from "express";
import ApiError from "../lib/ApiError.js";

const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode =
    err instanceof ApiError ? err.statusCode : 500;

  const message =
    err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors:
      err instanceof ApiError ? err.errors : null,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
    timestamp: new Date().toISOString(),
  });
};

export default errorHandler;