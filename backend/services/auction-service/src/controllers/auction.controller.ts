import { Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler.js";
import ApiError from "../lib/ApiError.js";

import auctionService from "../service/auction.service.js";

import {
  createAuctionSchema,
} from "../validations/auction.validation.js";

export const createAuction = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {

    const validation =
      createAuctionSchema.safeParse(
        req.body
      );

    if (!validation.success) {

      throw new ApiError(
        400,
        validation.error.issues[0]?.message ||
          "Invalid auction data"
      );
    }


    const adminId =
      (req as any).user?.userId;

    if (!adminId) {
      throw new ApiError(
        401,
        "Unauthorized"
      );
    }


    const token =
      req.headers.authorization?.replace(
        "Bearer ",
        ""
      );

    if (!token) {
      throw new ApiError(
        401,
        "Authorization token is required"
      );
    }


    const auction =
      await auctionService.createAuction(
        validation.data,
        adminId,
        token
      );


    return res.status(201).json({

      success: true,

      message:
        "Auction created successfully",

      data: auction,
    });
  }
);