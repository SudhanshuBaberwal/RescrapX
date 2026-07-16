import bcrypt from "bcrypt";
import crypto from "crypto";
import authRepository from "../repository/auth.repository.js";
import ApiError from "../lib/ApiError.js";
import jwtService from "../utils/jwt.js";
import sessionService from "../utils/session.js";
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  ResendVerificationDto,
  ResetPasswordDto,
  RoleDto,
  SignupDto,
  VerifyOtpDto,
} from "../validations/auth.validation.js";
import User, { IUser, PartnerNextStep, PartnerStatus, UserRole } from "../models/user.model.js";
import notificationClient from "../clients/notification.client.js";
// import googleClient from "../providers/google.js";
import { GoogleLoginDto } from "../validations/auth.validation.js";
import { AuthProvider } from "../models/user.model.js";
import googleClient from "../providers/google.js";
import { env } from "../config/env.js";
import { PartnerSignupDto } from "../validations/partner.validation.js";

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

    const verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const user = await authRepository.createUser({
      fullName: data.fullName,
      email,
      password: hashedPassword,
      verificationToken: otp,
      verificationTokenExpiresAt,
    });
    await notificationClient.post("/email/verification", {
      email,
      fullName,
      otp,
    });
    return user;
  }
  async getCurrentUser(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User Not Found");
    }
    return user.toObject();
  }

  async logout(userId: string, sessionId: string) {
    await sessionService.deleteSession(userId, sessionId);
    return { success: true };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    // Verify JWT
    const decoded = jwtService.verifyRefreshToken(refreshToken);

    // Verify Redis Session
    const isValidSession = await sessionService.verifySession(
      decoded.userId,
      decoded.sessionId,
      refreshToken,
    );

    if (!isValidSession) {
      throw new ApiError(401, "Invalid session");
    }

    // Find User
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

    // Reuse same session (Refresh Token Rotation)
    return await this.createAuthSession(user, decoded.sessionId);
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

    const savedUser = await authRepository.save(user);

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

  async changePassword(userId: string, data: ChangePasswordDto) {
    const user = await authRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.password) {
      throw new ApiError(
        400,
        "Password is not set for this account. Please login using Google.",
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.oldPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Old password is incorrect");
    }

    const isSamePassword = await bcrypt.compare(
      data.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new ApiError(400, "New password cannot be same as old password");
    }

    user.password = await bcrypt.hash(data.newPassword, 12);

    await authRepository.save(user);

    // Logout From Every Device
    await sessionService.deleteAllSessions(user.id);

    // Email Notification
    try {
      await notificationClient.post("/email/password-changed", {
        email: user.email,
        fullName: user.fullName,
      });
    } catch (err) {
      console.error(err);
    }

    return {
      message: "Password changed successfully. Please login again.",
    };
  }

  async resendVerificationOtp(data: ResendVerificationDto) {
    const email = data.email.trim().toLowerCase();

    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400, "Email already verified");
    }

    // 60 sec cooldown
    if (
      user.verificationOtpSentAt &&
      Date.now() - user.verificationOtpSentAt.getTime() < 60 * 1000
    ) {
      throw new ApiError(
        429,
        "Please wait 60 seconds before requesting another OTP.",
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationToken = otp;
    user.verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationOtpSentAt = new Date();

    await authRepository.save(user);

    await notificationClient.post("/email/verification", {
      email: user.email,
      fullName: user.fullName,
      otp,
    });

    return {
      message: "Verification OTP sent successfully",
    };
  }

  async logoutAll(userId: string) {
    await sessionService.deleteAllSessions(userId);

    return {
      message: "Logged out from all devices successfully",
    };
  }

  private async createAuthSession(user: IUser, sessionId?: string) {
    const userId = user._id.toString();

    const currentSessionId = sessionId ?? crypto.randomUUID();

    const accessToken = jwtService.generateAccessToken({
      userId,
      role: user.role,
      sessionId: currentSessionId,
    });

    const refreshToken = jwtService.generateRefreshToken({
      userId,
      role: user.role,
      sessionId: currentSessionId,
    });

    if (sessionId) {
      await sessionService.updateSession(
        userId,
        currentSessionId,
        refreshToken,
      );
    } else {
      await sessionService.createSession(
        userId,
        currentSessionId,
        refreshToken,
      );
    }

    user.lastLogin = new Date();

    await authRepository.save(user);

    return {
      user: user.toObject(),
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginDto) {
    const email = data.email.trim().toLowerCase();

    const password = data.password;

    if (!email || !password) {
      throw new ApiError(400, "Please fill all fields");
    }

    const user = await authRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isVerified) {
      throw new ApiError(400, "User not verified");
    }

    if (!user.password) {
      throw new ApiError(404, "Password is Not Assignable to this account");
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    return await this.createAuthSession(user);
  }

  async verifyOTP(data: VerifyOtpDto) {
    const email = data.email.trim().toLowerCase();
    const otp = data.otp;

    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }

    const user = await authRepository.findByEmail(email);

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

    if (user.verificationToken !== otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    // Verify user
    user.isVerified = true;

    // Clear verification fields
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    // Create session + JWT + Redis
    return await this.createAuthSession(user);
  }

  async googleLogin(data: GoogleLoginDto) {
    const { token } = data;

    // Verify Google ID Token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new ApiError(401, "Invalid Google token");
    }

    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email) {
      throw new ApiError(400, "Google account has no email");
    }

    if (!email_verified) {
      throw new ApiError(400, "Google email is not verified");
    }

    // Find by Google ID
    let user = await authRepository.findByGoogleId(googleId);

    if (user) {
      if (!user.isActive) {
        throw new ApiError(403, "Account has been disabled");
      }

      return this.createAuthSession(user);
    }

    // Find existing LOCAL account with same email
    user = await authRepository.findByEmail(email);

    if (user) {
      if (!user.isActive) {
        throw new ApiError(403, "Account has been disabled");
      }

      // Link Google Account
      user.googleId = googleId;
      user.provider = AuthProvider.GOOGLE;

      if (!user.avatar && picture) {
        user.avatar = picture;
      }

      await authRepository.save(user);

      return this.createAuthSession(user);
    }

    // Create New Google User
    user = await authRepository.createUser({
      fullName: name || "Google User",
      email,
      avatar: picture || "",
      googleId,
      provider: AuthProvider.GOOGLE,
      isVerified: true,
    });

    return this.createAuthSession(user);
  }

  async partnerSignup(data: PartnerSignupDto, usreId: string) {
    const existingUser = await authRepository.findById(usreId);

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }
    const user = await authRepository.updatePartner(usreId,{
      phoneNumber: data.phoneNumber,
      partnerStatus: PartnerStatus.UNDER_REVIEW,
      partnerNextStep:PartnerNextStep.UPLOAD_DOCUMENTS,
      company: {
        companyName: data.companyName,
        gstNumber: data.gstNumber,
        panNumber: data.panNumber,
        registrationNumber: data.registrationNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
    });
    return user;
  }

  async setRole(userId: string, data: RoleDto) {
    if (!userId) {
      throw new ApiError(404, "User not found");
    }

    if (!data?.role) {
      throw new ApiError(400, "Role is required");
    }

    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // ✅ Check roleSelected instead of role
    if (user.roleSelected) {
      throw new ApiError(
        400,
        "Role has already been selected and cannot be changed.",
      );
    }

    // Only one admin allowed
    if (data.role === UserRole.ADMIN) {
      const existingAdmin = await authRepository.findAdmin();

      if (existingAdmin) {
        throw new ApiError(400, "Admin account already exists.");
      }
    }

    console.log("Incoming Role:", data.role);

    const updatedUser = await authRepository.findByIdAndUpdate(userId, {
      role: data.role,
      roleSelected: true,
      ...(data.role === UserRole.PARTNER && {
        partnerStatus: PartnerStatus.PENDING,
      }),
    });

    console.log("Updated User:", updatedUser);

    if (!updatedUser) {
      throw new ApiError(500, "failed to update user");
    }
    console.log(updatedUser);
    return updatedUser;
  }
}

export default new AuthService();
