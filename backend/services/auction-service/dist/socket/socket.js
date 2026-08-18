import { Server } from "socket.io";
import { initializeAuctionSocket } from "./auction.socket.js";
let io = null;
export const initializeSocket = (httpServer) => {
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
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }
    return io;
};
