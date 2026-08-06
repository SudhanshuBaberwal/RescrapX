import vehicleClient from "../client/vehicle.client.js";
import ApiError from "../lib/ApiError.js";
import { AuctionStatus, WinnerStatus } from "../models/auction.model.js";
import auctionRepository from "../repositories/auction.repository.js";
import { CreateAuctionDto } from "../validations/auction.validation.js";

class AuctionService {
  async createAuction(dto: CreateAuctionDto, adminId: string, token: string) {
    const vehicle = await vehicleClient.getVehicle(dto.vehicleId, token);
    if (!vehicle) {
      throw new ApiError(404, "Vehicle Not Found");
    }

    if (vehicle.status !== "READY_FOR_BIDDING") {
      throw new ApiError(400, "Vehicle is Not Ready for auction.");
    }

    const existingAuction = await auctionRepository.findByVehicleId(
      dto.vehicleId,
    );
    if (existingAuction && existingAuction.status !== AuctionStatus.CANCELLED) {
      throw new ApiError(409, "Auction is already existing for this vehicle");
    }

    const auction = await auctionRepository.createAuction({
      vehicleId: dto.vehicleId,
      sellerId: vehicle.owner,
      minimumBid: dto.minimumBid,
      reservePrice: dto.reservePrice,
      bidIncrement: dto.bidIncrement,
      startTime: dto.startTime,
      endTime: dto.endTime,
      visibility: dto.visibility,
      autoExtend: dto.autoExtend,
      status: AuctionStatus.SCHEDULED,
      winnerStatus: WinnerStatus.PENDING,
      createdBy: adminId,
    });
    return auction;
  }
  async startAuction() {}
  async endAuction() {}
  async cancelAuction() {}
  async getLiveAuctions() {}
  async getAuctionDetails() {}
}

export default new AuctionService();
