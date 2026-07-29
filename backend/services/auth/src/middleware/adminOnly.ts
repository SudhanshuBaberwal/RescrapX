import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth-request.js";
import { UserRole } from "../models/user.model.js";
import ApiError from "../lib/ApiError.js";

const adminOnly = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (req.user.role !== UserRole.ADMIN) {
    throw new ApiError(403, "Only admin can access this resource");
  }

  next();
};

export default adminOnly;
