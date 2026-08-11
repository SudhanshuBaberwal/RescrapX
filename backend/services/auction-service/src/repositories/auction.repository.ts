import Auction, {
  AuctionStatus,
  IAuction,
  WinnerStatus,
} from "../models/auction.model.js";

class AuctionRepository {
  async createAuction(data: Partial<IAuction>) {
    return Auction.create(data);
  }

  async findActiveAuction() {
    return Auction.findOne({
      status: {
        $in: [AuctionStatus.SCHEDULED, AuctionStatus.LIVE],
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
        $nin: [
          AuctionStatus.CANCELLED,
          AuctionStatus.ENDED,
          AuctionStatus.COMPLETED,
        ],
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

  async findLiveAuctionsForPartner(partnerId: string) {
    return Auction.find({
      status: AuctionStatus.LIVE,
      "partners.partnerId": partnerId,
    }).sort({ endTime: 1 });
  }

  async findAuctionForPartner(auctionId: string, partnerId: string) {
    return Auction.findOne({
      auctionId,
      status: AuctionStatus.LIVE,
      "partners.partnerId": partnerId,
    });
  }

  async updateVehicleAuctionRules(
    auctionId: string,
    vehicleId: string,
    minimumBid: number,
    reservePrice: number,
    bidIncrement: number,
  ) {
    return Auction.findOneAndUpdate(
      {
        auctionId,
        "vehicles.vehicleId": vehicleId,
      },
      {
        $set: {
          "vehicles.$.minimumBid": minimumBid,
          "vehicles.$.reservePrice": reservePrice,
          "vehicles.$.bidIncrement": bidIncrement,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateVehicleBid(
    auctionId: string,
    vehicleId: string,
    currentHighestBid: number,
    highestBidder: string,
  ) {
    return Auction.findOneAndUpdate(
      {
        auctionId,
        "vehicles.vehicleId": vehicleId,
      },
      {
        $set: {
          "vehicles.$.currentHighestBid": currentHighestBid,
          "vehicles.$.highestBidder": highestBidder,
        },
        $inc: {
          "vehicles.$.totalBids": 1,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateVehicleWinner(
    auctionId: string,
    vehicleId: string,
    winnerBid: number,
    winnerPartner: string,
    winnerStatus: WinnerStatus,
  ) {
    return Auction.findOneAndUpdate(
      {
        auctionId,
        "vehicles.vehicleId": vehicleId,
      },
      {
        $set: {
          "vehicles.$.winnerBid": winnerBid,
          "vehicles.$.winnerPartner": winnerPartner,
          "vehicles.$.winnerStatus": winnerStatus,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
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

  async deleteAuction(auctionId: string) {
    return Auction.findOneAndDelete({
      auctionId,
    });
  }

  async findActiveAuctionForPartner(partnerId: string) {
    const auction = await Auction.findOne({
      status: {
        $in: [AuctionStatus.SCHEDULED, AuctionStatus.LIVE],
      },
      "partners.partnerId": partnerId,
    }).lean();

    if (!auction) {
      return null;
    }

    const partner = auction.partners.find(
      (partner) => partner.partnerId === partnerId,
    );

    if (!partner) {
      return null;
    }

    const allowedVehicleIds = new Set(
      partner.vehicleIds.map((vehicle) => vehicle.vehicleId),
    );

    const vehicles = auction.vehicles.filter((vehicle) =>
      allowedVehicleIds.has(vehicle.vehicleId),
    );

    return {
      auctionId: auction.auctionId,
      type: auction.type,
      status: auction.status,

      startTime: auction.startTime,
      endTime: auction.endTime,

      autoExtend: auction.autoExtend,
      autoExtendDuration: auction.autoExtendDuration,

      visibility: auction.visibility,

      partner: {
        partnerId: partner.partnerId,
        companyName: partner.companyName,
        latitude: partner.latitude,
        longitude: partner.longitude,
        state: partner.state,
        district: partner.district,
      },

      vehicles: vehicles.map((vehicle) => {
        const partnerVehicle = partner.vehicleIds.find(
          (item) => item.vehicleId === vehicle.vehicleId,
        );

        return {
          ...vehicle,
          distanceInKm: partnerVehicle?.distanceInKm ?? null,
        };
      }),
    };
  }
}

export default new AuctionRepository();
