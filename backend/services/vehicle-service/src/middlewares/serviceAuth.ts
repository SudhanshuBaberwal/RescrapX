import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

const serviceAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const serviceKey = req.headers["x-service-key"];

  if (!serviceKey) {
    return res.status(401).json({
      success: false,
      message: "Service authentication required",
    });
  }

  if (serviceKey !== env.INTERNAL_SERVICE_TOKEN) {
    return res.status(401).json({
      success: false,
      message: "Invalid service key",
    });
  }

  next();
};

export default serviceAuth;