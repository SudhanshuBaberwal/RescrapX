import axios from "axios";
import ApiError from "../lib/ApiError.js";
import { emitAuctionEnded, emitBidUpdated } from "../socket/auction.event.js";
import {
  AuctionStatus,
  VehicleAssignedStatus,
} from "../models/auction.model.js";
import {
  ConfigureAuctionVehicleDto,
  CreateAuctionDto,
  PlaceBidDto,
} from "../validations/auction.validation.js";
import { calculateDistanceInKm } from "../utils/distance.js";
import auctionRepository from "../repositories/auction.repository.js";
import { env } from "../config/env.js";
import crypto from "crypto";
import bidRepository from "../repositories/bid.repository.js";
const MAX_RADIUS_KM = 150;
const APPROVAL_WINDOW_MS = 3 * 60 * 1000;

async function updateVehicleAuctionResult(
  vehicleId: string,
  status: "SOLD" | "UNSOLD",
  auctionId: string,
  partnerId: string | null,
  winningBid: number | null,
) {
  try {
    console.log("========== VEHICLE AUCTION RESULT ==========");

    console.log({
      vehicleId,
      status,
      auctionId,
      partnerId,
      winningBid,
    });

    const response = await axios.patch(
      "http://localhost:8004/register/auction/status",
      {
        vehicleId,
        status,
        auctionId,
        partnerId,
        winningBid,
      },
      {
        headers: {
          "x-service-key": env.INTERNAL_SERVICE_TOKEN,
        },
      },
    );

    console.log("Vehicle Service Response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("========== VEHICLE AUCTION RESULT FAILED ==========");

    console.error("Vehicle ID:", vehicleId);

    console.error("Status:", status);

    console.error("Partner:", partnerId);

    console.error("Winning Bid:", winningBid);

    console.error("Status Code:", error.response?.status);

    console.error("Response:", error.response?.data);

    throw error;
  }
}
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
        error.response?.status ?? 500,

        `Vehicle Service Error: ${
          error.response?.data?.message ?? "Unknown error"
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
        error.response?.status ?? 500,

        `Partner Service Error: ${
          error.response?.data?.message ?? "Unknown error"
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
          vehicle._id &&
          vehicle.owner &&
          Number.isFinite(latitude) &&
          Number.isFinite(longitude)
        );
      })
      .map((vehicle: any) => ({
        vehicleId: String(vehicle._id),
        sellerId: String(vehicle.owner),
        latitude: Number(vehicle.pickup.latitude),
        longitude: Number(vehicle.pickup.longitude),
        state: vehicle.pickup?.state ?? null,
        district: vehicle.pickup?.city ?? null,
        minimumBid: null,
        bidIncrement: null,
        reservePrice: null,
        currentHighestBid: 0,
        highestBidder: null,
        totalBids: 0,
        assignedPartnerId: null,
        assignedStatus: VehicleAssignedStatus.PENDING,
        winnerBid: null,
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
        });
      }
    }
    if (auctionPartners.length === 0) {
      throw new ApiError(
        404,
        "No partners found within 150 KM of available vehicles.",
      );
    }
    const auctionId = crypto.randomUUID();
    return auctionRepository.createAuction({
      auctionId,
      vehicles: auctionVehicles,
      partners: auctionPartners,
      status: AuctionStatus.DRAFT,
      startTime: dto.startTime,
      endTime: dto.endTime,
      visibility: dto.visibility,
      totalParticipants: auctionPartners.length,
      totalBids: 0,
      startApprovalRequestedAt: null,
      startApprovedAt: null,
      createdBy: adminId,
    });
  }

  async getAuctionData() {
    const auction = await auctionRepository.findActiveAuction();
    if (!auction) {
      throw new ApiError(404, "No active auction found.");
    }
    return auction;
  }

  async getAuctionDataForPartner(partnerId: string) {
    const auction =
      await auctionRepository.findActiveAuctionForPartner(partnerId);
    if (!auction) {
      throw new ApiError(404, "No active auction found for this partner.");
    }
    return auction;
  }

  async configureAuctionVehicle(
    auctionId: string,
    dto: ConfigureAuctionVehicleDto,
    adminId: string,
  ) {
    const auction = await auctionRepository.findByAuctionId(auctionId);
    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }
    if (auction.status !== AuctionStatus.DRAFT) {
      throw new ApiError(
        400,
        "Vehicle configuration is allowed only in DRAFT status.",
      );
    }
    const vehicle = auction.vehicles.find(
      (item) => item.vehicleId === dto.vehicleId,
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
    if (auction.vehicles.length === 0) {
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
    const now = new Date();
    if (auction.startTime <= now) {
      throw new ApiError(400, "Auction start time must be in the future.");
    }

    if (auction.endTime <= auction.startTime) {
      throw new ApiError(400, "Auction end time must be after start time.");
    }
    const updatedAuction = await auctionRepository.approveAuction(
      auctionId,
      adminId,
    );

    if (!updatedAuction) {
      throw new ApiError(400, "Unable to approve auction.");
    }

    return updatedAuction;
  }

  async checkAuctionsForStartApproval() {
    const auctions = await auctionRepository.findAuctionsRequiringApproval();
    let count = 0;
    for (const auction of auctions) {
      const updated = await auctionRepository.requestAuctionApproval(
        auction._id.toString(),
      );
      if (updated) {
        count++;
      }
    }
    return count;
  }

  async getPendingApprovalAuctions() {
    return auctionRepository.findPendingApprovalAuctions();
  }

  async approveAuctionStart(auctionId: string, adminId: string) {
    const auction = await auctionRepository.findByAuctionId(auctionId);
    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }
    if (auction.status !== AuctionStatus.APPROVAL_PENDING) {
      throw new ApiError(
        400,
        `Auction cannot be approved because its current status is ${auction.status}.`,
      );
    }
    const now = new Date();
    if (auction.endTime <= now) {
      throw new ApiError(400, "Auction has already expired.");
    }
    const updatedAuction = await auctionRepository.approveAuctionStart(
      auctionId,
      adminId,
    );

    if (!updatedAuction) {
      throw new ApiError(400, "Unable to approve auction start.");
    }

    return updatedAuction;
  }

  async rejectAuctionStart(
    auctionId: string,
    adminId: string,
    reason?: string,
  ) {
    const auction = await auctionRepository.findByAuctionId(auctionId);

    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }

    if (auction.status !== AuctionStatus.APPROVAL_PENDING) {
      throw new ApiError(
        400,

        `Start approval is not pending. Current status: ${auction.status}`,
      );
    }

    const updatedAuction = await auctionRepository.rejectAuctionStart(
      auctionId,
      adminId,
      reason,
    );

    if (!updatedAuction) {
      throw new ApiError(400, "Unable to reject auction start.");
    }

    return updatedAuction;
  }

  async startApprovedAuctions() {
    const auctions = await auctionRepository.findAuctionsReadyToStart();
    let count = 0;
    for (const auction of auctions) {
      const started = await auctionRepository.startApprovedAuction(
        auction._id.toString(),
      );

      if (started) {
        count++;
      }
    }

    return count;
  }

  async placeBid(
    auctionId: string,
    vehicleId: string,
    partnerId: string,
    bidAmount: number,
  ) {
    const auction = await auctionRepository.findByAuctionId(auctionId);
    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }
    // Auction must be LIVE
    if (auction.status !== AuctionStatus.LIVE) {
      throw new ApiError(400, "Auction is not live.");
    }

    // Auction must not be expired
    if (new Date() >= auction.endTime) {
      throw new ApiError(400, "Auction time is over. Bidding is closed.");
    }

    // Find vehicle
    const vehicle = auction.vehicles.find(
      (item) => item.vehicleId === vehicleId,
    );

    if (!vehicle) {
      throw new ApiError(404, "Vehicle does not belong to this auction.");
    }

    // Check partner
    const partnerExists = auction.partners.some(
      (partner) => partner.partnerId === partnerId,
    );

    if (!partnerExists) {
      throw new ApiError(403, "Partner is not allowed to bid in this auction.");
    }

    // Check increment
    if (vehicle.bidIncrement == null || vehicle.bidIncrement <= 0) {
      throw new ApiError(400, "Bid increment is not configured.");
    }

    // Validate bid
    if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
      throw new ApiError(400, "Bid amount must be greater than 0.");
    }

    if (bidAmount < vehicle.bidIncrement) {
      throw new ApiError(400, `Bid must be at least ₹${vehicle.bidIncrement}.`);
    }
    const currentVehiclePrice =
      vehicle.currentHighestBid && vehicle.currentHighestBid > 0
        ? vehicle.currentHighestBid
        : (vehicle.minimumBid ?? 0);

    const newVehiclePrice = currentVehiclePrice + bidAmount;

    console.log("========== BID ==========");
    console.log("Auction:", auctionId);
    console.log("Vehicle:", vehicleId);
    console.log("Current Price:", currentVehiclePrice);
    console.log("Bid Amount:", bidAmount);
    console.log("New Price:", newVehiclePrice);
    const updatedAuction = await auctionRepository.updateVehicleBid(
      auctionId,
      vehicleId,
      newVehiclePrice,
      partnerId,
      // vehicle.currentHighestBid ?? 0,
    );

    if (!updatedAuction) {
      throw new ApiError(
        409,
        "Bid could not be placed. Vehicle price was updated by another bidder. Please try again.",
      );
    }

    const updatedVehicle = updatedAuction.vehicles.find(
      (item) => item.vehicleId === vehicleId,
    );

    if (!updatedVehicle) {
      throw new ApiError(500, "Updated vehicle not found.");
    }

    // SAVE BID HISTORY
    await bidRepository.createBid({
      auctionId,
      vehicleId,
      partnerId,
      amount: bidAmount,
    });

    emitBidUpdated({
      auctionId,
      vehicleId,
      currentHighestBid: updatedVehicle.currentHighestBid,
      highestBidder: updatedVehicle.highestBidder,
      totalBids: updatedVehicle.totalBids,
    });

    return {
      auctionId,
      vehicleId,
      currentVehiclePrice: updatedVehicle.currentHighestBid,
      highestBidder: updatedVehicle.highestBidder,
      totalBids: updatedVehicle.totalBids,
      minimumBid: updatedVehicle.minimumBid,
      bidIncrement: updatedVehicle.bidIncrement,
      reservePrice: updatedVehicle.reservePrice,

      partnerBid: bidAmount,
    };
  }

  async finalizeAuction(auctionId: string) {
    const auction =
      await auctionRepository.closeAuctionAndAssignWinners(auctionId);
    if (!auction) {
      console.log("Auction already finalized or not found:", auctionId);
      return null;
    }
    const winners = [];
    for (const vehicle of auction.vehicles) {
      const status = vehicle.assignedStatus === "ASSIGNED" ? "SOLD" : "UNSOLD";
      await updateVehicleAuctionResult(
        vehicle.vehicleId,
        status,
        auction.auctionId,
        vehicle.assignedPartnerId,
        vehicle.winnerBid,
      );
      if (vehicle.assignedStatus === "UNSOLD") {
        continue;
      }
      if (vehicle.assignedStatus === "ASSIGNED" && vehicle.assignedPartnerId) {
        winners.push({
          vehicleId: vehicle.vehicleId,
          partnerId: vehicle.assignedPartnerId,
          finalPrice: vehicle.currentHighestBid ?? 0,
        });
      }
    }
    emitAuctionEnded({
      auctionId: auction._id.toString(),
      vehicles: auction.vehicles.map((vehicle) => ({
        vehicleId: vehicle.vehicleId,
        finalPrice: vehicle.currentHighestBid ?? 0,
        highestBidder: vehicle.highestBidder ?? null,
        assignedPartnerId: vehicle.assignedPartnerId ?? null,
        assignmentStatus: vehicle.assignedStatus,
      })),
    });
    return {
      auctionId: auction._id.toString(),
      status: auction.status,
      completedAt: auction.completedAt,
      winners,
      vehicles: auction.vehicles,
    };
  }

  async getAdminAuctionStats() {
    return auctionRepository.getAdminAuctionStats();
  }

  // ==========================================
  // SINGLE AUCTION
  // ==========================================

  async getAdminAuctionById(auctionId: string) {
    const auction = await auctionRepository.findAdminAuctionById(auctionId);

    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }

    return auction;
  }

  // ==========================================
  // LIVE ACTIVITY
  // ==========================================

  async getAdminAuctionActivity(limit?: number) {
    return auctionRepository.getAdminAuctionActivity(
      Math.min(Math.max(Number(limit ?? 20), 1), 100),
    );
  }

  // ==========================================
  // CANCEL AUCTION
  // ==========================================

  async cancelAdminAuction(
    auctionId: string,
    adminId: string,
    reason?: string,
  ) {
    const auction = await auctionRepository.findByAuctionId(auctionId);

    if (!auction) {
      throw new ApiError(404, "Auction not found.");
    }

    if (auction.status === AuctionStatus.ENDED) {
      throw new ApiError(400, "Ended auction cannot be cancelled.");
    }

    if (auction.status === AuctionStatus.CANCELLED) {
      throw new ApiError(400, "Auction is already cancelled.");
    }

    const cancelled = await auctionRepository.cancelAuction(
      auctionId,
      adminId,
      reason ?? "Auction cancelled by admin.",
    );

    if (!cancelled) {
      throw new ApiError(400, "Auction could not be cancelled.");
    }

    return cancelled;
  }

  // ==========================================
  // ADMIN AUCTION LIST
  // ==========================================

  async getAdminAuctions(params: {
    search?: string;
    status?: string;
    type?: string;
    state?: string;
    duration?: string;

    page?: number;
    limit?: number;
  }) {
    const page = Math.max(Number(params.page ?? 1), 1);

    const limit = Math.min(Math.max(Number(params.limit ?? 10), 1), 100);

    return auctionRepository.findAdminAuctions({
      ...params,
      page,
      limit,
    });
  }
}

export default new AuctionService();
