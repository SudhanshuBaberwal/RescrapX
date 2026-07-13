import bcrypt from "bcrypt";
import crypto from "crypto";
import authRepository from "../repository/auth.repository.js";
import ApiError from "../lib/ApiError.js";
import jwtService from "../utils/jwt.js";
import sessionService from "../utils/session.js";
import {
  LoginDto,
  SignupDto,
  VerifyOtpDto,
} from "../validations/auth.validation.js";
import User, { UserRole } from "../models/user.model.js";
import notificationClient from "../clients/notification.client.js";

class AuthService {
  async signup(data: SignupDto) {
    const email = data.email.trim().toLowerCase();
    const existingUser = await authRepository.findByEmail(email);
    const fullName = data.fullName;
    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await notificationClient.post("/email/verification", {
      email,
      fullName,
      otp,
    });

    const verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const user = await authRepository.createUser({
      fullName: data.fullName,
      email,
      password: hashedPassword,
      verificationToken: otp,
      verificationTokenExpiresAt,
    });
    return user;
  }

  async verifyOTP(data: VerifyOtpDto) {
    const email = data.email;
    const otp = data.otp;
    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }

    const user = await authRepository.findByEmail(email.trim().toLowerCase());

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400, "Email already verified");
    }

    if (!user.verificationToken) {
      throw new ApiError(400, "OTP not found");
    }

    if (
      !user.verificationTokenExpiresAt ||
      user.verificationTokenExpiresAt < new Date()
    ) {
      throw new ApiError(400, "OTP has expired");
    }

    if (otp !== user.verificationToken) {
      throw new ApiError(400, "Invalid OTP");
    }

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
    await sessionService.createSession(user.id, sessionId, refreshToken);

    // Update Last Login
    user.lastLogin = new Date();
    // await user.save();

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    // return user;
    return {
      user: user.toObject(), // password already removed automatically
      accessToken,
      refreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User Not Found");
    }
    return user.toObject();
  }

  async login(data: LoginDto) {
    const email = data.email.trim().toLowerCase();
    const password = data.password;
    if (!email || !password) {
      throw new ApiError(400, "Please Fill All The Fields");
    }
    const user = await authRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new ApiError(401, "User Not Found");
    }

    if (!user.isVerified) {
      throw new ApiError(400, "User Not Verified");
    }
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    const sessionId = crypto.randomUUID();
    const refreshToken = jwtService.generateRefreshToken({
      userId: user.id,
      role: user.role as UserRole,
      sessionId,
    });
    const accessToken = jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      sessionId,
    });
    await sessionService.createSession(user.id, sessionId, refreshToken);
    user.lastLogin = new Date();
    await user.save();
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId:string,sessionId:string){
    await sessionService.deleteSession(userId,sessionId)
    return {success:true}
  }
}

export default new AuthService();
