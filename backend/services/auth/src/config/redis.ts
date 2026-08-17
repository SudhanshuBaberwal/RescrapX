
import { createClient } from "redis";
import { env } from "./env.js";

const isTLS = env.REDIS_URL.startsWith("rediss://");

const redis = createClient({
  url: env.REDIS_URL,
  socket: isTLS
    ? { tls: true as const, rejectUnauthorized: false }
    : {},
});

redis.on("connect", () => {
  console.log("🟢 Redis Connected");
});

redis.on("error", (err: any) => {
  console.error("🔴 Redis Error:", err);
});

await redis.connect();

export default redis;
