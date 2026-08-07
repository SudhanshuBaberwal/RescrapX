import asyncHandler from "../lib/asyncHandler.js";
import ApiResponse from "../lib/ApiResponse.js";
import userDocumentService from "../service/user-document.service.js";
import ApiError from "../lib/ApiError.js";
import { AuthProvider } from "../models/user.model.js";
import { updateUserProfileSchema, UploadedFiles } from "../validations/user-document.validation.js";

export const syncVehicleDocumentsController = asyncHandler(async (req, res) => {
  const owner = req.user?.id as string;

  const result = await userDocumentService.syncVehicleDocuments(owner);

  return ApiResponse.success(
    res,
    200,
    "Vehicle documents synchronized successfully",
    result,
  );
});

export const getAllCustomersData = asyncHandler(async (req, res) => {
  const customers = await userDocumentService.getAllCustomers();
  return ApiResponse.success(
    res,
    201,
    "Customers fetched successfully",
    customers,
  );
});

export const KYCController = asyncHandler(async (req, res) => {
  try {
    const owner = req.user?.id;

    if (!owner) {
      throw new ApiError(401, "Unauthorized");
    }

    const { documentType } = req.body;

    const files = req.files as UploadedFiles;

    if (!files) {
      throw new ApiError(400, "Documents are required");
    }

    const result = await userDocumentService.KYC(owner, documentType, files);

    return res.status(200).json({
      success: true,
      message: "KYC documents uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("KYC Controller Error:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload KYC documents",
    });
  }
});
export const getUserProfileController = asyncHandler(
  async (req, res) => {

    const owner = req.user?.id;

    if (!owner) {
      throw new ApiError(
        401,
        "Unauthorized",
      );
    }

    const profile =
      await userDocumentService.getUserProfile(
        owner,
      );

    return ApiResponse.success(res,
      201,
      "User profile fetched successfully",
      profile,
    );
  },
);

export const updateUserProfileController = asyncHandler(
  async (req, res) => {

    const owner = req.user?.id;

    if (!owner) {
      throw new ApiError(
        401,
        "Unauthorized",
      );
    }

    /*
     * Zod validation
     */
    const validatedData =
      updateUserProfileSchema.parse(req.body);

    /*
     * Service
     */
    const profile =
      await userDocumentService.updateUserProfile(
        owner,
        validatedData,
      );

    return ApiResponse.success(res,201,"",profile)
  },
);