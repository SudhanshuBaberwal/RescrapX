import { getAuctionIO } from "./auction.socket.js";

// =========================================================
// BID UPDATED
// =========================================================

export interface BidUpdatedPayload {
  auctionId: string;
  vehicleId: string;
  currentHighestBid: number;
  highestBidder: string | null;
  totalBids: number;
}

export const emitBidUpdated = (data: BidUpdatedPayload) => {
  const auctionIO = getAuctionIO();

  auctionIO
    .to(`auction:${data.auctionId}`)
    .emit("bid:updated", data);
};

// =========================================================
// AUCTION ENDED
// =========================================================

export interface AuctionEndedVehicle {
  vehicleId: string;
  finalPrice: number;
  highestBidder: string | null;
  assignedPartnerId: string | null;
  assignmentStatus: string;
}

export interface AuctionEndedPayload {
  auctionId: string;
  vehicles: AuctionEndedVehicle[];
}

export const emitAuctionEnded = (
  data: AuctionEndedPayload,
) => {
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

// =========================================================
// APPROVAL REQUIRED
// =========================================================

export interface ApprovalRequiredPayload {
  auctionId: string;
  startTime: Date;
  endTime: Date;
}

export function emitApprovalRequired(auction: any) {
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

export function emitAuctionStarted(auction: any) {
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