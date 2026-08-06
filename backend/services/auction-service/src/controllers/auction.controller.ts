import ApiResponse from "../lib/ApiResponse.js";
import asyncHandler from "../lib/asyncHandler.js";
import auctionService from "../service/auction.service.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";

export const createAuction = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.userId;
    const auction = await auctionService.createAuction(
      req.body,
      userId!,
      req.headers.authorization!,
    );
    return ApiResponse.success(
      res,
      201,
      "Auction Created Successfully",
      auction,
    );
  },
);
