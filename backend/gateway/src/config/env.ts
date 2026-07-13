import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 8000,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL!,
};