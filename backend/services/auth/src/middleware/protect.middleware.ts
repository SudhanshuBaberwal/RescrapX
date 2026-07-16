import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../config/env.js";
import ApiError from "../lib/ApiError.js";
import { UserRole } from "../models/user.model.js";
import { AuthRequest } from "../types/auth-request.js";
const protect = (req: AuthRequest, _res: Response, next: NextFunction) => {
  console.log("==================================");
  console.log("URL:", req.method, req.originalUrl);
  console.log("Cookies:", req.cookies);

  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      console.log("❌ No Access Token");
      return next(new ApiError(401, "Unauthorized"));
    }

    console.log("✅ Access Token Found");

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload & {
      userId: string;
      role: UserRole;
      sessionId: string;
    };

    req.user = {
      id: decoded.userId,
      role: decoded.role,
      sessionId: decoded.sessionId,
    };

    next();
  } catch (err) {
    console.log("JWT ERROR:", err);
    next(new ApiError(401, "Unauthorized"));
  }
};

export default protect