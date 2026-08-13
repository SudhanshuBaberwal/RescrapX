import app from "./app.js";
import http from "http";
import { connectDB } from "./config/db.js";
import "./config/redis.js";
import { env } from "./config/env.js";
import { startAuctionScheduler } from "./schedulers/auction.scheduler.js";
import { initializeSocket } from "./socket/socket.js";

async function start() {
  const httpServer = http.createServer(app);
  initializeSocket(httpServer);
  await connectDB();
  startAuctionScheduler();
  httpServer.listen(env.PORT, () => {
    console.log(`
====================================================
🚗 Auction Service Started Successfully
====================================================
Environment : ${env.NODE_ENV}
Port        : ${env.PORT}
Health      : http://localhost:${env.PORT}/health
🔌 Socket.IO running on port ${env.PORT}
====================================================
`);
  });
}
start();
