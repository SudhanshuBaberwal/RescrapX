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
    /*
     * ============================================================
     * 1. GET VEHICLES READY FOR AUCTION
     * ============================================================
     */

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

      // Expected:
      // {
      //   success: true,
      //   data: [...]
      // }
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

    /*
     * ============================================================
     * 2. GET PARTNERS READY FOR AUCTION
     * ============================================================
     */

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

      // Expected:
      // {
      //   success: true,
      //   data: [...]
      // }
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

    /*
     * ============================================================
     * 3. PREPARE VEHICLES
     *
     * Supports:
     *
     * A. {
     *      latitude: 15.45,
     *      longitude: 75.00
     *    }
     *
     * B. GeoJSON:
     *
     *    {
     *      type: "Point",
     *      coordinates: [longitude, latitude]
     *    }
     * ============================================================
     */

    const auctionVehicles = vehicles
      .map((vehicle: any) => {
        let latitude: number;
        let longitude: number;

        // GeoJSON
        if (
          Array.isArray(vehicle.location?.coordinates) &&
          vehicle.location.coordinates.length >= 2
        ) {
          longitude = Number(vehicle.location.coordinates[0]);

          latitude = Number(vehicle.location.coordinates[1]);
        }

        // Normal latitude/longitude
        else {
          latitude = Number(vehicle.location?.latitude);

          longitude = Number(vehicle.location?.longitude);
        }

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }

        return {
          vehicleId: String(vehicle._id),

          sellerId: String(vehicle.owner),

          model: vehicle.vehicleDetails?.model ?? vehicle.model ?? null,

          latitude,

          longitude,

          state: vehicle.location?.state ?? null,

          district:
            vehicle.location?.district ?? vehicle.location?.city ?? null,
        };
      })
      .filter(
        (vehicle): vehicle is NonNullable<typeof vehicle> => vehicle !== null,
      );

    if (auctionVehicles.length === 0) {
      throw new ApiError(400, "No vehicles have valid latitude and longitude.");
    }

    /*
     * ============================================================
     * 4. MATCH PARTNERS WITH VEHICLES
     *
     * MAXIMUM RADIUS = 150 KM
     * ============================================================
     */

    const auctionPartners: any[] = [];

    for (const partner of partners) {
      let partnerLatitude: number;
      let partnerLongitude: number;

      /*
       * Partner GeoJSON location
       */
      if (
        Array.isArray(partner.company?.location?.coordinates) &&
        partner.company.location.coordinates.length >= 2
      ) {
        partnerLongitude = Number(partner.company.location.coordinates[0]);

        partnerLatitude = Number(partner.company.location.coordinates[1]);
      } else {

      /*
       * Partner normal latitude/longitude
       */
        partnerLatitude = Number(partner.company?.location?.latitude);

        partnerLongitude = Number(partner.company?.location?.longitude);
      }

      /*
       * Partner doesn't have valid location
       */
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

      /*
       * Compare this partner with every vehicle
       */
      for (const vehicle of auctionVehicles) {
        const distance = calculateDistanceInKm(
          partnerLatitude,
          partnerLongitude,
          vehicle.latitude,
          vehicle.longitude,
        );

        /*
         * Vehicle is inside partner's 150 KM radius
         */
        if (distance <= MAX_RADIUS_KM) {
          eligibleVehicles.push({
            vehicleId: vehicle.vehicleId,
            distanceInKm: Number(distance.toFixed(2)),
          });
        }
      }

      /*
       * Add partner only if at least one vehicle
       * is within 150 KM
       */
      if (eligibleVehicles.length > 0) {
        auctionPartners.push({
          partnerId: String(partner._id),

          companyName: partner.company?.companyName ?? null,

          latitude: partnerLatitude,

          longitude: partnerLongitude,

          state: partner.company?.state ?? null,

          district: partner.company?.city ?? partner.company?.district ?? null,

          vehicleIds: eligibleVehicles,
        });
      }
    }

    /*
     * ============================================================
     * 5. CHECK ELIGIBLE PARTNERS
     * ============================================================
     */

    if (auctionPartners.length === 0) {
      throw new ApiError(
        404,
        "No partners found within 150 KM of available vehicles.",
      );
    }

    /*
     * ============================================================
     * 6. CREATE ONE AUCTION
     * ============================================================
     */

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

    /*
     * ============================================================
     * 7. RETURN AUCTION
     * ============================================================
     */

    return auction;
  }
}

export default new AuctionService();
