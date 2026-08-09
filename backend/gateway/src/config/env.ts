import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: Number(process.env.PORT) || 8000,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL!,
  NOTIFICATION_SERVICE_URL : process.env.NOTIFICATION_SERVICE_URL!,
  USER_SERVICE_URL:process.env.USER_SERVICE_URL!,
  VEHICLE_SERVICE_URL:process.env.VEHICLE_SERVICE_URL!,
  JWT_SECRET:process.env.JWT_SECRET!,
  AUCTION_SERVICE_URL:process.env.AUCTION_SERVICE_URL!
};


export default env;