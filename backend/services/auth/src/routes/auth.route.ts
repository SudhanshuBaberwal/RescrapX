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

const authrouter = Router();

authrouter.get("/test", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth Service Working 🚀",
  });
});

authrouter.post("/signup", validate(signupSchema), signup);

authrouter.post(
  "/verification",
  validate(VerifyOtpSchema),
  verifyOtpController,
);
authrouter.post("/login", validate(loginSchema), login);
authrouter.post("/logout", protect, logout);
authrouter.get("/me", protect, getCurrentUser);
authrouter.post("/refresh", refreshTokenController);
authrouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController,
);
authrouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController,
);
authrouter.patch(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePasswordController,
);
authrouter.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerificationController,
);
authrouter.post("/google", validate(googleLoginSchema), googleLoginController);

authrouter.post("/logout-all", protect, logoutAllController);

authrouter.patch("/set-role", protect, validate(roleSchema), setRoleController);

authrouter.post(
  "/partner/signup",
  protect,
  validate(partnerSignupSchema),
  partnerSignupController,
);


export default authrouter;
