import { Router } from "express";
import notificationController from "../controllers/notification.controller.js";
import validate from "../middlewares/validation.middleware.js";
import { verificationEmailSchema, welcomeEmailSchema, forgotPasswordSchema, passwordChangeSchema, } from "../validations/notification.validation.js";
const router = Router();
router.get("/test", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Notification Service Working 🚀",
    });
});
router.post("/email/verification", validate(verificationEmailSchema), notificationController.sendVerificationEmail);
router.post("/email/welcome", validate(welcomeEmailSchema), notificationController.sendWelcomeEmail);
router.post("/email/forgot-password", validate(forgotPasswordSchema), notificationController.sendForgotPasswordEmail);
router.post("/email/password-changed", validate(passwordChangeSchema), notificationController.sendPasswordChangedEmail);
export default router;
