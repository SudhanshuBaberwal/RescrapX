import emailService from "./email.service.js";
class NotificationService {
    /**
     * Email verification OTP.
     */
    async sendVerificationEmail(email, fullName, otp) {
        await emailService.sendVerificationEmail(email, fullName, otp);
    }
    /**
     * Welcome email.
     */
    async sendWelcomeEmail(email, fullName) {
        await emailService.sendWelcomeEmail(email, fullName);
    }
    /**
     * Forgot-password OTP.
     */
    async sendForgotPasswordEmail(email, fullName, otp) {
        await emailService.sendForgotPasswordEmail(email, fullName, otp);
    }
    /**
     * Password changed confirmation.
     */
    async sendPasswordChangedEmail(email, fullName) {
        await emailService.sendPasswordChangedEmail(email, fullName);
    }
    /**
     * Generic OTP email.
     */
    async sendOtpEmail(email, otp) {
        await emailService.sendOtpEmail(email, otp);
    }
}
export default new NotificationService();
