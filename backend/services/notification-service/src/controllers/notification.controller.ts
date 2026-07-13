import { Request, Response } from "express";

import asyncHandler from "../lib/asysnHandler.js";
import ApiResponse from "../lib/ApiResponse.js";

import notificationService from "../services/notification.service.js";

class NotificationController {
  sendVerificationEmail = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, fullName, otp } = req.body;

      await notificationService.sendVerificationEmail(
        email,
        fullName,
        otp
      );

      return ApiResponse.success(res, {
        statusCode: 200,
        message: "Verification email sent successfully",
      });
    }
  );

  sendWelcomeEmail = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, fullName } = req.body;

      await notificationService.sendWelcomeEmail(
        email,
        fullName
      );

      return ApiResponse.success(res, {
        statusCode: 200,
        message: "Welcome email sent successfully",
      });
    }
  );

  sendForgotPasswordEmail = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, fullName, otp } = req.body;

      await notificationService.sendForgotPasswordEmail(
        email,
        fullName,
        otp
      );

      return ApiResponse.success(res, {
        statusCode: 200,
        message: "Forgot password email sent successfully",
      });
    }
  );

  sendPasswordChangedEmail = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, fullName } = req.body;

      await notificationService.sendPasswordChangedEmail(
        email,
        fullName
      );

      return ApiResponse.success(res, {
        statusCode: 200,
        message: "Password changed email sent successfully",
      });
    }
  );
}

export default new NotificationController();