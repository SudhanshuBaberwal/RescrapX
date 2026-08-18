let auctionIO = null;
export const initializeAuctionSocket = (io) => {
    auctionIO = io;
    io.on("connection", (socket) => {
        console.log("🔌 Socket connected:", socket.id);
        // Every connected partner receives auction lifecycle events
        socket.join("partner:auctions");
        // Join specific auction room
        socket.on("auction:join", (auctionId) => {
            socket.join(`auction:${auctionId}`);
            console.log(`Socket ${socket.id} joined auction:${auctionId}`);
        });
        // Leave specific auction room
        socket.on("auction:leave", (auctionId) => {
            socket.leave(`auction:${auctionId}`);
            console.log(`Socket ${socket.id} left auction:${auctionId}`);
        });
        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected:", socket.id);
        });
    });
};
export const getAuctionIO = () => {
    if (!auctionIO) {
        throw new Error("Auction Socket.IO has not been initialized.");
    }
    return auctionIO;
};
