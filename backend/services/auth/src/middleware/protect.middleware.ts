import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../config/env.js";
import ApiError from "../lib/ApiError.js";
import { UserRole } from "../models/user.model.js";
import { AuthRequest } from "../types/auth-request.js";

const protect = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Access token from cookies
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Access token not found");
    }

    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    ) as JwtPayload & {
      userId: string;
      role: UserRole;
      sessionId: string;
    };

    if (!decoded.userId || !decoded.sessionId) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role,
      sessionId: decoded.sessionId,
    };

    next();
  } catch (error) {
    next(new ApiError(401, "Unauthorized"));
  }
};

export default protect;