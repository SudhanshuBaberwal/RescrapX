import { Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler.js";
import ApiResponse from "../lib/ApiResponse.js";
import authService from "../service/auth.service.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/cookies.js";
import { AuthRequest } from "../types/auth-request.js";
import ApiError from "../lib/ApiError.js";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);
  return ApiResponse.success(res, 201, "Signup Successful", {
    user: result,
  });
});

export const verifyOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.verifyOTP(req.body);
    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
    return ApiResponse.success(
      res,
      201,
      "User Created Successfully",
      result.user,
    );
  },
);
export const getCurrentUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await authService.getCurrentUser(req.user.id);

    return ApiResponse.success(
      res,
      200,
      "Current user fetched successfully",
      user,
    );
  },
);

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.cookie("accessToken", result.accessToken, accessCookieOptions);
  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
  return ApiResponse.success(res, 200, "Login Successful", result.user);
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await authService.logout(req.user.id, req.user.sessionId);

  res.clearCookie("accessToken", accessCookieOptions);

  res.clearCookie("refreshToken", refreshCookieOptions);

  return ApiResponse.success(res, 200, "Logged out successfully");
});

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token not found");
    }

    const tokens = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", tokens.accessToken, accessCookieOptions);

    res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

    return ApiResponse.success(res, 200, "Token refreshed successfully");
  },
);

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  return ApiResponse.success(res, 200, result.message);
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  return ApiResponse.success(res, 200, result.message);
});

export const changePasswordController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await authService.changePassword(req.user.id, req.body);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return ApiResponse.success(res, 200, result.message);
  },
);

export const resendVerificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.resendVerificationOtp(req.body);

    return ApiResponse.success(res, 200, result.message);
  },
);

export const logoutAllController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await authService.logoutAll(req.user.id);

    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);

    return ApiResponse.success(res, 200, result.message);
  },
);

export const googleLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.googleLogin(req.body);

    res.cookie("accessToken", result.accessToken, accessCookieOptions);

    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

    return ApiResponse.success(
      res,
      200,
      "Google login successful",
      result.user,
    );
  },
);

export const partnerSignupController = asyncHandler(async (req, res) => {
  const result = await authService.partnerSignup(req.body);

  return ApiResponse.success(
    res,
    201,
    "Partner registered successfully. Please verify your email.",
    result,
  );
});
