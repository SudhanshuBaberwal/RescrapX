import emailService from "./email.service.js";

class NotificationService {
  /**
   * Email verification OTP.
   */
  async sendVerificationEmail(
    email: string,
    fullName: string,
    otp: string,
  ): Promise<void> {
    await emailService.sendVerificationEmail(email, fullName, otp);
  }

  /**
   * Welcome email.
   */
  async sendWelcomeEmail(
    email: string,
    fullName: string,
  ): Promise<void> {
    await emailService.sendWelcomeEmail(email, fullName);
  }

  /**
   * Forgot-password OTP.
   */
  async sendForgotPasswordEmail(
    email: string,
    fullName: string,
    otp: string,
  ): Promise<void> {
    await emailService.sendForgotPasswordEmail(email, fullName, otp);
  }

  /**
   * Password changed confirmation.
   */
  async sendPasswordChangedEmail(
    email: string,
    fullName: string,
  ): Promise<void> {
    await emailService.sendPasswordChangedEmail(email, fullName);
  }

  /**
   * Generic OTP email.
   */
  async sendOtpEmail(
    email: string,
    otp: string,
  ): Promise<void> {
    await emailService.sendOtpEmail(email, otp);
  }
}

export default new NotificationService();