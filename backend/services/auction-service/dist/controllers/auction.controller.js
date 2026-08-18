import ApiError from "../lib/ApiError.js";
import ApiResponse from "../lib/ApiResponse.js";
import asyncHandler from "../lib/asyncHandler.js";
import auctionRepository from "../repositories/auction.repository.js";
import auctionService from "../service/auction.service.js";
import { configureAuctionVehicleSchema, createAuctionSchema, } from "../validations/auction.validation.js";
// auction.controller.ts
export const createAuction = asyncHandler(async (req, res) => {
    const validation = createAuctionSchema.safeParse(req.body);
    if (!validation.success) {
        throw new ApiError(400, validation.error.issues[0]?.message || "Invalid auction data");
    }
    const adminId = req.headers["x-user-id"];
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
    const partnerId = req.headers["x-user-id"];
    if (!partnerId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const auction = await auctionService.getAuctionDataForPartner(partnerId);
    return ApiResponse.success(res, 201, "Partner auction data fetched successfully", auction);
});
export const approveAuction = asyncHandler(async (req, res) => {
    const auctionId = req.query.auctionId;
    const adminId = req.headers["x-user-id"];
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
    const auctionId = req.query.auctionId;
    if (!auctionId) {
        throw new ApiError(400, "Auction Id Not Found");
    }
    const data = configureAuctionVehicleSchema.parse(req.body);
    const adminId = req.headers["x-user-id"];
    const auction = await auctionService.configureAuctionVehicle(auctionId, data, adminId);
    return ApiResponse.success(res, 201, "Auction vehicle configured successfully.", auction);
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
    const auctionId = req.query.auctionId;
    const adminId = req.headers["x-user-id"];
    if (!adminId) {
        throw new ApiError(401, "Unauthorized.");
    }
    const auction = await auctionService.approveAuctionStart(auctionId, adminId);
    return ApiResponse.success(res, 201, "Auction Start Successfully");
});
export const rejectAuctionStart = asyncHandler(async (req, res) => {
    const auctionId = req.query.auctionId;
    const adminId = req.headers["x-user-id"];
    if (!adminId) {
        throw new ApiError(401, "Unauthorized.");
    }
    const auction = await auctionService.rejectAuctionStart(auctionId, adminId);
    return ApiResponse.success(res, 201, "Auction Start Rejected", auction);
});
export const placeBid = asyncHandler(async (req, res) => {
    const { vehicleId, auctionId, bidAmount } = req.body;
    const partnerId = req.headers["x-user-id"];
    const vehicle = await auctionService.placeBid(auctionId, vehicleId, partnerId, Number(bidAmount));
    return ApiResponse.success(res, 201, "Bid Place Successfully", vehicle);
});
export const finalizeAuction = asyncHandler(async (req, res) => {
    const auctionId = req.query.auctionId;
    if (!auctionId) {
        throw new ApiError(400, "Auction ID is required.");
    }
    const result = await auctionService.finalizeAuction(auctionId);
    if (!result) {
        throw new ApiError(404, "Auction not found, already ended, or not ready to end.");
    }
    return res.status(200).json({
        success: true,
        message: "Auction ended and vehicles assigned successfully.",
        data: result,
    });
});
// ==========================================
// ADMIN DASHBOARD STATS
// ==========================================
export const getAdminAuctionStats = asyncHandler(async (req, res) => {
    const stats = await auctionService.getAdminAuctionStats();
    return res.status(200).json({
        success: true,
        message: "Auction dashboard stats fetched successfully.",
        data: stats,
    });
});
// ==========================================
// ADMIN AUCTION LIST
// ==========================================
export const getAdminAuctions = asyncHandler(async (req, res) => {
    const { search, status, type, state, duration, page, limit } = req.query;
    const result = await auctionService.getAdminAuctions({
        search: search,
        status: status,
        type: type,
        state: state,
        duration: duration,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
    });
    return res.status(200).json({
        success: true,
        message: "Auctions fetched successfully.",
        data: result.auctions,
        pagination: result.pagination,
    });
});
// ==========================================
// ADMIN AUCTION DETAILS
// ==========================================
export const getAdminAuctionById = asyncHandler(async (req, res) => {
    const auctionId = req.params.auctionId;
    if (!auctionId) {
        throw new ApiError(400, "Auction ID is required.");
    }
    const auction = await auctionService.getAdminAuctionById(auctionId);
    return res.status(200).json({
        success: true,
        message: "Auction details fetched successfully.",
        data: auction,
    });
});
// ==========================================
// ADMIN ACTIVITY FEED
// ==========================================
export const getAdminAuctionActivity = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit ?? 20);
    const activity = await auctionService.getAdminAuctionActivity(limit);
    return res.status(200).json({
        success: true,
        message: "Auction activity fetched successfully.",
        data: activity,
    });
});
// ==========================================
// CANCEL AUCTION
// ==========================================
export const cancelAdminAuction = asyncHandler(async (req, res) => {
    const auctionId = req.params.auctionId;
    const adminId = req.headers["x-user-id"];
    const { reason } = req.body;
    if (!adminId) {
        throw new ApiError(401, "Unauthorized.");
    }
    if (!auctionId) {
        throw new ApiError(400, "Auction ID is required.");
    }
    const auction = await auctionService.cancelAdminAuction(auctionId, adminId, reason);
    return res.status(200).json({
        success: true,
        message: "Auction cancelled successfully.",
        data: auction,
    });
});
export const getAdminDashboardAuctionData = asyncHandler(async (req, res) => {
    const stats = await auctionRepository.getDashboardAuctionStats();
    const liveAuctions = await auctionRepository.getLiveAuctionSnapshot();
    return ApiResponse.success(res, 200, "Auction dashboard data fetched successfully", {
        stats,
        liveAuctions,
    });
});
export const getPartnerWonVehicles = asyncHandler(async (req, res) => {
    const partnerId = req.headers["x-user-id"];
    if (!partnerId) {
        return ApiResponse.error(res, 401, "Partner authentication required.");
    }
    const data = await auctionService.getPartnerWonVehicles(partnerId);
    return ApiResponse.success(res, 200, "Partner won vehicles fetched successfully.", data);
});
