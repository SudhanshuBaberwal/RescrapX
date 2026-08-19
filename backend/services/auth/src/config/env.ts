import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 8001,

  NODE_ENV: process.env.NODE_ENV || "development",

  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/rescrapx-auth",

  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",

  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || "15m",

  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || "7d",

  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  SUPABASE_URL: process.env.SUPABASE_SERVICE_URI!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  VEHICLE_SERVICE_URL: process.env.VEHICLE_SERVICE_URL!,
  INTERNAL_SERVICE_TOKEN:process.env.INTERNAL_SERVICE_TOKEN!,
  GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET!
};
