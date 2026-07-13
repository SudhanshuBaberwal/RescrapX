import { Router } from "express";
import { signup, verifyOtpController } from "../controllers/auth.controller.js";
import { signupSchema, VerifyOtpSchema } from "../validations/auth.validation.js";
import validate from "../middleware/validate.middleware.js";

const authrouter = Router();

authrouter.get("/test", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth Service Working 🚀",
  });
});

authrouter.post(
  "/signup",
  validate(signupSchema),
  signup
);

authrouter.post("/verification",validate(VerifyOtpSchema),verifyOtpController)

export default authrouter;