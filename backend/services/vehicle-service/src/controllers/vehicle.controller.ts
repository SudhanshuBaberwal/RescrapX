import { Request, Response } from "express";

import vehicleService from "../services/vehicle.service.js";
import asyncHandler from "../lib/asyncHandler.js";
import ApiResponse from "../lib/ApiResponse.js";
import ApiError from "../lib/ApiError.js";
import Vehicle, {
  PartnerDocumentStatus,
  PartnerDocumentType,
  VehicleDocumentType,
} from "../models/vehicle.model.js";
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

export const findScheduledVehicles = asyncHandler(async (req, res) => {
  const result = await vehicleRepository.findAllReadyForPickupVehicles();

  return ApiResponse.success(res, 201, "Scheduled Vehicles", result);
});

export const getVehicleDashboardStats = asyncHandler(async (req, res) => {
  const data = await vehicleRepository.getVehicleDashboardStats();

  return ApiResponse.success(
    res,
    200,
    "Vehicle dashboard data fetched successfully",
    data,
  );
});

export const getPickupMap = asyncHandler(async (req, res) => {
  try {
    const data = await vehicleRepository.getActivePickupLocations();

    return ApiResponse.success(
      res,
      200,
      "Pickup locations fetched successfully",
      data,
    );
  } catch (error) {
    console.log(error);
  }
});

export const schedulePickup = async (req: Request, res: Response) => {
  try {
    const { vehicleId, scheduledAt, pickupCharges, documentCharges } = req.body;
    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "vehicleId is required",
      });
    }
    if (!scheduledAt || !pickupCharges || !documentCharges) {
      return res.status(400).json({
        success: false,
        message: "scheduledAt is required",
      });
    }
    const vehicle = await vehicleService.schedulePickup(
      vehicleId,
      scheduledAt,
      pickupCharges,
      documentCharges,
    );
    return res.status(200).json({
      success: true,
      message: "Pickup scheduled successfully",
      data: vehicle,
    });
  } catch (error: any) {
    console.error("Schedule pickup error:", error);

    return res.status(400).json({
      success: false,
      message: error?.message || "Failed to schedule pickup",
    });
  }
};

export const assignDriver = async (req: Request, res: Response) => {
  try {
    const { vehicleId, driverName } = req.body;

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "vehicleId is required",
      });
    }

    if (!driverName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "driverName is required",
      });
    }

    const vehicle = await vehicleService.assignDriver(vehicleId, driverName);

    return res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      data: vehicle,
    });
  } catch (error: any) {
    console.error("Assign driver error:", error);

    return res.status(400).json({
      success: false,
      message: error?.message || "Failed to assign driver",
    });
  }
};

export const getPartnerIncomingVehicles = async (
  req: Request,
  res: Response,
) => {
  try {
    const partnerId =
      (req as any).user?.userId || (req.headers["x-user-id"] as string);

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message: "Partner authentication required",
      });
    }

    const vehicles =
      await vehicleService.getIncomingVehiclesForPartner(partnerId);

    return res.status(200).json({
      success: true,
      message: "Incoming vehicles fetched successfully",
      data: vehicles,
    });
  } catch (error) {
    console.error("Get incoming vehicles error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch incoming vehicles",
    });
  }
};

export const getPartnerProcessingVehicles = asyncHandler(async (req, res) => {
  const partnerId =
    (req as any).user?.userId || (req.headers["x-user-id"] as string);

  if (!partnerId) {
    return ApiResponse.error(res, 401, "Partner authentication required");
  }

  const vehicles =
    await vehicleService.getProcessingVehiclesByPartner(partnerId);

  return ApiResponse.success(
    res,
    200,
    "Processing vehicles fetched successfully",
    vehicles,
  );
});

export const getPartnerProcessingStats = asyncHandler(async (req, res) => {
  const partnerId =
    (req as any).user?.userId || (req.headers["x-user-id"] as string);

  if (!partnerId) {
    return ApiResponse.error(res, 401, "Partner authentication required");
  }

  const stats = await vehicleService.getProcessingStatsByPartner(partnerId);

  return ApiResponse.success(
    res,
    200,
    "Processing statistics fetched successfully",
    stats,
  );
});

