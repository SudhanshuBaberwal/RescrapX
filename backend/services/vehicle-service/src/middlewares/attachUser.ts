import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const attachUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  req.user = {
    userId: req.headers["x-user-id"] as string,
    role: req.headers["x-user-role"] as string,
  };

  next();
};