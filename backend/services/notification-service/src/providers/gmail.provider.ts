import { google } from "googleapis";
import { env } from "../config/env.js";

if (!env.GMAIL_CLIENT_ID) {
  throw new Error("GMAIL_CLIENT_ID is missing");
}

if (!env.GMAIL_CLIENT_SECRET) {
  throw new Error("GMAIL_CLIENT_SECRET is missing");
}

if (!env.GMAIL_REFRESH_TOKEN) {
  throw new Error("GMAIL_REFRESH_TOKEN is missing");
}

if (!env.GMAIL_USER) {
  throw new Error("GMAIL_USER is missing");
}

const oauth2Client = new google.auth.OAuth2(env.GMAIL_CLIENT_ID, env.GMAIL_CLIENT_SECRET);

oauth2Client.setCredentials({
  refresh_token: env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

function createRawEmail(to: string, subject: string, html: string): string {
  const message = [
    `From: ${env.GMAIL_USER}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    html,
  ].join("\r\n");

  return Buffer.from(message).toString("base64url");
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const raw = createRawEmail(to, subject, html);

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
      },
    });

    console.log("Email sent successfully:", response.data.id);

    return response.data;
  } catch (error) {
    console.error("Gmail send error:", error);

    throw new Error("Failed to send email");
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
