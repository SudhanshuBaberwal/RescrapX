import { Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler.js";
import ApiResponse from "../lib/ApiResponse.js";
import authService from "../service/auth.service.js";
import { refreshCookieOptions } from "../utils/cookies.js";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  return ApiResponse.success(res, 201, "Signup Successful", {
    user: result.user,
    accessToken: result.accessToken,
  });
});
