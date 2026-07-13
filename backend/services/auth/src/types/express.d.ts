import "express";
import { UserRole } from "../models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: UserRole;
        sessionId: string;
      };
    }
  }
}

export {};