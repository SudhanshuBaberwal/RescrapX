import { Server } from "socket.io";
import { initializeAuctionSocket } from "./auction.socket.js";
let io = null;
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://rescrap-x.vercel.app"
];
if (process.env.ALLOWED_ORIGINS) {
    const customOrigins = process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim());
    allowedOrigins.push(...customOrigins);
}
export const initializeSocket = (httpServer) => {
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
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }
    return io;
};
