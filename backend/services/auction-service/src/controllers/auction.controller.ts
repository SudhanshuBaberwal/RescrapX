import ApiError from "../lib/ApiError.js";
import asyncHandler from "../lib/asyncHandler.js";
import auctionService from "../service/auction.service.js";
import { createAuctionSchema } from "../validations/auction.validation.js";
// auction.controller.ts
export const createAuction = asyncHandler(async (req, res) => {
  const validation = createAuctionSchema.safeParse(req.body);

  if (!validation.success) {
    throw new ApiError(
      400,
      validation.error.issues[0]?.message || "Invalid auction data"
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
  const auction = await auctionService.createAuction(
    validation.data,
    adminId,
    authHeader // Pass "Bearer <token>" directly to the service layer
  );
  return res.status(201).json({
    success: true,
    message: "Auction created successfully",
    data: auction,
  });
});