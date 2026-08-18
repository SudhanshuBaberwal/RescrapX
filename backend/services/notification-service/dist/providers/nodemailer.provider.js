import transporter from "../config/mail.js";
import { env } from "../config/env.js";
class NodemailerProvider {
    async sendEmail({ to, subject, html, text, }) {
        await transporter.sendMail({
            from: env.EMAIL_FROM,
            to,
            subject,
            html,
            text,
        });
    }
}
export default new NodemailerProvider();
