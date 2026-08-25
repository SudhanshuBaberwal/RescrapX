import { Router } from "express";
import notificationController from "../controllers/notification.controller.js";
import validate from "../middlewares/validation.middleware.js";
import { welcomeEmailSchema, forgotPasswordSchema, passwordChangeSchema, otpEmailSchema, } from "../validations/notification.validation.js";
import { notificationLimiter } from "../middlewares/ratelimit.middleware.js";
const router = Router();
router.get("/test", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Notification Service Working 🚀",
    });
});
router.post("/email/verification", notificationLimiter, 
// validate(verificationEmailSchema),
notificationController.sendOtp);
router.post("/email/welcome", notificationLimiter, validate(welcomeEmailSchema), notificationController.sendWelcomeEmail);
router.post("/email/forgot-password", notificationLimiter, validate(forgotPasswordSchema), notificationController.sendForgotPasswordEmail);
router.post("/email/password-changed", notificationLimiter, validate(passwordChangeSchema), notificationController.sendPasswordChangedEmail);
router.post("/email/otp", notificationLimiter, validate(otpEmailSchema), notificationController.sendOtp);
export default router;
