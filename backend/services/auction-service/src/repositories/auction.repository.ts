import Auction, {
  AuctionStatus,
  IAuction,
  VehicleAssignedStatus,
} from "../models/auction.model.js";

class AuctionRepository {
  async createAuction(data: Partial<IAuction>) {
    return Auction.create(data);
  }

  async findByAuctionId(auctionId: string) {
    return Auction.findById(auctionId);
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
          // AuctionStatus.ENDED
        ],
      },
    }).sort({ createdAt: -1 });
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
        new: true,
        runValidators: true,
      },
    );
  }

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

  // ==========================================
  // ADMIN DASHBOARD STATS
  // ==========================================

  async getAdminAuctionStats() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const [
      liveAuctions,
      upcomingAuctions,
      completedToday,
      cancelledAuctions,
      bidStats,
    ] = await Promise.all([
      Auction.countDocuments({
        status: AuctionStatus.LIVE,
      }),
      Auction.countDocuments({
        status: {
          $in: [
            AuctionStatus.SCHEDULED,
            AuctionStatus.APPROVAL_PENDING,
            AuctionStatus.START_APPROVED,
          ],
        },
        startTime: {
          $gt: new Date(),
        },
      }),
      Auction.countDocuments({
        status: AuctionStatus.ENDED,
        completedAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }),
      Auction.countDocuments({
        status: AuctionStatus.CANCELLED,
      }),
      Auction.aggregate([
        {
          $unwind: "$vehicles",
        },
        {
          $match: {
            "vehicles.currentHighestBid": {
              $gt: 0,
            },
          },
        },
        {
          $group: {
            _id: null,
            averageBid: {
              $avg: "$vehicles.currentHighestBid",
            },
            highestBid: {
              $max: "$vehicles.currentHighestBid",
            },
          },
        },
      ]),
    ]);

    return {
      liveAuctions,
      upcomingAuctions,
      completedToday,
      cancelledAuctions,
      averageBid: Math.round(bidStats[0]?.averageBid ?? 0),
      highestBidToday: bidStats[0]?.highestBid ?? 0,
    };
  }

  // ==========================================
  // ADMIN AUCTION LIST
  // ==========================================

  async findAdminAuctions(params: {
    search?: string;
    status?: string;
    type?: string;
    state?: string;
    duration?: string;

    page: number;
    limit: number;
  }) {
    const { search, status, type, state, duration, page, limit } = params;

    const filter: any = {};

    // -------------------------------
    // STATUS
    // -------------------------------

    if (status && status !== "ALL") {
      filter.status = status;
    }

    // -------------------------------
    // TYPE
    // -------------------------------

    if (type && type !== "ALL") {
      filter.type = type;
    }

    // -------------------------------
    // SEARCH
    // -------------------------------

    if (search) {
      filter.$or = [
        {
          auctionId: {
            $regex: search,
            $options: "i",
          },
        },

        {
          "vehicles.vehicleId": {
            $regex: search,
            $options: "i",
          },
        },

        {
          "vehicles.district": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // -------------------------------
    // STATE
    // -------------------------------

    if (state && state !== "ALL") {
      filter["vehicles.state"] = state;
    }

    // -------------------------------
    // DURATION
    // -------------------------------

    const now = new Date();

    if (duration === "LIVE") {
      filter.status = AuctionStatus.LIVE;
    }

    if (duration === "UPCOMING") {
      filter.status = {
        $in: [
          AuctionStatus.SCHEDULED,
          AuctionStatus.APPROVAL_PENDING,
          AuctionStatus.START_APPROVED,
        ],
      };

      filter.startTime = {
        $gt: now,
      };
    }

    if (duration === "ENDED") {
      filter.status = AuctionStatus.ENDED;
    }

    // -------------------------------
    // PAGINATION
    // -------------------------------

    const skip = (page - 1) * limit;

    const [auctions, total] = await Promise.all([
      Auction.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Auction.countDocuments(filter),
    ]);

    return {
      auctions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==========================================
  // SINGLE AUCTION DETAILS
  // ==========================================

  async findAdminAuctionById(auctionId: string) {
    return Auction.findById(auctionId).lean();
  }

  async getAdminAuctionActivity(limit = 20) {
    return Auction.aggregate([
      {
        $unwind: "$vehicles",
      },

      {
        $match: {
          "vehicles.totalBids": {
            $gt: 0,
          },
        },
      },

      {
        $sort: {
          updatedAt: -1,
        },
      },

      {
        $limit: limit,
      },

      {
        $project: {
          _id: 0,
          auctionId: "$_id",
          requestId: "$auctionId",
          vehicleId: "$vehicles.vehicleId",
          highestBid: "$vehicles.currentHighestBid",
          totalBids: "$vehicles.totalBids",
          bidder: "$vehicles.highestBidder",
          status: 1,
          updatedAt: 1,
        },
      },
    ]);
  }

  // ==========================================
  // CANCEL AUCTION
  // ==========================================

  async cancelAuction(auctionId: string, adminId: string, reason: string) {
    return Auction.findOneAndUpdate(
      {
        _id: auctionId,

        status: {
          $in: [
            AuctionStatus.DRAFT,
            AuctionStatus.SCHEDULED,
            AuctionStatus.APPROVAL_PENDING,
            AuctionStatus.START_APPROVED,
          ],
        },
      },

      {
        $set: {
          status: AuctionStatus.CANCELLED,

          cancelledAt: new Date(),

          cancellationReason: reason,

          updatedBy: adminId,
        },
      },

      {
        new: true,
        runValidators: true,
      },
    );
  }


  async findByAuctionIds(auctionIds: string[]) {
  if (!auctionIds.length) {
    return [];
  }

  return Auction.find({
    auctionId: {
      $in: auctionIds,
    },
  }).lean();
}
}

export default new AuctionRepository();
