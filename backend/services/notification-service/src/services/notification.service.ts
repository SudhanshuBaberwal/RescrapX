import emailService from "./email.service.js";

class NotificationService {
  /**
   * Email Verification
   */
  async sendVerificationEmail(
    email: string,
    fullName: string,
    otp: string
  ) {
    await emailService.sendVerificationEmail(
      email,
      fullName,
      otp
    );
  }

  /**
   * Welcome Email
   */
  async sendWelcomeEmail(
    email: string,
    fullName: string
  ) {
    await emailService.sendWelcomeEmail(
      email,
      fullName
    );
  }

  /**
   * Forgot Password
   */
  async sendForgotPasswordEmail(
    email: string,
    fullName: string,
    otp: string
  ) {
    await emailService.sendForgotPasswordEmail(
      email,
      fullName,
      otp
    );
  }

  /**
   * Password Changed
   */
  async sendPasswordChangedEmail(
    email: string,
    fullName: string
  ) {
    await emailService.sendPasswordChangedEmail(
      email,
      fullName
    );
  }
}

export default new NotificationService();