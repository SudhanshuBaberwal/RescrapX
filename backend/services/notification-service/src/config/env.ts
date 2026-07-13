import { config } from "dotenv";

config();

export const env = {
  PORT: Number(process.env.PORT) || 8002,
  NODE_ENV: process.env.NODE_ENV || "development",

  CLIENT_URL: process.env.CLIENT_URL!,

  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: Number(process.env.SMTP_PORT),

  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,

  EMAIL_FROM: process.env.EMAIL_FROM!,
};