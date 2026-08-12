import { getAuctionIO } from "./auction.socket.js";


export interface BidUpdatedPayload {
  auctionId: string;
  vehicleId: string;
  currentHighestBid: number;
  highestBidder: string | null;
  totalBids: number;
}

export const emitBidUpdated = (
  data: BidUpdatedPayload,
) => {
  const auctionIO = getAuctionIO();

  auctionIO
    .to(`auction:${data.auctionId}`)
    .emit("bid:updated", data);
};