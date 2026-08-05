import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV!,
    MONGODB_URI: process.env.MONGODB_URI!,
    REDIS_URL: process.env.REDIS_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    VEHICLE_SERVICE_URL: process.env.VEHICLE_SERVICE_URL!
};