export const requestPickupOtp = asyncHandler(async (req, res) => {
  const { vehicleId } = req.body;
  if (!vehicleId) {
    throw new ApiError(400, "Vehicle Id is required");
  }

  const result = await vehicleService.requestPickupOtp(vehicleId);
  return ApiResponse.success(res, 201, "Pickup Otp sent Successfully", result);
});

export const verifyPickupOtp = asyncHandler(async (req, res) => {
  const { vehicleId, otp } = req.body;
  if (!vehicleId) {
    throw new ApiError(400, "Vehicle id is required");
  }

  if (!otp || !/^\d{6}$/.test(otp)) {
    throw new ApiError(400, "Valid 6 ditit opt is required");
  }

  const confirmedBy = (req as any).user?.userId ?? "USER";

  const vehicle = await vehicleService.verifyPickupOtp(
    vehicleId,
    otp,
    confirmedBy,
  );

  return ApiResponse.success(res, 200, "Vehicle pickup verified successfully", {
    vehicleId: vehicle?._id,
    status: vehicle?.status,
    pickedUpAt: vehicle?.pickup?.pickupOtpVerifiedAt,
    message: "Vehicle has been successfully picked up",
  });
});

export const setPickupVehicleController = asyncHandler(async (req, res) => {
  const { vehicleId } = req.body;
  if (!vehicleId) {
    throw new ApiError(400, "Vehicle Id Not Found");
  }
  const vehicle = await vehicleService.CurrentVehiclePickedUp(vehicleId);
  return ApiResponse.success(res, 201, "Picked Up Vehicle", vehicle);
});

export const getVehicleStatusById = asyncHandler(
  async (req: Request, res: Response) => {
    const vehicleId = req.query.vehicleId as string;

    const vehicle = await vehicleService.getVehicleStatusById(vehicleId);

    res.status(200).json({
      success: true,
      message: "Vehicle status fetched successfully",
      data: vehicle,
    });
  },
);

export const getAllVehiclesWithStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const vehicles = await vehicleService.getAllVehiclesWithStatus();

    res.status(200).json({
      success: true,
      message: "All vehicle status fetched successfully",
      data: vehicles,
    });
  },
);

export const markVehicleArrived = asyncHandler(
  async (req: Request, res: Response) => {
    const { vehicleId } = req.body;

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID is required",
      });
    }

    const vehicle = await vehicleService.markVehicleArrived(vehicleId);

    return res.status(200).json({
      success: true,
      message: "Vehicle marked as arrived successfully",
      data: vehicle,
    });
  },
);

export const uploadPartnerDocument = asyncHandler(async (req, res) => {
  const partnerId = req.headers["x-user-id"] as string;

  const { vehicleId, documentType } = req.body;
  if (!vehicleId) {
    throw new ApiError(400, "vehicleId is required");
  }

  if (!documentType) {
    throw new ApiError(400, "documentType is required");
  }

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  let file: Express.Multer.File | undefined;

  switch (documentType) {
    case PartnerDocumentType.CERTIFICATE_OF_DEPOSIT:
      file = files?.cod?.[0];
      break;

    case PartnerDocumentType.CERTIFICATE_OF_SCRAPPING:
      file = files?.cos?.[0];
      break;

    case PartnerDocumentType.CHASSIS_PROOF:
      file = files?.chassis?.[0];
      break;

    case PartnerDocumentType.OTHER:
      file = files?.other?.[0];
      break;

    default:
      throw new ApiError(400, "Invalid document type");
  }

  if (!file) {
    throw new ApiError(400, `${documentType} file is required`);
  }

  const document = await vehicleService.uploadPartnerDocument(
    vehicleId,
    partnerId,
    documentType,
    file,
  );

  return ApiResponse.success(
    res,
    201,
    "Document uploaded successfully",
    document,
  );
});

export const submitPartnerDocuments = asyncHandler(async (req, res) => {
  const partnerId = req.headers["x-user-id"] as string;

  const { vehicleId } = req.body;

  if (!vehicleId) {
    throw new ApiError(400, "vehicleId is required");
  }

  const vehicle = await vehicleRepository.submitPartnerDocuments(
    vehicleId,
    partnerId,
  );

  return ApiResponse.success(
    res,
    200,
    "Documents submitted for admin approval",
    vehicle,
  );
});

