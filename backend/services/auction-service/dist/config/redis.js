import { Redis } from "ioredis";
import { env } from "./env.js";
const redis = new Redis(env.REDIS_URL, {
    tls: env.REDIS_URL.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
});
redis.on("connect", () => {
    console.log("✅ Redis Connected");
});
redis.on("error", (err) => {
    console.log(err);
});
export default redis;
