import { Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler.js";
import ApiResponse from "../lib/ApiResponse.js";
import authService from "../service/auth.service.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/cookies.js";
import { AuthRequest } from "../types/auth-request.js";

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
