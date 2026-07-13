import transporter from "../config/mail.js";
import { env } from "../config/env.js";
export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface MailProvider {
  sendEmail(options: SendEmailOptions): Promise<void>;
}

class NodemailerProvider implements MailProvider {
  async sendEmail({
    to,
    subject,
    html,
    text,
  }: SendEmailOptions): Promise<void> {
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
