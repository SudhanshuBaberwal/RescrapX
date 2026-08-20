import { google } from "googleapis";
import { env } from "./env.js";
if (!env.GMAIL_CLIENT_ID ||
    !env.GMAIL_CLIENT_SECRET ||
    !env.GMAIL_REFRESH_TOKEN ||
    !env.GMAIL_USER) {
    throw new Error("Missing Gmail environment variables");
}
export const gmailUser = env.GMAIL_USER;
export const oAuth2Client = new google.auth.OAuth2(env.GMAIL_CLIENT_ID, env.GMAIL_CLIENT_SECRET);
oAuth2Client.setCredentials({
    refresh_token: env.GMAIL_REFRESH_TOKEN,
});
export const gmail = google.gmail({
    version: "v1",
    auth: oAuth2Client,
});
