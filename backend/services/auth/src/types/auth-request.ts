import { Request } from "express";
import { UserRole } from "../models/user.model.js";

export interface AuthRequest extends Request {
  user: {
    id: string;
    role: UserRole;
    sessionId: string;
  };
}