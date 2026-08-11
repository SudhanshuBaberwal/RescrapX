import axios from "axios";

import ApiError from "../lib/ApiError.js";

import { AuctionStatus } from "../models/auction.model.js";

import {
  ConfigureAuctionVehicleDto,
  CreateAuctionDto,
  PlaceBidDto,
} from "../validations/auction.validation.js";

import { calculateDistanceInKm } from "../utils/distance.js";

import auctionRepository from "../repositories/auction.repository.js";

import { env } from "../config/env.js";

const MAX_RADIUS_KM = 150;

const START_APPROVAL_WINDOW_MS = 60 * 1000;

class AuctionService {
  // =========================================================
  // CREATE AUCTION
  // =========================================================

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

    // =======================================================
    // GET PARTNERS
    // =======================================================

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

    // =======================================================
    // PREPARE VEHICLES
    // =======================================================

    const auctionVehicles = vehicles

      .filter((vehicle: any) => {
        const latitude = Number(vehicle.pickup?.latitude);

        const longitude = Number(vehicle.pickup?.longitude);

        return (
          vehicle._id &&
          vehicle.owner &&
          Number.isFinite(latitude) &&
          Number.isFinite(longitude)
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

    // =======================================================
    // FIND PARTNERS WITHIN 150 KM
    // =======================================================

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
          vehicle.latitude,
          vehicle.longitude,

          partnerLatitude,
          partnerLongitude,
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

    // =======================================================
    // CREATE DRAFT
    // =======================================================

    return auctionRepository.createAuction({
      vehicles: auctionVehicles,

      partners: auctionPartners,

      startTime: dto.startTime,

      endTime: dto.endTime,

      visibility: dto.visibility,

      autoExtend: dto.autoExtend,

      status: AuctionStatus.DRAFT,

      totalParticipants: auctionPartners.length,

      createdBy: adminId,
    });
  }

  // =========================================================
  // GET ACTIVE AUCTION
  // =========================================================

  async getAuctionData() {
    const result = await auctionRepository.findActiveAuction();

    if (!result) {
      throw new ApiError(404, "No active auction found.");
    }

    return result;
  }

  // =========================================================
  // PARTNER AUCTION
  // =========================================================

  async getAuctionDataForPartner(partnerId: string) {
    const auction =
      await auctionRepository.findActiveAuctionForPartner(partnerId);

    if (!auction) {
      throw new ApiError(404, "No active auction found for this partner.");
    }

    return auction;
  }

  // =========================================================
  // CONFIGURE VEHICLE
  // =========================================================

  async configureAuctionVehicle(
    auctionId: string,

    dto: ConfigureAuctionVehicleDto,

    adminId: string,
  ) {
    const auction = await auctionRepository.findByAuctionId(auctionId);

    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }

    // Configuration allowed only before
    // auction approval / start process

    if (auction.status !== AuctionStatus.DRAFT) {
      throw new ApiError(
        400,
        "Vehicle configuration is allowed only while auction is in DRAFT status.",
      );
    }

    const vehicle = auction.vehicles.find(
      (vehicle) => vehicle.vehicleId === dto.vehicleId,
    );

    if (!vehicle) {
      throw new ApiError(404, "Vehicle does not belong to this auction.");
    }

    if (dto.minimumBid < 0) {
      throw new ApiError(400, "Minimum bid cannot be negative.");
    }

    if (dto.reservePrice < dto.minimumBid) {
      throw new ApiError(
        400,
        "Reserve price must be greater than or equal to minimum bid.",
      );
    }

    if (dto.bidIncrement <= 0) {
      throw new ApiError(400, "Bid increment must be greater than 0.");
    }

    const updatedAuction = await auctionRepository.configureVehicle(
      auctionId,

      dto.vehicleId,

      dto.minimumBid,

      dto.reservePrice,

      dto.bidIncrement,
    );

    if (!updatedAuction) {
      throw new ApiError(404, "Unable to configure auction vehicle.");
    }

    return updatedAuction;
  }

  // =========================================================
  // ADMIN APPROVES DRAFT
  //
  // DRAFT -> SCHEDULED
  // =========================================================

  async approveAuction(auctionId: string, adminId: string) {
    const auction = await auctionRepository.findByAuctionId(auctionId);
    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }
    if (auction.status !== AuctionStatus.DRAFT) {
      throw new ApiError(
        400,

        `Auction cannot be approved because its current status is ${auction.status}.`,
      );
    }
    if (!auction.vehicles.length) {
      throw new ApiError(400, "Auction cannot be approved without vehicles.");
    }

    for (const vehicle of auction.vehicles) {
      if (
        vehicle.minimumBid == null ||
        vehicle.reservePrice == null ||
        vehicle.bidIncrement == null
      ) {
        throw new ApiError(
          400,

          `Bidding properties are missing for vehicle ${vehicle.vehicleId}.`,
        );
      }
      if (vehicle.minimumBid < 0) {
        throw new ApiError(
          400,

          `Minimum bid cannot be negative for vehicle ${vehicle.vehicleId}.`,
        );
      }
      if (vehicle.reservePrice < vehicle.minimumBid) {
        throw new ApiError(
          400,
          `Reserve price cannot be less than minimum bid for vehicle ${vehicle.vehicleId}.`,
        );
      }
      if (vehicle.bidIncrement <= 0) {
        throw new ApiError(
          400,

          `Bid increment must be greater than 0 for vehicle ${vehicle.vehicleId}.`,
        );
      }
    }
    if (auction.startTime <= new Date()) {
      throw new ApiError(400, "Auction start time must be in the future.");
    }

    if (auction.endTime <= auction.startTime) {
      throw new ApiError(400, "Auction end time must be after start time.");
    }

    const approvedAuction = await auctionRepository.approveAuction(
      auctionId,
      adminId,
    );

    if (!approvedAuction) {
      throw new ApiError(400, "Auction could not be approved.");
    }

    return approvedAuction;
  }

