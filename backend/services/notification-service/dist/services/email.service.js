import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import { sendEmail } from "../providers/gmail.provider.js";
class EmailService {
    /**
     * Compile a Handlebars email template.
     */
    async compileTemplate(template, context) {
        const templatePath = path.join(process.cwd(), "src", "templates", `${template}.hbs`);
        const source = await fs.readFile(templatePath, "utf8");
        const compiledTemplate = handlebars.compile(source);
        return compiledTemplate(context);
    }
    /**
     * Send an email using a Handlebars template.
     */
    async sendTemplateEmail({ to, subject, template, context, }) {
        const html = await this.compileTemplate(template, context);
        await sendEmail(to, subject, html);
    }
    /**
     * Send raw HTML email.
     */
    async sendRawEmail(to, subject, html) {
        await sendEmail(to, subject, html);
    }
    /**
     * Send email verification OTP.
     */
    async sendVerificationEmail(email, fullName, otp) {
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
    async sendWelcomeEmail(email, fullName) {
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
    async sendForgotPasswordEmail(email, fullName, otp) {
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
    async sendPasswordChangedEmail(email, fullName) {
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
    async sendOtpEmail(email, otp) {
        const { otpTemplate } = await import("../templates/otp.templates.js");
        const html = otpTemplate(otp);
        await sendEmail(email, "Your RescrapX OTP", html);
    }
}
export default new EmailService();
