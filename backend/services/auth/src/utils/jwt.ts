import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserRole } from "../models/user.model.js";

interface JwtPayload {
  userId: string;
  role: UserRole;
  sessionId: string;
}
class jwtService {
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      env.JWT_ACCESS_SECRET as Secret,
      {
        expiresIn: env.ACCESS_TOKEN_EXPIRES,
      } as SignOptions,
    );
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      env.JWT_REFRESH_SECRET as Secret,
      {
        expiresIn: env.REFRESH_TOKEN_EXPIRES,
      } as SignOptions,
    );
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as JwtPayload;
  }

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as JwtPayload;
  }
}

export default new jwtService();
