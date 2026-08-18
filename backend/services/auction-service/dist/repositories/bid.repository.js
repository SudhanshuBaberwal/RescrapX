import { Bid } from "../models/bid.model.js";
class BidRepository {
    async createBid(data) {
        return Bid.create(data);
    }
    async findByPartner(partnerId) {
        return Bid.find({
            partnerId,
        })
            .sort({
            createdAt: -1,
        })
            .lean();
    }
    async findByPartnerAndAuction(partnerId, auctionId) {
        return Bid.find({
            partnerId,
            auctionId,
        })
            .sort({
            createdAt: -1,
        })
            .lean();
    }
    async findByPartnerAndVehicle(partnerId, vehicleId) {
        return Bid.find({
            partnerId,
            vehicleId,
        })
            .sort({
            createdAt: -1,
        })
            .lean();
    }
    async countByPartner(partnerId) {
        return Bid.countDocuments({
            partnerId,
        });
    }
}
export default new BidRepository();
