import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 8003,

  NODE_ENV: process.env.NODE_ENV || "development",

  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/rescrapx-auth",

  FRONTEND_URL:process.env.FRONTEND_URI

};
