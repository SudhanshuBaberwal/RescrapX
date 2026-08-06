import Auction, {
  IAuction,
  AuctionStatus,
  WinnerStatus,
} from "../models/auction.model.js";

class AuctionRepository {
  /* -------------------------------------------------------------------------- */
  /*                                CREATE                                      */
  /* -------------------------------------------------------------------------- */

  async createAuction(data: Partial<IAuction>) {
    return Auction.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 FIND                                       */
  /* -------------------------------------------------------------------------- */

  async findById(id: string) {
    return Auction.findById(id);
  }

  async findByAuctionId(auctionId: string) {
    return Auction.findOne({ auctionId });
  }

  async findByVehicleId(vehicleId: string) {
    return Auction.findOne({ vehicleId });
  }

  async findBySellerId(sellerId: string) {
    return Auction.find({ sellerId }).sort({
      createdAt: -1,
    });
  }

  async findLiveAuctions() {
    return Auction.find({
      status: AuctionStatus.LIVE,
    }).sort({
      endTime: 1,
    });
  }

  async findScheduledAuctions() {
    return Auction.find({
      status: AuctionStatus.SCHEDULED,
    }).sort({
      startTime: 1,
    });
  }

  async findEndedAuctions() {
    return Auction.find({
      status: AuctionStatus.ENDED,
    }).sort({
      endTime: -1,
    });
  }

  async findCompletedAuctions() {
    return Auction.find({
      status: AuctionStatus.COMPLETED,
    }).sort({
      completedAt: -1,
    });
  }

  async findCancelledAuctions() {
    return Auction.find({
      status: AuctionStatus.CANCELLED,
    }).sort({
      cancelledAt: -1,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                UPDATE                                      */
  /* -------------------------------------------------------------------------- */

  async startAuction(id: string) {
    return Auction.findByIdAndUpdate(
      id,
      {
        status: AuctionStatus.LIVE,
      },
      {
        new: true,
      },
    );
  }

  async endAuction(id: string) {
    return Auction.findByIdAndUpdate(
      id,
      {
        status: AuctionStatus.ENDED,
      },
      {
        new: true,
      },
    );
  }

  async completeAuction(id: string) {
    return Auction.findByIdAndUpdate(
      id,
      {
        status: AuctionStatus.COMPLETED,
        completedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  async cancelAuction(id: string, reason: string) {
    return Auction.findByIdAndUpdate(
      id,
      {
        status: AuctionStatus.CANCELLED,
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  async assignWinner(id: string, winnerPartner: string, winnerBid: number) {
    return Auction.findByIdAndUpdate(
      id,
      {
        winnerPartner,
        winnerBid,
        winnerStatus: WinnerStatus.PENDING,
      },
      {
        new: true,
      },
    );
  }

  async updateWinnerStatus(id: string, winnerStatus: WinnerStatus) {
    return Auction.findByIdAndUpdate(
      id,
      {
        winnerStatus,
      },
      {
        new: true,
      },
    );
  }

  async updateHighestBid(id: string, partnerId: string, bidAmount: number) {
    return Auction.findByIdAndUpdate(
      id,
      {
        highestBidder: partnerId,
        currentHighestBid: bidAmount,
      },
      {
        new: true,
      },
    );
  }

  async incrementBidCount(id: string) {
    return Auction.findByIdAndUpdate(
      id,
      {
        $inc: {
          totalBids: 1,
        },
      },
      {
        new: true,
      },
    );
  }

  async incrementParticipantCount(id: string) {
    return Auction.findByIdAndUpdate(
      id,
      {
        $inc: {
          totalParticipants: 1,
        },
      },
      {
        new: true,
      },
    );
  }

  async extendAuction(id: string, newEndTime: Date) {
    return Auction.findByIdAndUpdate(
      id,
      {
        endTime: newEndTime,
        $inc: {
          extensionCount: 1,
        },
      },
      {
        new: true,
      },
    );
  }

  async saveAuction(auction: IAuction) {
    return auction.save();
  }

  async deleteAuction(id: string) {
    return Auction.findByIdAndDelete(id);
  }

  /* -------------------------------------------------------------------------- */
  /*                               ANALYTICS                                    */
  /* -------------------------------------------------------------------------- */

  async getDashboardStats() {
    const [total, live, scheduled, ended, completed, cancelled] =
      await Promise.all([
        Auction.countDocuments(),
        Auction.countDocuments({
          status: AuctionStatus.LIVE,
        }),
        Auction.countDocuments({
          status: AuctionStatus.SCHEDULED,
        }),
        Auction.countDocuments({
          status: AuctionStatus.ENDED,
        }),
        Auction.countDocuments({
          status: AuctionStatus.COMPLETED,
        }),
        Auction.countDocuments({
          status: AuctionStatus.CANCELLED,
        }),
      ]);

    return {
      total,
      live,
      scheduled,
      ended,
      completed,
      cancelled,
    };
  }
}

export default new AuctionRepository();
