import { Response, NextFunction } from "express";
import ApiError from "../lib/ApiError.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";

const adminOnly = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Only admin can access this resource");
  }

  next();
};

export default adminOnly;
