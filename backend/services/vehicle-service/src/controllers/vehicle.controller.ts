import { Request, Response } from "express";

import vehicleService from "../services/vehicle.service.js";
import asyncHandler from "../lib/asyncHandler.js";
import ApiResponse from "../lib/ApiResponse.js";
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
