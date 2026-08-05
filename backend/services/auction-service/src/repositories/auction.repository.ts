import Auction, { IAuction, AuctionStatus } from "../models/auction.model.js";

class AuctionRepository {
  async createAuction(data: Partial<IAuction>) {
    return Auction.create(data);
  }
  async findById(id: string) {
    return Auction.findById(id);
  }
  async findByAuctionId(auctionId: string) {
    return Auction.findOne({ auctionId });
  }
  async findByVehicleId(vehicleId: string) {
    return Auction.findOne({ vehicleId });
  }
  async getLiveAuctions() {
    return Auction.find({
      status: AuctionStatus.LIVE,
    }).sort({
      startTime: 1,
    });
  }
  async getScheduledAuctions() {
    return Auction.find({
      status: AuctionStatus.SCHEDULED,
    });
  }
  async saveAuction(auction: IAuction) {
    return auction.save();
  }
}

export default new AuctionRepository();
