import { Request, Response } from "express";

import asyncHandler from "../lib/asysnHandler.js";
import ApiResponse from "../lib/ApiResponse.js";
import notificationService from "../services/notification.service.js";

const isValidEmail = (email: unknown): email is string =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidOtp = (otp: unknown): otp is string =>
  typeof otp === "string" && /^\d{6}$/.test(otp);

const requireEmail = (email: unknown): string => {
  if (!isValidEmail(email)) {
    throw new Error("A valid email address is required");
  }

  return email.trim().toLowerCase();
};

const requireFullName = (fullName: unknown): string => {
  if (typeof fullName !== "string" || !fullName.trim()) {
    throw new Error("Full name is required");
  }

  return fullName.trim();
};

const requireOtp = (otp: unknown): string => {
  if (!isValidOtp(otp)) {
    throw new Error("OTP must be a 6-digit string");
  }

  return otp;
};

class NotificationController {

  sendVerificationEmail = asyncHandler(
    async (req: Request, res: Response) => {
      const email = requireEmail(req.body?.email);
      const fullName = requireFullName(req.body?.fullName);
      const otp = requireOtp(req.body?.otp);

      await notificationService.sendVerificationEmail(
        email,
        fullName,
        otp,
      );

      return ApiResponse.success(res, {
        statusCode: 200,
        message: "Verification email sent successfully",
      });
    },
  );

  /**
   * Send the welcome email after account creation/verification.
   */
  sendWelcomeEmail = asyncHandler(async (req: Request, res: Response) => {
    const email = requireEmail(req.body?.email);
    const fullName = requireFullName(req.body?.fullName);

    await notificationService.sendWelcomeEmail(email, fullName);

    return ApiResponse.success(res, {
      statusCode: 200,
      message: "Welcome email sent successfully",
    });
  });

  /**
   * Send the forgot-password OTP.
   */
  sendForgotPasswordEmail = asyncHandler(
    async (req: Request, res: Response) => {
      const email = requireEmail(req.body?.email);
      const fullName = requireFullName(req.body?.fullName);
      const otp = requireOtp(req.body?.otp);

      await notificationService.sendForgotPasswordEmail(
        email,
        fullName,
        otp,
      );

      return ApiResponse.success(res, {
        statusCode: 200,
        message: "Forgot-password email sent successfully",
      });
    },
  );

  /**
   * Send password-change confirmation.
   */
  sendPasswordChangedEmail = asyncHandler(
    async (req: Request, res: Response) => {
      const email = requireEmail(req.body?.email);
      const fullName = requireFullName(req.body?.fullName);

      await notificationService.sendPasswordChangedEmail(email, fullName);

      return ApiResponse.success(res, {
        statusCode: 200,
        message: "Password-change confirmation email sent successfully",
      });
    },
  );

  /**
   * Generic OTP email endpoint.
   *
   * Expected body:
   * {
   *   "email": "user@example.com",
   *   "otp": "123456"
   * }
   */
  sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const email = requireEmail(req.body?.email);
    const otp = requireOtp(req.body?.otp);

    await notificationService.sendOtpEmail(email, otp);

    return ApiResponse.success(res, {
      statusCode: 200,
      message: "OTP email sent successfully",
    });
  });
}

export default new NotificationController();