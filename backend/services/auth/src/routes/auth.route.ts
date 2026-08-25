import { Router } from "express";
import {
  changePasswordController,
  forgotPasswordController,
  getCurrentUser,
  googleLoginController,
  login,
  logout,
  logoutAllController,
  partnerSignupController,
  refreshTokenController,
  resendVerificationController,
  resetPasswordController,
  setPartnerController,
  setRoleController,
  signup,
  verifyOtpController,
} from "../controllers/auth.controller.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  roleSchema,
  signupSchema,
  VerifyOtpSchema,
} from "../validations/auth.validation.js";
import validate from "../middleware/validate.middleware.js";
import protect from "../middleware/protect.middleware.js";
import { partnerSignupSchema } from "../validations/partner.validation.js";
import adminOnly from "../middleware/adminOnly.js";
import { getAllUserProfilesController } from "../controllers/admin.controller.js";
import { authLimiter, otpLimiter } from "../middleware/ratelimit.middleware.js";

const authrouter = Router();

authrouter.get("/test", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth Service Working 🚀",
  });
});

authrouter.post("/signup",authLimiter, validate(signupSchema), signup);

authrouter.post(
  "/verification",otpLimiter,
  validate(VerifyOtpSchema),
  verifyOtpController,
);
authrouter.post("/login",authLimiter, validate(loginSchema), login);
authrouter.post("/logout", protect, logout);
authrouter.get("/me", protect, getCurrentUser);
authrouter.post("/refresh",authLimiter, refreshTokenController);
authrouter.post(
  "/forgot-password",otpLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordController,
);
authrouter.post(
  "/reset-password",authLimiter,
  validate(resetPasswordSchema),
  resetPasswordController,
);
authrouter.patch(
  "/change-password",
  authLimiter,
  protect,
  validate(changePasswordSchema),
  changePasswordController,
);
authrouter.post(
  "/resend-verification",
  otpLimiter,
  validate(resendVerificationSchema),
  resendVerificationController,
);
authrouter.post("/google",authLimiter, validate(googleLoginSchema), googleLoginController);

authrouter.post("/logout-all", protect, logoutAllController);

authrouter.patch("/set-role", protect, validate(roleSchema), setRoleController);

authrouter.post(
  "/partner/signup",
  protect,
  validate(partnerSignupSchema),
  partnerSignupController,
);

authrouter.post("/partner/set-partner", protect, setPartnerController);

export default authrouter;
