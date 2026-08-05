import { Response, NextFunction, Request } from "express";
import ApiError from "../lib/ApiError.js";
import AuthenticatedRequest from "../types/AuthenticatedRequest.js";

const adminOnly = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const role = req.headers["x-user-role"] as string;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    if (role !== "ADMIN") {
      throw new ApiError(403, "Only admin can access this resource");
    }
    next();
  } catch (error) {
    throw new ApiError(500, "Only Admin Can Access This Route");
    console.log(error);
  }
};

export default adminOnly;
