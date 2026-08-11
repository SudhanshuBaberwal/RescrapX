import Auction, {
  AuctionStatus,
  IAuction,
  WinnerStatus,
} from "../models/auction.model.js";

class AuctionRepository {
  // =========================================================
  // CREATE
  // =========================================================

  async createAuction(data: Partial<IAuction>) {
    return Auction.create(data);
  }

  async findActiveAuction() {
    return Auction.findOne({
      status: {
        $in: [
          AuctionStatus.DRAFT,
          AuctionStatus.SCHEDULED,
          AuctionStatus.APPROVAL_PENDING,
          AuctionStatus.START_APPROVED,
          AuctionStatus.LIVE,
        ],
      },
    }).sort({ createdAt: -1 });
  }

  async findByAuctionId(auctionId: string) {
    return Auction.findById(auctionId);
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

  async placeBid(
    auctionId: string,
    vehicleId: string,
    partnerId: string,
    bidAmount: number,
    currentHighestBid: number,
  ) {
    return Auction.findOneAndUpdate(
      {
        _id: auctionId,

        status: AuctionStatus.LIVE,

        // Partner must be part of this auction
        partners: {
          $elemMatch: {
            partnerId,
            "vehicleIds.vehicleId": vehicleId,
          },
        },
        vehicles: {
          $elemMatch: {
            vehicleId,
            currentHighestBid,
          },
        },
      },
      {
        $set: {
          "vehicles.$.currentHighestBid": bidAmount,
          "vehicles.$.highestBidder": partnerId,
        },

        $inc: {
          "vehicles.$.totalBids": 1,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  async findScheduledAuctions() {
    return Auction.find({
      status: AuctionStatus.SCHEDULED,
    }).sort({ startTime: 1 });
  }

  // Auctions that are exactly within 1 minute of starting
  async findAuctionsPendingStartApproval() {
    const now = new Date();
    const oneMinuteFromNow = new Date(now.getTime() + 60 * 1000);

    return Auction.find({
      status: AuctionStatus.SCHEDULED,
      startApprovalPending: false,
      startTime: {
        $gt: now,
        $lte: oneMinuteFromNow,
      },
    }).sort({ startTime: 1 });
  }

  async markStartApprovalPending(auctionId: string) {
    return Auction.findOneAndUpdate(
      {
        auctionId,
        status: AuctionStatus.SCHEDULED,
        startApprovalPending: false,
      },
      {
        $set: {
          startApprovalPending: true,
          startApprovalRequestedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  async markApprovalPending(auctionId: string) {
    return Auction.findOneAndUpdate(
      {
        auctionId,
        status: AuctionStatus.SCHEDULED,
      },
      {
        $set: {
          status: AuctionStatus.APPROVAL_PENDING,
          approvalRequestedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  async markAuctionsPendingApproval() {
    const now = new Date();

    const oneMinuteLater = new Date(now.getTime() + 60 * 1000);

    return Auction.updateMany(
      {
        status: AuctionStatus.SCHEDULED,

        approvalPending: false,

        approvedForStart: false,

        startTime: {
          $gt: now,
          $lte: oneMinuteLater,
        },
      },
      {
        $set: {
          approvalPending: true,
        },
      },
    );
  }

  async findPendingApprovalAuctions() {
    return Auction.find({
      status: AuctionStatus.APPROVAL_PENDING,
    }).sort({ startTime: 1 });
  }

  async findPendingStartApprovalAuctions() {
    return Auction.find({
      status: AuctionStatus.SCHEDULED,
      startApprovalPending: true,
    }).sort({ startTime: 1 });
  }

  async startApprovedAuctions() {
    const now = new Date();

    return Auction.updateMany(
      {
        status: AuctionStatus.SCHEDULED,

        approvedForStart: true,

        startTime: {
          $lte: now,
        },

        endTime: {
          $gt: now,
        },
      },
      {
        $set: {
          status: AuctionStatus.LIVE,
        },
      },
    );
  }

  async approveAuctionStart(auctionId: string, adminId: string) {
    return Auction.findOneAndUpdate(
      {
        _id: auctionId,
        status: AuctionStatus.SCHEDULED,
      },
      {
        $set: {
          status: AuctionStatus.LIVE,
          startApprovedAt: new Date(),
          startApprovedBy: adminId,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }
  async approveAuction(auctionId: string, adminId: string) {
    return Auction.findOneAndUpdate(
      {
        _id: auctionId,
        status: AuctionStatus.DRAFT,
      },
      {
        $set: {
          status: AuctionStatus.SCHEDULED,
          updatedBy: adminId,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  async findAuctionsReadyToGoLive() {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    return Auction.find({
      status: AuctionStatus.START_APPROVED,

      startApprovedAt: {
        $lte: oneMinuteAgo,
      },
    });
  }

  async rejectAuctionStart(auctionId: string, adminId: string) {
    return Auction.findOneAndUpdate(
      {
        auctionId,
        status: AuctionStatus.SCHEDULED,
        startApprovalPending: true,
      },
      {
        $set: {
          status: AuctionStatus.CANCELLED,
          startApprovalPending: false,
          cancelledAt: new Date(),
          updatedBy: adminId,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  async markAuctionLive(auctionId: string) {
    return Auction.findOneAndUpdate(
      {
        _id: auctionId,
        status: AuctionStatus.START_APPROVED,
      },
      {
        $set: {
          status: AuctionStatus.LIVE,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  // =========================================================
  // LIVE
  // =========================================================

  async findLiveAuctions() {
    return Auction.find({
      status: AuctionStatus.LIVE,
    }).sort({ endTime: 1 });
  }

  async findLiveAuctionsForPartner(partnerId: string) {
    return Auction.find({
      status: AuctionStatus.LIVE,
      "partners.partnerId": partnerId,
    }).sort({ endTime: 1 });
  }

  async findAuctionForPartner(auctionId: string, partnerId: string) {
    return Auction.findOne({
      _id: auctionId,
      status: AuctionStatus.LIVE,
      "partners.partnerId": partnerId,
    });
  }

  // =========================================================
  // PARTNER ACTIVE AUCTION
  // =========================================================

  async findActiveAuctionForPartner(partnerId: string) {
    const auction = await Auction.findOne({
      status: {
        $in: [
          AuctionStatus.SCHEDULED,
          AuctionStatus.APPROVAL_PENDING,
          AuctionStatus.START_APPROVED,
          AuctionStatus.LIVE,
        ],
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
      auctionId: auction._id.toString(),

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
  async configureVehicle(
    auctionId: string,
    vehicleId: string,
    minimumBid: number,
    reservePrice: number,
    bidIncrement: number,
  ) {
    return Auction.findOneAndUpdate(
      {
        _id: auctionId,
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
        returnDocument: "after",
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
        _id: auctionId,
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
        returnDocument: "after",
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
        _id: auctionId,
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
        returnDocument: "after",
        runValidators: true,
      },
    );
  }
  async updateStatus(auctionId: string, status: AuctionStatus) {
    return Auction.findOneAndUpdate(
      {
        _id: auctionId,
      },

      {
        $set: {
          status,
        },
      },

      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }
  async deleteAuction(auctionId: string) {
    return Auction.findOneAndDelete({
      _id: auctionId,
    });
  }
}

export default new AuctionRepository();
