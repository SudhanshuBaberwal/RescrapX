import ApiError from "../lib/ApiError.js";
import { AuctionStatus, WinnerStatus } from "../models/auction.model.js";

import { CreateAuctionDto } from "../validations/auction.validation.js";

import { calculateDistanceInKm } from "../utils/distance.js";
import { vehicleClient } from "../client/vehicle.client.js";
import { partnerClient } from "../client/partner.client.js";
import auctionRepository from "../repositories/auction.repository.js";

const MAX_RADIUS_KM = 150;
class AuctionService {
  async createAuction(dto: CreateAuctionDto, adminId: string, token: string) {
    const vehicles = await vehicleClient.getReadyForBiddingVehicles(token);

    if (!vehicles || vehicles.length === 0) {
      throw new ApiError(404, "No vehicles are ready for bidding.");
    }

    const partners = await partnerClient.getAuctionReadyPartners(token);

    if (!partners || partners.length === 0) {
      throw new ApiError(404, "No partners are ready for auction.");
    }
    const auctionVehicles = vehicles
      .filter((vehicle: any) => {
        const lat = Number(vehicle.location?.latitude);
        const lng = Number(vehicle.location?.longitude);
        return Number.isFinite(lat) && Number.isFinite(lng);
      })
      .map((vehicle: any) => ({
        vehicleId: String(vehicle._id),
        sellerId: String(vehicle.owner),
        model: vehicle.vehicleDetails?.model,
        latitude: Number(vehicle.location.latitude),
        longitude: Number(vehicle.location.longitude),
        state: vehicle.location?.state,
        district: vehicle.location?.district,
      }));

    if (auctionVehicles.length === 0) {
      throw new ApiError(400, "No vehicles have valid location data.");
    }

    const auctionPartners: any[] = [];
    for (const partner of partners) {
      const partnerLat = Number(partner.company?.location?.latitude);
      const partnerLng = Number(partner.company?.location?.longitude);

      if (!Number.isFinite(partnerLat) || !Number.isFinite(partnerLng)) {
        continue;
      }
      const eligibleVehicleIds: string[] = [];

      for (const vehicle of auctionVehicles) {
        const distance = calculateDistanceInKm(
          partnerLat,
          partnerLng,
          vehicle.latitude,
          vehicle.longitude,
        );

        if (distance <= MAX_RADIUS_KM) {
          eligibleVehicleIds.push(vehicle.vehicleId);
        }
      }
      if (eligibleVehicleIds.length > 0) {
        auctionPartners.push({
          partnerId: String(partner._id),
          companyName: partner.company?.companyName,
          latitude: partnerLat,
          longitude: partnerLng,
          state: partner.company?.state,
          district: partner.company?.city,
          vehicleIds: eligibleVehicleIds,
        });
      }
    }
    if (auctionPartners.length === 0) {
      throw new ApiError(
        404,
        "No partners found within 150 KM of available vehicles.",
      );
    }
    const auction = await auctionRepository.createAuction({
      vehicles: auctionVehicles,
      partners: auctionPartners,
      minimumBid: dto.minimumBid,
      reservePrice: dto.reservePrice,
      bidIncrement: dto.bidIncrement,
      startTime: dto.startTime,
      endTime: dto.endTime,
      visibility: dto.visibility,
      autoExtend: dto.autoExtend,
      status: AuctionStatus.SCHEDULED,
      winnerStatus: WinnerStatus.PENDING,
      totalParticipants: auctionPartners.length,
      createdBy: adminId,
    });
    return auction;
  }
}

export default new AuctionService();
