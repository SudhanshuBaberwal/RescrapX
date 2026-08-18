import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import mailProvider from "../providers/nodemailer.provider.js";
class EmailService {
    /**
     * Load and compile Handlebars template
     */
    async compileTemplate(template, context) {
        const templatePath = path.join(process.cwd(), "src", "templates", `${template}.hbs`);
        const source = await fs.readFile(templatePath, "utf8");
        const compiled = handlebars.compile(source);
        return compiled(context);
    }
    async sendTemplateEmail({ to, subject, template, context, }) {
        const html = await this.compileTemplate(template, context);
        await mailProvider.sendEmail({
            to,
            subject,
            html,
        });
    }
    async sendVerificationEmail(email, fullName, otp) {
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
    async sendWelcomeEmail(email, fullName) {
        await this.sendTemplateEmail({
            to: email,
            subject: "Welcome To RescrapX",
            template: "welcome",
            context: {
                fullName,
            },
        });
    }
    async sendForgotPasswordEmail(email, fullName, otp) {
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
    async sendPasswordChangedEmail(email, fullName) {
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
