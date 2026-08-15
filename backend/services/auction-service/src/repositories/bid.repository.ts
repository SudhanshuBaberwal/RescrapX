import { Bid } from "../models/bid.model.js";

class BidRepository {
  async createBid(data: {
    auctionId: string;
    vehicleId: string;
    partnerId: string;
    amount: number;
  }) {
    return Bid.create(data);
  }

  async findByPartner(partnerId: string) {
    return Bid.find({
      partnerId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  async findByPartnerAndAuction(
    partnerId: string,
    auctionId: string,
  ) {
    return Bid.find({
      partnerId,
      auctionId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  async findByPartnerAndVehicle(
    partnerId: string,
    vehicleId: string,
  ) {
    return Bid.find({
      partnerId,
      vehicleId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  async countByPartner(partnerId: string) {
    return Bid.countDocuments({
      partnerId,
    });
  }
}

export default new BidRepository();