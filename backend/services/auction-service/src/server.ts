import app from "./app.js";
import { connectDB } from "./config/db.js";
import "./config/redis.js";
import { env } from "./config/env.js";

async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`
====================================================
🚗 Auction Service Started Successfully
====================================================
Environment : ${env.NODE_ENV}
Port        : ${env.PORT}
Health      : http://localhost:${env.PORT}/health
====================================================
`);
  });
}
start();
