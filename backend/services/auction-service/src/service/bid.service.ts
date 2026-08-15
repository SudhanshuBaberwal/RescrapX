import { AuctionStatus } from "../models/auction.model.js";
import auctionRepository from "../repositories/auction.repository.js";
import bidRepository from "../repositories/bid.repository.js";

class BidClass {
  async getMyBids(partnerId: string) {
    const bids = await bidRepository.findByPartner(partnerId);
    const auctionIds = [...new Set(bids.map((bid) => bid.auctionId))];
    const auctions = await auctionRepository.findByAuctionIds(auctionIds);
    const auctionMap = new Map(
      auctions.map((auction) => [auction.auctionId, auction]),
    );
    return bids.map((bid) => {
      const auction = auctionMap.get(bid.auctionId);
      const vehicle = auction?.vehicles?.find(
        (vehicle) => vehicle.vehicleId === bid.vehicleId,
      );
      if (!auction || !vehicle) {
        return {
          ...bid,
          status: "UNKNOWN",
        };
      }
      const isWinner =
        auction.status === AuctionStatus.ENDED &&
        vehicle.highestBidder === partnerId &&
        vehicle.assignedStatus === "ASSIGNED";
      const isHighestBidder = vehicle.highestBidder === partnerId;
      let status: string;
      if (isWinner) {
        status = "WON";
      } else if (auction.status === AuctionStatus.ENDED) {
        status = "LOST";
      } else if (isHighestBidder) {
        status = "ACTIVE";
      } else {
        status = "OUTBID";
      }
      return {
        bidId: bid._id,
        auctionId: auction.auctionId,
        vehicleId: bid.vehicleId,
        amount: bid.amount,
        currentHighestBid: vehicle.currentHighestBid ?? 0,
        highestBidder: vehicle.highestBidder ?? null,
        totalBids: vehicle.totalBids ?? 0,
        minimumBid: vehicle.minimumBid ?? 0,
        bidIncrement: vehicle.bidIncrement ?? 0,
        reservePrice: vehicle.reservePrice ?? 0,
        auctionStatus: auction.status,
        startTime: auction.startTime,
        endTime: auction.endTime,
        status,
        createdAt: bid.createdAt,
      };
    });
  }
}

export default new BidClass();
