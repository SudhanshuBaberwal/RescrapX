import { Request, Response } from "express";

import vehicleService from "../services/vehicle.service.js";
import asyncHandler from "../lib/asyncHandler.js";
import ApiResponse from "../lib/ApiResponse.js";
import ApiError from "../lib/ApiError.js";
import Vehicle, { VehicleDocumentType } from "../models/vehicle.model.js";
import {
  UploadedFiles,
  UploadedPhotos,
} from "../validations/vehicle.validation.js";
import vehicleRepository from "../repositories/vehicle.repository.js";
import supabaseService from "../services/supabase.service.js";
export const createVehicleDraft = asyncHandler(async (req, res) => {
  // Gateway should inject this after authentication
  const userId = req.headers["x-user-id"] as string;

  const vehicle = await vehicleService.createDraftVehicle(userId);

  return ApiResponse.success(
    res,
    201,
    "Vehicle Draft created successfully",
    vehicle,
  );
});

export const registerBasicVehicleDetails = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;
  if (!req.user?.userId) {
    throw new ApiError(404, "UserId is not define");
  }
  const vehicle = await vehicleService.basicDetails(
    req.user!.userId,
    req.body,
    vehicleId,
  );
  return ApiResponse.success(res, 201, "Details Submit Successfully", vehicle);
});

export const vehicleCondition = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;
  const vehicle = await vehicleService.vehicleCondition(
    req.user!.userId,
    vehicleId,
    req.body,
  );
  return ApiResponse.success(
    res,
    201,
    "vehicle condition saved successfully",
    vehicle,
  );
});

export const majorComponents = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.majorComponents(
    req.user!.userId,
    req.query.vehicleId as string,
    req.body,
  );
  return ApiResponse.success(
    res,
    200,
    "Major Components Saved Successfully.",
    vehicle,
  );
});

export const uploadVehicleDocumentController = asyncHandler(
  async (req, res) => {
    const vehicleId = req.query.vehicleId as string;

    const files = (req as any).files as UploadedFiles;

    const vehicle = await vehicleService.uploadDocument(
      req.user!.userId,
      vehicleId,
      files,
    );

    return ApiResponse.success(
      res,
      200,
      "Document uploaded successfully.",
      vehicle,
    );
  },
);

export const uploadVehiclePhotosController = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;

  const files = req.files as UploadedPhotos;

  const vehicle = await vehicleService.uploadPhotos(
    req.user!.userId,
    vehicleId,
    files,
  );

  ApiResponse.success(res, 200, "Photos uploaded successfully", vehicle);
});

export const getAllVehicles = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(404, "User Id Not Found");
  }
  const data = await vehicleRepository.findVehicleByUserId(userId);
  return ApiResponse.success(res, 201, "Vehicle Fetch succesfully", data);
});

export const vehiclePickupLocation = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;
  const vehicle = await vehicleService.savePickupLocation(
    req.user!.userId,
    vehicleId,
    req.body,
  );
  return ApiResponse.success(
    res,
    201,
    "vehicle pickup location set successfully",
    vehicle,
  );
});

export const reviewVehicle = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;
  const vehicle = vehicleService.reviewVehicleAndConfirm(vehicleId);
  return ApiResponse.success(
    res,
    201,
    "Vehicle Registered Successfully",
    vehicle,
  );
});

export const findVehicle = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;
  // const userId = req.user?.userId as string;
  const vehicle = await vehicleRepository.findVehicleByVehicleId(vehicleId);
  return ApiResponse.success(res, 201, "Vehicle Data", vehicle);
});

export const allVehiclesDataForAdmin = asyncHandler(async (req, res) => {
  const vehicles = await vehicleRepository.findAllVehicles();
  if (!vehicles) {
    throw new ApiError(403, "Currently Vehicles Are Not Available.");
  }
  return ApiResponse.success(res, 201, "All vehicle data", vehicles);
});

export const viewDocument = asyncHandler(async (req, res) => {
  const { path } = req.body;
  if (!path || typeof path !== "string") {
    throw new ApiError(400, "Document path is required");
  }
  const url = await vehicleRepository.getDocumentUrl(path);

  return ApiResponse.success(
    res,
    201,
    "Document URL generated successfully",
    url,
  );
});

