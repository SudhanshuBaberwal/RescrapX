import Auction, {
  AuctionStatus,
  IAuction,
  VehicleAssignedStatus,
} from "../models/auction.model.js";

class AuctionRepository {
  // ======================================================
  // CREATE
  // ======================================================

  async createAuction(data: Partial<IAuction>) {
    return Auction.create(data);
  }

  async findByAuctionId(auctionId: string) {
    return Auction.findById(auctionId);
  }

  // ======================================================
  // FIND ACTIVE AUCTION
  // ======================================================

  async findActiveAuction() {
    return Auction.findOne({
      status: {
        $in: [
          AuctionStatus.DRAFT,
          AuctionStatus.SCHEDULED,
          AuctionStatus.APPROVAL_PENDING,
          AuctionStatus.START_APPROVED,
          AuctionStatus.LIVE,
          // AuctionStatus.ENDED
        ],
      },
    }).sort({ createdAt: -1 });
  }

  // ======================================================
  // CONFIGURE VEHICLE
  // ======================================================

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
        new: true,
        runValidators: true,
      },
    );
  }

  // ======================================================
  // PLACE BID
  // ======================================================

  async updateVehicleBid(
    auctionId: string,
    vehicleId: string,
    newVehiclePrice: number,
    partnerId: string,
  ) {
    const updatedAuction = await Auction.findOneAndUpdate(
      {
        _id: auctionId,
        status: AuctionStatus.LIVE,
        "vehicles.vehicleId": vehicleId,
      },
      {
        $set: {
          "vehicles.$.currentHighestBid": newVehiclePrice,
          "vehicles.$.highestBidder": partnerId,
        },
        $inc: {
          "vehicles.$.totalBids": 1,
          totalBids: 1,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return updatedAuction;
  }
  // ======================================================
  // APPROVAL
  // Find auctions whose start time is within next 3 minutes
  // ======================================================

  async findAuctionsRequiringApproval() {
    const now = new Date();

    const threeMinutesLater = new Date(now.getTime() + 3 * 60 * 1000);

    return Auction.find({
      status: AuctionStatus.SCHEDULED,

      startTime: {
        $gt: now,
        $lte: threeMinutesLater,
      },

      endTime: {
        $gt: now,
      },
    }).sort({
      startTime: 1,
    });
  }

  // ======================================================
  // REQUEST APPROVAL
  // SCHEDULED → APPROVAL_PENDING
  // ======================================================

  async requestAuctionApproval(auctionId: string) {
    const now = new Date();

    const threeMinutesLater = new Date(now.getTime() + 3 * 60 * 1000);

    return Auction.findOneAndUpdate(
      {
        _id: auctionId,

        status: AuctionStatus.SCHEDULED,

        startTime: {
          $gt: now,
          $lte: threeMinutesLater,
        },

        endTime: {
          $gt: now,
        },
      },

      {
        $set: {
          status: AuctionStatus.APPROVAL_PENDING,
          startApprovalRequestedAt: now,
        },
      },

      {
        new: true,
        runValidators: true,
      },
    );
  }

  // ======================================================
  // ADMIN APPROVE
  // APPROVAL_PENDING → START_APPROVED
  // ======================================================

  async approveAuctionStart(auctionId: string, adminId: string) {
    return Auction.findOneAndUpdate(
      {
        _id: auctionId,
        status: AuctionStatus.APPROVAL_PENDING,
        endTime: {
          $gt: new Date(),
        },
      },

      {
        $set: {
          status: AuctionStatus.START_APPROVED,
          startApprovedAt: new Date(),
          startApprovedBy: adminId,
        },
      },

      {
        new: true,
        runValidators: true,
      },
    );
  }

  // ======================================================
  // FIND APPROVED AUCTIONS READY TO START
  // ======================================================

  async findAuctionsReadyToStart() {
    const now = new Date();

    return Auction.find({
      status: AuctionStatus.START_APPROVED,

      // Start ONLY at scheduled startTime
      startTime: {
        $lte: now,
      },

      // Don't start already expired auction
      endTime: {
        $gt: now,
      },
    }).sort({
      startTime: 1,
    });
  }

  // ======================================================
  // START AUCTION
  // START_APPROVED → LIVE
  // ======================================================

  async startApprovedAuction(auctionId: string) {
    const now = new Date();
    return Auction.findOneAndUpdate(
      {
        _id: auctionId,
        status: AuctionStatus.START_APPROVED,
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
      {
        new: true,
        runValidators: true,
      },
    );
  }

  // ======================================================
  // FIND EXPIRED LIVE AUCTIONS
  // ======================================================

  async findExpiredAuctions() {
    const now = new Date();

    return Auction.find({
      status: AuctionStatus.LIVE,

      endTime: {
        $lte: now,
      },
    }).sort({
      endTime: 1,
    });
  }

  // ======================================================
  // CLOSE AUCTION + ASSIGN WINNERS
  // LIVE → ENDED
  // ======================================================

  async closeAuctionAndAssignWinners(auctionId: string) {
    const auction = await Auction.findOne({
      auctionId,
      status: AuctionStatus.LIVE,
    });

    if (!auction) {
      return null;
    }

    for (const vehicle of auction.vehicles) {
      const hasBid =
        vehicle.totalBids != null &&
        vehicle.totalBids > 0 &&
        vehicle.highestBidder != null &&
        vehicle.currentHighestBid != null;

      if (hasBid) {
        // SOLD
        vehicle.assignedPartnerId = vehicle.highestBidder;
        vehicle.assignedStatus = VehicleAssignedStatus.ASSIGNED;
        vehicle.winnerBid = vehicle.currentHighestBid;
      } else {
        // UNSOLD
        vehicle.assignedPartnerId = null;
        vehicle.assignedStatus = VehicleAssignedStatus.UNSOLD;
        vehicle.winnerBid = null;
      }
    }
    auction.status = AuctionStatus.ENDED;
    await auction.save();
    return auction;
  }

  // ======================================================
  // REJECT AUCTION APPROVAL
  // APPROVAL_PENDING → CANCELLED
  // ======================================================

  async rejectAuctionStart(
    auctionId: string,
    adminId: string,
    reason?: string,
  ) {
    return Auction.findOneAndUpdate(
      {
        _id: auctionId,

        status: AuctionStatus.APPROVAL_PENDING,
      },

      {
        $set: {
          status: AuctionStatus.CANCELLED,

          cancelledAt: new Date(),

          cancellationReason: reason ?? "Auction start rejected by admin.",

          updatedBy: adminId,
        },
      },

      {
        new: true,
        runValidators: true,
      },
    );
  }

  // ======================================================
  // PARTNER ACTIVE AUCTION
  // ======================================================

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
      (item) => item.partnerId === partnerId,
    );

    if (!partner) {
      return null;
    }

    return {
      auctionId: auction._id.toString(),

      type: auction.type,

      status: auction.status,

      startTime: auction.startTime,

      endTime: auction.endTime,

      visibility: auction.visibility,

      partner: {
        partnerId: partner.partnerId,

        companyName: partner.companyName,

        latitude: partner.latitude,

        longitude: partner.longitude,

        state: partner.state,

        district: partner.district,
      },

      vehicles: auction.vehicles,
    };
  }

  // ======================================================
  // FIND AUCTIONS WAITING FOR ADMIN APPROVAL
  // ======================================================

  async findPendingApprovalAuctions() {
    return Auction.find({
      status: AuctionStatus.APPROVAL_PENDING,
    }).sort({
      startTime: 1,
    });
  }

  async approveAuction(auctionId: string, adminId: string) {
    const auction = await Auction.findOneAndUpdate(
      {
        _id: auctionId,
        status: AuctionStatus.DRAFT,
      },
      {
        $set: {
          status: AuctionStatus.SCHEDULED,
          createdBy: adminId,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return auction;
  }
}

export default new AuctionRepository();
