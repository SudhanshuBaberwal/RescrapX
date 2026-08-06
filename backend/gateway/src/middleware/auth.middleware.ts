import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import env from "../config/env.ts";

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
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
    if (!decoded) {
      return res
        .status(400)
        .json({ success: false, message: "Session Not Found" });
    }
    req.user = decoded;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};
