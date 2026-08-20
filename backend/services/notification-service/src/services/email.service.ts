import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";

import { sendEmail } from "../providers/gmail.provider.js";

interface SendTemplateEmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
}

class EmailService {
  /**
   * Compile a Handlebars email template.
   */
  private async compileTemplate(
    template: string,
    context: Record<string, unknown>,
  ): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      "src",
      "templates",
      `${template}.hbs`,
    );

    const source = await fs.readFile(templatePath, "utf8");

    const compiledTemplate = handlebars.compile(source);

    return compiledTemplate(context);
  }

  /**
   * Send an email using a Handlebars template.
   */
  async sendTemplateEmail({
    to,
    subject,
    template,
    context,
  }: SendTemplateEmailOptions): Promise<void> {
    const html = await this.compileTemplate(template, context);

    await sendEmail(to, subject, html);
  }

  /**
   * Send raw HTML email.
   */
  async sendRawEmail(to: string, subject: string, html: string): Promise<void> {
    await sendEmail(to, subject, html);
  }

  /**
   * Send email verification OTP.
   */
  async sendVerificationEmail(
    email: string,
    fullName: string,
    otp: string,
  ): Promise<void> {
    await this.sendTemplateEmail({
      to: email,
      subject: "Verify Your RescrapX Account",
      template: "verify-email",
      context: {
        fullName,
        otp,
        year: new Date().getFullYear(),
      },
    });
  }

  /**
   * Send welcome email.
   */
  async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    await this.sendTemplateEmail({
      to: email,
      subject: "Welcome to RescrapX",
      template: "welcome",
      context: {
        fullName,
        year: new Date().getFullYear(),
      },
    });
  }

  /**
   * Send forgot-password OTP.
   */
  async sendForgotPasswordEmail(
    email: string,
    fullName: string,
    otp: string,
  ): Promise<void> {
    await this.sendTemplateEmail({
      to: email,
      subject: "RescrapX Password Reset OTP",
      template: "forgot-password",
      context: {
        fullName,
        otp,
        year: new Date().getFullYear(),
      },
    });
  }

  /**
   * Send password changed confirmation.
   */
  async sendPasswordChangedEmail(
    email: string,
    fullName: string,
  ): Promise<void> {
    await this.sendTemplateEmail({
      to: email,
      subject: "RescrapX Password Changed Successfully",
      template: "reset-password-success",
      context: {
        fullName,
        year: new Date().getFullYear(),
      },
    });
  }

  /**
   * Send generic OTP email.
   */
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const { otpTemplate } = await import("../templates/otp.templates.js");

    const html = otpTemplate(otp);

    await sendEmail(email, "Your RescrapX OTP", html);
  }
}

export default new EmailService();
