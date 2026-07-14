import bcrypt from "bcrypt";
import crypto from "crypto";
import authRepository from "../repository/auth.repository.js";
import ApiError from "../lib/ApiError.js";
import jwtService from "../utils/jwt.js";
import sessionService from "../utils/session.js";
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
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

  async logout(userId: string, sessionId: string) {
    await sessionService.deleteSession(userId, sessionId);
    return { success: true };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    // 1. Verify Refresh JWT
    const decoded = jwtService.verifyRefreshToken(refreshToken);

    // 2. Verify Session in Redis
    const isValidSession = await sessionService.verifySession(
      decoded.userId,
      decoded.sessionId,
      refreshToken,
    );

    if (!isValidSession) {
      throw new ApiError(401, "Invalid session");
    }

    // 3. Fetch User
    const user = await authRepository.findById(decoded.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isVerified) {
      throw new ApiError(401, "User is not verified");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account has been disabled");
    }

    // 4. Generate New Tokens
    const newAccessToken = jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      sessionId: decoded.sessionId,
    });

    const newRefreshToken = jwtService.generateRefreshToken({
      userId: user.id,
      role: user.role,
      sessionId: decoded.sessionId,
    });

    // 5. Refresh Token Rotation
    await sessionService.updateSession(
      user.id,
      decoded.sessionId,
      newRefreshToken,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const email = data.email.trim().toLowerCase();
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email first");
    }
    console.log("Before:", user);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    console.log("OTP Before Save:", user.resetPasswordToken);

    const savedUser = await authRepository.save(user);
    console.log("After Save:", savedUser);

    await notificationClient.post("/email/forgot-password", {
      email: user.email,
      fullName: user.fullName,
      otp,
    });
    return { message: "Password reset OTP sent successfully" };
  }

  async resetPassword(data: ResetPasswordDto) {
    const email = data.email.trim().toLowerCase();
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (!user.resetPasswordToken) {
      throw new ApiError(400, "OTP Not found");
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new ApiError(400, "Otp has expired");
    }

    if (user.resetPasswordToken !== data.otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    // All fields are correct now hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await authRepository.save(user);
    await sessionService.deleteAllSessions(user.id);
    await notificationClient.post("/email/password-changed", {
      email: user.email,
      fullName: user.fullName,
    });
    return {
      message: "Password reset successfully",
    };
  }
}

export default new AuthService();
