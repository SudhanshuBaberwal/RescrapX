import emailService from "./email.service.js";
class NotificationService {
    /**
     * Email Verification
     */
    async sendVerificationEmail(email, fullName, otp) {
        await emailService.sendVerificationEmail(email, fullName, otp);
    }
    /**
     * Welcome Email
     */
    async sendWelcomeEmail(email, fullName) {
        await emailService.sendWelcomeEmail(email, fullName);
    }
    /**
     * Forgot Password
     */
    async sendForgotPasswordEmail(email, fullName, otp) {
        await emailService.sendForgotPasswordEmail(email, fullName, otp);
    }
    /**
     * Password Changed
     */
    async sendPasswordChangedEmail(email, fullName) {
        await emailService.sendPasswordChangedEmail(email, fullName);
    }
}
export default new NotificationService();
