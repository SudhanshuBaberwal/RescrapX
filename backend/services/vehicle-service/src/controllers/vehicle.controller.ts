import { Request, Response } from "express";

import vehicleService from "../services/vehicle.service.js";
import asyncHandler from "../lib/asyncHandler.js";
import ApiResponse from "../lib/ApiResponse.js";
import ApiError from "../lib/ApiError.js";
import { VehicleDocumentType } from "../models/vehicle.model.js";
import { UploadedFiles } from "../validations/vehicle.validation.js";
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
    const vehicleId  = req.query.vehicleId as string;

    const files = (req as any).files as UploadedFiles

    const vehicle = await vehicleService.uploadDocument(
      req.user!.userId,
      vehicleId,
      files,
    );

    return ApiResponse.success(
      res,
      200,
      "Document uploaded successfully.",
      vehicle
    );
  }
);