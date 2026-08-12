import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

import { initializeAuctionSocket } from "./auction.socket.js";

let io: Server | null = null;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
      ],
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