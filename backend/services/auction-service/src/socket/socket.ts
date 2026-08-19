import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

import { initializeAuctionSocket } from "./auction.socket.js";

let io: Server | null = null;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://rescrap-x.vercel.app"
];

if (process.env.ALLOWED_ORIGINS) {
  const customOrigins = process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim());
  allowedOrigins.push(...customOrigins);
}

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  // Initialize auction socket events
  initializeAuctionSocket(io);

  console.log("🚀 Socket.IO initialized");

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};