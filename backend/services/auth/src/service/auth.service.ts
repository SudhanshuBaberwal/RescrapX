import bcrypt from "bcrypt";
import crypto from "crypto";
import authRepository from "../repository/auth.repository.js";
import ApiError from "../lib/ApiError.js";
import jwtService from "../utils/jwt.js";
import sessionService from "../utils/session.js";
import { SignupDto } from "../validations/auth.validation.js";
import { UserRole } from "../models/user.model.js";

class AuthService {
  async signup(data: SignupDto) {
    // Normalize email
    const email = data.email.trim().toLowerCase();

    // Check existing user
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await authRepository.createUser({
      fullName: data.fullName,
      email,
      password: hashedPassword,
    });

    // Generate Session ID
    const sessionId = crypto.randomUUID();

    // Generate Tokens
    const accessToken = jwtService.generateAccessToken({
      userId: user.id,
      role: user.role as UserRole,
      sessionId,
    });

    const refreshToken = jwtService.generateRefreshToken({
      userId: user.id,
      role: user.role as UserRole,
      sessionId,
    });

    // Store Refresh Token Hash in Redis
    await sessionService.createSession(
      user.id,
      sessionId,
      refreshToken
    );

    // Update Last Login
    user.lastLogin = new Date();
    await user.save();

    return {
      user: user.toObject(), // password already removed automatically
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();