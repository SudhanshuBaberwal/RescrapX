import Auction, { AuctionStatus, IAuction } from "../models/auction.model.js";

class AuctionRepository {
  async createAuction(data: Partial<IAuction>) {
    return Auction.create(data);
  }

  async findActiveAuction() {
    return Auction.findOne({
      status: {
        $in: [AuctionStatus.DRAFT, AuctionStatus.SCHEDULED, AuctionStatus.LIVE],
      },
    });
  }

  async findByAuctionId(auctionId: string) {
    return Auction.findOne({ auctionId });
  }

  async findByVehicleId(vehicleId: string) {
    return Auction.findOne({
      "vehicles.vehicleId": vehicleId,
      status: {
        $ne: AuctionStatus.CANCELLED,
      },
    });
  }

  async findAll() {
    return Auction.find().sort({ createdAt: -1 });
  }

  async findScheduledAuctions() {
    return Auction.find({
      status: AuctionStatus.SCHEDULED,
    }).sort({ startTime: 1 });
  }

  async findLiveAuctions() {
    return Auction.find({
      status: AuctionStatus.LIVE,
    }).sort({ startTime: 1 });
  }

  async updateStatus(auctionId: string, status: AuctionStatus) {
    return Auction.findOneAndUpdate(
      { auctionId },
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }
}

export default new AuctionRepository();
