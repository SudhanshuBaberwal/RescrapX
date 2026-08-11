import axios from "axios";

import ApiError from "../lib/ApiError.js";
import { AuctionStatus, WinnerStatus } from "../models/auction.model.js";
import { CreateAuctionDto } from "../validations/auction.validation.js";
import { calculateDistanceInKm } from "../utils/distance.js";
import auctionRepository from "../repositories/auction.repository.js";
import { env } from "../config/env.js";
const MAX_RADIUS_KM = 150;
class AuctionService {
  async createAuction(dto: CreateAuctionDto, adminId: string) {
    let vehicles: any[] = [];

    try {
      const response = await axios.get(
        "http://localhost:8004/register/ready-for-auction",
        {
          headers: {
            "x-service-key": env.INTERNAL_SERVICE_TOKEN,
          },
        },
      );

      vehicles = response.data?.data ?? [];
    } catch (error: any) {
      throw new ApiError(
        error.response?.status || 500,
        `Vehicle Service Error: ${
          error.response?.data?.message || "Unknown error"
        }`,
      );
    }

    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      throw new ApiError(404, "No vehicles are ready for auction.");
    }

    let partners: any[] = [];

    try {
      const response = await axios.get(
        "http://localhost:8001/partner/ready-for-auction",
        {
          headers: {
            "x-service-key": env.INTERNAL_SERVICE_TOKEN,
          },
        },
      );

      partners = response.data?.data ?? [];
    } catch (error: any) {
      throw new ApiError(
        error.response?.status || 500,
        `Partner Service Error: ${
          error.response?.data?.message || "Unknown error"
        }`,
      );
    }

    if (!Array.isArray(partners) || partners.length === 0) {
      throw new ApiError(404, "No partners are ready for auction.");
    }

    const auctionVehicles = vehicles
      .filter((vehicle: any) => {
        const latitude = Number(vehicle.pickup?.latitude);
        const longitude = Number(vehicle.pickup?.longitude);

        return (
          Number.isFinite(latitude) &&
          Number.isFinite(longitude) &&
          vehicle._id &&
          vehicle.owner
        );
      })
      .map((vehicle: any) => ({
        vehicleId: String(vehicle._id),
        sellerId: String(vehicle.owner),
        model: vehicle.vehicleDetails?.model ?? null,
        latitude: Number(vehicle.pickup.latitude),
        longitude: Number(vehicle.pickup.longitude),
        state: vehicle.pickup?.state ?? null,
        district: vehicle.pickup?.city ?? null,
      }));

    if (auctionVehicles.length === 0) {
      throw new ApiError(400, "No vehicles have valid latitude and longitude.");
    }

    const auctionPartners: any[] = [];

    for (const partner of partners) {
      const partnerLatitude = Number(partner.company?.latitude);
      const partnerLongitude = Number(partner.company?.longitude);

      if (
        !Number.isFinite(partnerLatitude) ||
        !Number.isFinite(partnerLongitude)
      ) {
        continue;
      }

      const eligibleVehicles: {
        vehicleId: string;
        distanceInKm: number;
      }[] = [];

      for (const vehicle of auctionVehicles) {
        const distance = calculateDistanceInKm(
          partnerLatitude,
          partnerLongitude,
          vehicle.latitude,
          vehicle.longitude,
        );

        if (distance <= MAX_RADIUS_KM) {
          eligibleVehicles.push({
            vehicleId: vehicle.vehicleId,
            distanceInKm: Number(distance.toFixed(2)),
          });
        }
      }

      if (eligibleVehicles.length > 0) {
        auctionPartners.push({
          partnerId: String(partner._id),
          companyName: partner.company?.companyName ?? null,
          latitude: partnerLatitude,
          longitude: partnerLongitude,
          state: partner.company?.state ?? null,
          district: partner.company?.city ?? null,
          vehicleIds: eligibleVehicles,
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

      startTime: dto.startTime,
      endTime: dto.endTime,

      visibility: dto.visibility,
      autoExtend: dto.autoExtend,

      status: AuctionStatus.SCHEDULED,
      // winnerStatus: WinnerStatus.PENDING,

      totalParticipants: auctionPartners.length,

      createdBy: adminId,
    });

    return auction;
  }

  async getAuctionData(){
    const result = await auctionRepository.findActiveAuction()
    return result;
  }
}

export default new AuctionService();
