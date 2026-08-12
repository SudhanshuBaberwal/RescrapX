import ApiError from "../lib/ApiError.js";
import ApiResponse from "../lib/ApiResponse.js";
import asyncHandler from "../lib/asyncHandler.js";
import auctionService from "../service/auction.service.js";
import {
  configureAuctionVehicleSchema,
  createAuctionSchema,
  PlaceBidDtoSchema,
} from "../validations/auction.validation.js";
// auction.controller.ts
export const createAuction = asyncHandler(async (req, res) => {
  const validation = createAuctionSchema.safeParse(req.body);

  if (!validation.success) {
    throw new ApiError(
      400,
      validation.error.issues[0]?.message || "Invalid auction data",
    );
  }
  const adminId = req.headers["x-user-id"] as string;
  const authHeader = req.headers.authorization;
  if (!adminId) {
    throw new ApiError(401, "Unauthorized: Missing user context");
  }
  if (!authHeader) {
    throw new ApiError(401, "Authorization token is required");
  }
  const auction = await auctionService.createAuction(validation.data, adminId);
  return res.status(201).json({
    success: true,
    message: "Auction created successfully",
    data: auction,
  });
});

export const getAuctionData = asyncHandler(async (req, res) => {
  const data = await auctionService.getAuctionData();
  return ApiResponse.success(res, 201, "Get Live Auction", data);
});

export const getAuctionDataForPartner = asyncHandler(async (req, res) => {
  // const partnerId = req.user?.userId;

  const partnerId = req.headers["x-user-id"] as string;

  if (!partnerId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const auction = await auctionService.getAuctionDataForPartner(partnerId);

  return ApiResponse.success(
    res,
    201,
    "Partner auction data fetched successfully",
    auction,
  );
});

export const approveAuction = asyncHandler(async (req, res) => {
  const auctionId = req.query.auctionId as string;
  const adminId = req.headers["x-user-id"] as string;
  if (!adminId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  if (!auctionId) {
    return res.status(400).json({
      success: false,
      message: "Auction ID is required.",
    });
  }
  const auction = await auctionService.approveAuction(auctionId, adminId);
  return res.status(200).json({
    success: true,
    message: "Auction approved successfully.",
    data: auction,
  });
});

export const condifureAuctionVehicle = asyncHandler(async (req, res) => {
  const auctionId = req.query.auctionId as string;
  if (!auctionId) {
    throw new ApiError(400, "Auction Id Not Found");
  }
  const data = configureAuctionVehicleSchema.parse(req.body);
  const adminId = req.headers["x-user-id"] as string;
  const auction = await auctionService.configureAuctionVehicle(
    auctionId,
    data,
    adminId,
  );
  return ApiResponse.success(
    res,
    201,
    "Auction vehicle configured successfully.",
    auction,
  );
});

export const getPendingApprovalAuctions = asyncHandler(async (req, res) => {
  const auctions = await auctionService.getPendingApprovalAuctions();

  return ApiResponse.success(res, 201, "update status", auctions);
});

export const checkStartApproval = asyncHandler(async (req, res) => {
  const count = await auctionService.checkAuctionsForStartApproval();

  return res.status(200).json({
    success: true,
    message: "Start approval check completed.",
    count,
  });
});

export const getPendingStartApproval = asyncHandler(async (req, res) => {
  const auctions = await auctionService.getPendingApprovalAuctions();

  return ApiResponse.success(res, 201, "", auctions);
});

export const approveAuctionStart = asyncHandler(async (req, res) => {
  const auctionId = req.query.auctionId as string;

  const adminId = req.headers["x-user-id"] as string;

  if (!adminId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const auction = await auctionService.approveAuctionStart(auctionId, adminId);

  return ApiResponse.success(res, 201, "Auction Start Successfully");
});

export const rejectAuctionStart = asyncHandler(async (req, res) => {
  const auctionId = req.query.auctionId as string;

  const adminId = req.headers["x-user-id"] as string;

  if (!adminId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const auction = await auctionService.rejectAuctionStart(auctionId, adminId);

  return ApiResponse.success(res, 201, "Auction Start Rejected", auction);
});

export const placeBid = asyncHandler(async (req, res) => {
  const { vehicleId, auctionId, bidAmount } = req.body;
  const partnerId = req.headers["x-user-id"] as string;
  const vehicle = await auctionService.placeBid(
    auctionId,
    vehicleId,
    partnerId,
    Number(bidAmount),
  );
  return ApiResponse.success(res, 201, "Bid Place Successfully", vehicle);
});
