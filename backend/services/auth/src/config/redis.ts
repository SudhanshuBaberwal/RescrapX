
import { createClient } from "redis";
import { env } from "./env.js";

const redis = createClient({
  url: env.REDIS_URL,
});

redis.on("connect", () => {
  console.log("🟢 Redis Connected");
});

redis.on("error", (err: any) => {
  console.error("🔴 Redis Error:", err);
});

await redis.connect();

export default redis;
