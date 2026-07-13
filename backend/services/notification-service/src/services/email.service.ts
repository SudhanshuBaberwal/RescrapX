import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";

import mailProvider from "../providers/nodemailer.provider.js";

interface SendTemplateEmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
}

class EmailService {
  /**
   * Load and compile Handlebars template
   */
  private async compileTemplate(
    template: string,
    context: Record<string, unknown>
  ): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      "src",
      "templates",
      `${template}.hbs`
    );

    const source = await fs.readFile(templatePath, "utf8");

    const compiled = handlebars.compile(source);

    return compiled(context);
  }

  async sendTemplateEmail({
    to,
    subject,
    template,
    context,
  }: SendTemplateEmailOptions): Promise<void> {
    const html = await this.compileTemplate(
      template,
      context
    );

    await mailProvider.sendEmail({
      to,
      subject,
      html,
    });
  }
  async sendVerificationEmail(
    email: string,
    fullName: string,
    otp: string
  ) {
    await this.sendTemplateEmail({
      to: email,
      subject: "Verify Your Email",
      template: "verify-email",
      context: {
        fullName,
        otp,
      },
    });
  }

  async sendWelcomeEmail(
    email: string,
    fullName: string
  ) {
    await this.sendTemplateEmail({
      to: email,
      subject: "Welcome To RescrapX",
      template: "welcome",
      context: {
        fullName,
      },
    });
  }

  async sendForgotPasswordEmail(
    email: string,
    fullName: string,
    otp: string
  ) {
    await this.sendTemplateEmail({
      to: email,
      subject: "Reset Password",
      template: "forgot-password",
      context: {
        fullName,
        otp,
      },
    });
  }

  async sendPasswordChangedEmail(
    email: string,
    fullName: string
  ) {
    await this.sendTemplateEmail({
      to: email,
      subject: "Password Changed",
      template: "reset-password-success",
      context: {
        fullName,
      },
    });
  }
}

export default new EmailService();