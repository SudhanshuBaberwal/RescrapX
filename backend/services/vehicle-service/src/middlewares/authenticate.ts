import { NextFunction, Request, Response } from "express";
import ApiError from "../lib/ApiError.js";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const userId = req.headers["x-user-id"] as string;

  const role = req.headers["x-user-role"] as string;

  const email = req.headers["x-user-email"] as string;

  if (!userId) {
    return next(new ApiError(401, "Unauthorized"));
  }

  req.user = {
    userId,
    role,
    email,
  };

  next();
};