  async checkAuctionsForStartApproval() {
    const auctions = await auctionRepository.findAuctionsPendingStartApproval();

    for (const auction of auctions) {
      await auctionRepository.markStartApprovalPending(auction.auctionId);
    }

    return auctions.length;
  }

  async getPendingApprovalAuctions() {
    return auctionRepository.findPendingApprovalAuctions();
  }

  async approveAuctionStart(auctionId: string, adminId: string) {
    const auction = await auctionRepository.findByAuctionId(auctionId);

    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }

    if (auction.status !== AuctionStatus.SCHEDULED) {
      throw new ApiError(
        400,
        `Auction cannot be started because its current status is ${auction.status}.`,
      );
    }

    if (new Date() >= auction.endTime) {
      throw new ApiError(400, "Auction end time has already passed.");
    }

    const updatedAuction = await auctionRepository.approveAuctionStart(
      auctionId,
      adminId,
    );

    if (!updatedAuction) {
      throw new ApiError(400, "Unable to start auction.");
    }

    return updatedAuction;
  }

  async rejectAuctionStart(auctionId: string, adminId: string) {
    const auction = await auctionRepository.findByAuctionId(auctionId);

    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }

    if (!auction.startApprovalPending) {
      throw new ApiError(400, "Start approval has not been requested.");
    }

    const updatedAuction = await auctionRepository.rejectAuctionStart(
      auctionId,
      adminId,
    );

    if (!updatedAuction) {
      throw new ApiError(400, "Unable to reject auction start.");
    }
    return updatedAuction;
  }

  async startApprovedAuctions() {
    const auctions = await auctionRepository.findAuctionsReadyToGoLive();
    let count = 0;
    for (const auction of auctions) {
      // Safety check
      if (auction.endTime <= new Date()) {
        continue;
      }

      const liveAuction = await auctionRepository.markAuctionLive(
        auction._id.toString(),
      );

      if (liveAuction) {
        count++;
      }
    }

    return count;
  }

  async placeBid(dto: PlaceBidDto, partnerId: string) {
    const { auctionId, vehicleId, bidAmount } = dto;

    const auction = await auctionRepository.findByAuctionId(auctionId);

    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }

    if (auction.status !== AuctionStatus.LIVE) {
      throw new ApiError(400, "Bidding is allowed only when auction is LIVE.");
    }
    const now = new Date();

    if (now >= auction.endTime) {
      throw new ApiError(400, "Auction has already ended.");
    }
    const partner = auction.partners.find(
      (partner) => partner.partnerId === partnerId,
    );

    if (!partner) {
      throw new ApiError(403, "You are not a participant in this auction.");
    }
    const partnerVehicle = partner.vehicleIds.find(
      (vehicle) => vehicle.vehicleId === vehicleId,
    );

    if (!partnerVehicle) {
      throw new ApiError(403, "This vehicle is not assigned to your account.");
    }
    const vehicle = auction.vehicles.find(
      (vehicle) => vehicle.vehicleId === vehicleId,
    );

    if (!vehicle) {
      throw new ApiError(404, "Vehicle not found in this auction.");
    }
    if (vehicle.minimumBid == null) {
      throw new ApiError(
        400,
        "Minimum bid has not been configured for this vehicle.",
      );
    }
    if (vehicle.bidIncrement == null || vehicle.bidIncrement <= 0) {
      throw new ApiError(
        400,
        "Bid increment has not been configured correctly.",
      );
    }

    if (bidAmount < vehicle.minimumBid) {
      throw new ApiError(400, `Bid must be at least ₹${vehicle.minimumBid}.`);
    }
    const currentHighestBid = vehicle.currentHighestBid ?? 0;

    let minimumNextBid: number;

    if (currentHighestBid <= 0) {
      minimumNextBid = vehicle.minimumBid;
    } else {
      minimumNextBid = currentHighestBid + vehicle.bidIncrement;
    }

    if (bidAmount < minimumNextBid) {
      throw new ApiError(400, `Your bid must be at least ₹${minimumNextBid}.`);
    }

    if (vehicle.highestBidder === partnerId) {
      throw new ApiError(400, "You are already the highest bidder.");
    }

    const updatedAuction = await auctionRepository.placeBid(
      auctionId,
      vehicleId,
      partnerId,
      bidAmount,
      currentHighestBid,
    );

    if (!updatedAuction) {
      throw new ApiError(
        409,
        "Another bid was placed just before yours. Please refresh and place your bid again.",
      );
    }
    const updatedVehicle = updatedAuction.vehicles.find(
      (vehicle) => vehicle.vehicleId === vehicleId,
    );

    return {
      auctionId: updatedAuction._id.toString(),
      vehicleId,
      bidAmount,
      currentHighestBid: updatedVehicle?.currentHighestBid,
      highestBidder: updatedVehicle?.highestBidder,
      totalBids: updatedVehicle?.totalBids,
      message: "Bid placed successfully.",
    };
  }
}

export default new AuctionService();
