import { Router } from "express";
import {
  forgotPasswordController,
  getCurrentUser,
  login,
  logout,
  refreshTokenController,
  resetPasswordController,
  signup,
  verifyOtpController,
} from "../controllers/auth.controller.js";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  VerifyOtpSchema,
} from "../validations/auth.validation.js";
import validate from "../middleware/validate.middleware.js";
import protect from "../middleware/protect.middleware.js";

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

export default authrouter;