export const getPartnerDocumentVehicles = asyncHandler(async (req, res) => {
  const partnerId = req.headers["x-user-id"] as string;

  if (!partnerId) {
    throw new ApiError(401, "Partner authentication required");
  }

  const vehicles = await vehicleService.getPartnerDocumentVehicles(partnerId);

  return ApiResponse.success(
    res,
    200,
    "Partner document vehicles fetched successfully",
    vehicles,
  );
});

export const getPartnerVehicleDocuments = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;

  const partnerId = req.user?.userId;

  if (!partnerId) {
    throw new ApiError(401, "Partner authentication required");
  }

  if (!vehicleId) {
    throw new ApiError(400, "Vehicle ID is required");
  }

  const vehicle = await vehicleService.getPartnerVehicleDocuments(
    vehicleId,
    partnerId,
  );

  return ApiResponse.success(
    res,
    200,
    "Vehicle documents fetched successfully",
    vehicle,
  );
});

export const getCustomerBookings = asyncHandler(async (req, res) => {
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const bookings = await vehicleService.getCustomerBookings(userId);

  return ApiResponse.success(
    res,
    200,
    "Customer bookings fetched successfully",
    {
      bookings,
      total: bookings.length,
    },
  );
});

export const getCustomerBookingById = asyncHandler(async (req, res) => {
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const vehicleId = req.query.vehicleId as string;

  if (!vehicleId) {
    throw new ApiError(400, "Vehicle ID is required");
  }

  const booking = await vehicleService.getCustomerBookingById(
    userId,
    vehicleId,
  );

  return ApiResponse.success(
    res,
    200,
    "Booking details fetched successfully",
    booking,
  );
});

export const getPartnerDashboard = asyncHandler(async (req, res) => {
  const partnerId = req.headers["x-user-id"] as string;

  if (!partnerId) {
    throw new ApiError(401, "Unauthorized");
  }

  const dashboard = await vehicleService.getPartnerDashboard(partnerId);

  return ApiResponse.success(
    res,
    200,
    "Partner dashboard fetched successfully",
    dashboard,
  );
});

export const updatePartnerProcessingStage = asyncHandler(async (req, res) => {
  const { vehicleId, processingStage } = req.body;

  if (!vehicleId) {
    throw new ApiError(400, "vehicleId is required");
  }

  if (!processingStage) {
    throw new ApiError(400, "processingStage is required");
  }

  const partnerId = req.headers["x-user-id"] as string;

  if (!partnerId) {
    throw new ApiError(401, "Partner authentication required");
  }

  const vehicle = await vehicleService.updatePartnerProcessingStage(
    vehicleId,
    partnerId,
    processingStage,
  );

  return ApiResponse.success(
    res,
    200,
    "Processing stage updated successfully",
    vehicle,
  );
});

export const getPartnerDocumentVehiclesForAdmin = asyncHandler(
  async (req, res) => {
    const vehicles =
      await vehicleService.getVehiclesWithPartnerDocumentsForAdmin();

    return res.status(200).json({
      success: true,

      message: "Partner vehicles documents fetched successfully",

      data: vehicles,
    });
  },
);

export const reviewPartnerDocument = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;
  const { documentId, status, rejectionReason } = req.body;

  if (!vehicleId) {
    throw new ApiError(400, "Vehicle ID is required");
  }

  if (!documentId) {
    throw new ApiError(400, "Document ID is required");
  }

  if (!status) {
    throw new ApiError(400, "Document status is required");
  }

  const adminId = req.headers["x-user-id"] as string;

  if (!adminId) {
    throw new ApiError(401, "Admin authentication required");
  }

  const vehicle = await vehicleService.reviewPartnerDocument(
    vehicleId,
    documentId,
    status,
    adminId,
    rejectionReason,
  );

  return res.status(200).json({
    success: true,

    message:
      status === PartnerDocumentStatus.APPROVED
        ? "Document approved successfully"
        : "Document rejected successfully",

    data: vehicle,
  });
});

export const approveAllPartnerDocuments = asyncHandler(async (req, res) => {
  const vehicleId = req.query.vehicleId as string;

  if (!vehicleId) {
    throw new ApiError(400, "Vehicle ID is required");
  }

  const adminId = req.headers["x-user-id"] as string;

  if (!adminId) {
    throw new ApiError(401, "Admin authentication required");
  }

  const vehicle = await vehicleService.approveAllPartnerDocuments(
    vehicleId,
    adminId,
  );

  return res.status(200).json({
    success: true,

    message: "All partner documents approved successfully",

    data: vehicle,
  });
});
