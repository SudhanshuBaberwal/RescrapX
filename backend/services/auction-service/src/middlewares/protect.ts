import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../lib/ApiError.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";

interface JwtPayload {
  userId: string;
  role: string;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

const protect = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Authorization header missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Invalid authorization format");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Token missing");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    console.log("JWT decoded:", decoded);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    console.log("req.user:", req.user);

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired token");
  }
};

export default protect;