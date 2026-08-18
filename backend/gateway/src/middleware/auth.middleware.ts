import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
// Replace line 2 with:
import env from "../config/env.js";

export interface JwtUserPayload {
  userId: string;
  role: string;
  email: string;
}
export const protect = (
  req: Request & { user?: JwtUserPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;

    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};