export const underVerification = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;
  const vehicle = vehicleService.vehicleUnderVerification(vehicleId);
  return ApiResponse.success(
    res,
    201,
    "Vehicle is under verification",
    vehicle,
  );
});

export const updateVehicleStatus = asyncHandler(async (req, res) => {
  const { vehicleId } = req.query;
  const { status, rejectionReason } = req.body;

  const vehicle = await vehicleService.handleStatusByAdmin(
    vehicleId as string,
    status,
    rejectionReason,
  );

  return ApiResponse.success(
    res,
    200,
    `Vehicle ${status.toLowerCase()} successfully.`,
    vehicle,
  );
});

export const FindALlVehicleForUserController = asyncHandler(
  async (req, res) => {
    const userId =
      (req.user?.userId as string) || (req.headers["x-user-id"] as string);
    const vehicles = await vehicleService.findAllVehicleOfUser(userId);
    return ApiResponse.success(
      res,
      201,
      "Vehicle data fetch successfully",
      vehicles,
    );
  },
);

export const ApplyForBiddingVehicleController = asyncHandler(
  async (req, res) => {
    const vehicleId = req.query.vehicleId as string;
    const vehicle = await vehicleService.applyVehicleForBidding(vehicleId);
    return ApiResponse.success(res, 201, "Vehicle ready for bidding", vehicle);
  },
);

export const getReadyForBiddingVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getReadyForBiddingVehicles();

  return res.status(200).json({
    success: true,
    data: vehicles,
  });
});

export const updateAuctionVehicleStatus = asyncHandler(async (req, res) => {
  const { vehicleId, status, auctionId, partnerId, winningBid } = req.body;
  if (!vehicleId) {
    return res.status(400).json({
      success: false,
      message: "vehicleId is required",
    });
  }

  if (status !== "SOLD" && status !== "UNSOLD") {
    return res.status(400).json({
      success: false,
      message: "Status must be SOLD or UNSOLD",
    });
  }

  if (!auctionId) {
    return res.status(400).json({
      success: false,
      message: "auctionId is required",
    });
  }

  if (status === "SOLD") {
    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "partnerId is required for SOLD vehicle",
      });
    }

    if (
      winningBid == null ||
      !Number.isFinite(Number(winningBid)) ||
      Number(winningBid) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid winningBid is required for SOLD vehicle",
      });
    }
  }

  const vehicle = await vehicleService.updateAuctionResult(
    vehicleId,
    status,
    auctionId,
    partnerId ?? null,
    winningBid != null ? Number(winningBid) : null,
  );

  return ApiResponse.success(res, 201, `Vehicle marked as ${status}`, vehicle);
});

export const approveVehicleForPickup = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;
  if (!vehicleId) {
    throw new ApiError(400, "Vehicle Id Not Found");
  }
  const vehicle = await vehicleService.approveVehicleForPickup(vehicleId);

  return res.status(200).json({
    success: true,
    message: "Vehicle approved for pickup.",
    data: {
      vehicleId: vehicle._id,
      status: vehicle.status,
    },
  });
});

export const scheduleVehiclePickup = async (req: Request, res: Response) => {
  try {
    const { vehicleId, scheduledAt, pickup } = req.body;
    const userId = req.headers["x-user-id"];
    if (!userId || typeof userId !== "string") {
      return res.status(401).json({
        success: false,
        message: "User ID is missing",
      });
    }

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "vehicleId is required",
      });
    }

    if (!scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "scheduledAt is required",
      });
    }

    const vehicle = await vehicleService.scheduledPickup(
      vehicleId,
      scheduledAt,
      pickup,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Pickup scheduled successfully",
      data: vehicle,
    });
  } catch (error: any) {
    console.error("[PICKUP] Schedule pickup error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to schedule pickup",
    });
  }
};

export const findScheduledVehicles = asyncHandler(async (req , res) => {
  const result =  await vehicleRepository.findAllReadyForPickupVehicles()

  return ApiResponse.success(res,201,"Scheduled Vehicles",result)
})