import { Redis } from "ioredis";
import { env } from "./env.js";

const redis = new Redis(env.REDIS_URL);

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err: any) => {
  console.log(err);
});

export default redis;
