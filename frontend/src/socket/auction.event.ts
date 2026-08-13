import { getSocket } from "./socket";

export interface BidUpdatedPayload {
  auctionId: string;
  vehicleId: string;
  currentHighestBid: number;
  highestBidder: string | null;
  totalBids: number;
}

export interface AuctionStartedPayload {
  auctionId: string;
  status: "LIVE";
  startTime: string | Date;
  endTime: string | Date;
  vehicles: any[];
}

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

// ==========================================
// JOIN AUCTION
// ==========================================

export const joinAuction = (auctionId: string) => {
  const socket = getSocket();

  socket.emit("auction:join", auctionId);
};

// ==========================================
// LEAVE AUCTION
// ==========================================

export const leaveAuction = (auctionId: string) => {
  const socket = getSocket();

  socket.emit("auction:leave", auctionId);
};

// ==========================================
// BID UPDATED
// ==========================================

export const onBidUpdated = (
  callback: (data: BidUpdatedPayload) => void,
) => {
  const socket = getSocket();

  socket.on("bid:updated", callback);

  return () => {
    socket.off("bid:updated", callback);
  };
};

// ==========================================
// AUCTION STARTED
// ==========================================

export const onAuctionStarted = (
  callback: (data: AuctionStartedPayload) => void,
) => {
  const socket = getSocket();

  socket.on("auction:started", callback);

  return () => {
    socket.off("auction:started", callback);
  };
};

// ==========================================
// AUCTION ENDED
// ==========================================

export const onAuctionEnded = (
  callback: (data: AuctionEndedPayload) => void,
) => {
  const socket = getSocket();

  socket.on("auction:ended", callback);

  return () => {
    socket.off("auction:ended", callback);
  };
};