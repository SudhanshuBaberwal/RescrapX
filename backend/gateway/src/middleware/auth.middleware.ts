// import { NextFunction, Request, Response } from "express";
// import redis from "../../../services/auth/src/config/redis.ts";

// const SESSION_PREFIX = "session";
// const protect = async (req: Request, res: Response, next: NextFunction) => {
//   const userId = req.headers["x-user-id"] as string;
//   try {
//     const sessionId = req.cookies?.session;
//     if (!sessionId) {
//       return res.status(404).json({ success: false, message: "Unauthorized" });
//     }
//     const session = await redis.get(`${SESSION_PREFIX}:${userId}:${sessionId}`);
//     if (!session){
//         return res.status(500).json({success:false,message:"Session Expired"})
//     }
//     req.user = JSON.parse(session)
//     console.log("Gateway User:", req.user);
//     next()
//   } catch (error) {
//     console.log("Error in Auth Middleware : ", error);
//   }
// };

// export default protect;

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
    console.log("Gateway User :", req.user);

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};
