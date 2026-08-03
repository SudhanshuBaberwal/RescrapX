import { Request, Response } from "express";

import vehicleService from "../services/vehicle.service.js";
import asyncHandler from "../lib/asyncHandler.js";
import ApiResponse from "../lib/ApiResponse.js";
import ApiError from "../lib/ApiError.js";
import { VehicleDocumentType } from "../models/vehicle.model.js";
import {
  UploadedFiles,
  UploadedPhotos,
} from "../validations/vehicle.validation.js";
import vehicleRepository from "../repositories/vehicle.repository.js";
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
  const userId = req.user?.userId as string;
  const vehicle = await vehicleRepository.findVehicleByVehicleId(
    userId,
    vehicleId,
  );
  return ApiResponse.success(res, 201, "Vehicle Data", vehicle);
});
