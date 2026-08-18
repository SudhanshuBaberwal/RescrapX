import { getAuctionIO } from "./auction.socket.js";
export const emitBidUpdated = (data) => {
    const auctionIO = getAuctionIO();
    auctionIO
        .to(`auction:${data.auctionId}`)
        .emit("bid:updated", data);
};
export const emitAuctionEnded = (data) => {
    const auctionIO = getAuctionIO();
    // Auction-specific room
    auctionIO
        .to(`auction:${data.auctionId}`)
        .emit("auction:ended", data);
    // Also notify all partners
    auctionIO
        .to("partner:auctions")
        .emit("auction:ended", data);
};
export function emitApprovalRequired(auction) {
    const auctionIO = getAuctionIO();
    auctionIO
        .to("partner:auctions")
        .emit("auction:approval_required", {
        auctionId: auction._id.toString(),
        startTime: auction.startTime,
        endTime: auction.endTime,
    });
}
// =========================================================
// AUCTION STARTED
// =========================================================
export function emitAuctionStarted(auction) {
    const auctionIO = getAuctionIO();
    auctionIO
        .to("partner:auctions")
        .emit("auction:started", {
        auctionId: auction._id.toString(),
        status: "LIVE",
        startTime: auction.startTime,
        endTime: auction.endTime,
        vehicles: auction.vehicles,
    });
    // Also send to auction room
    auctionIO
        .to(`auction:${auction._id.toString()}`)
        .emit("auction:started", {
        auctionId: auction._id.toString(),
        status: "LIVE",
        startTime: auction.startTime,
        endTime: auction.endTime,
        vehicles: auction.vehicles,
    });
}
