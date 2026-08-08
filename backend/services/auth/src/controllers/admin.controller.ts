import ApiError from "../lib/ApiError.js";
import ApiResponse from "../lib/ApiResponse.js";
import asyncHandler from "../lib/asyncHandler.js";
import UserDocuments from "../models/user-documents.js";
import adminRepository from "../repository/admin.repository.js";
import adminService from "../service/admin.service.js";
import AdminService from "../service/admin.service.js";
import userDocumentService from "../service/user-document.service.js";
import { rejectPartnerSchema } from "../validations/admin.validation.js";
import { KYCDecisionSchema } from "../validations/user-document.validation.js";

export const approvePartnerController = asyncHandler(async (req, res) => {
  const { partnerId } = req.body;

  if (!partnerId || Array.isArray(partnerId)) {
    throw new ApiError(400, "Cannot get partner id");
  }

  await AdminService.approvePartner(partnerId);

  ApiResponse.success(res, 200, "Partner approved successfully");
});

export const reuploadPartnerDocument = asyncHandler(async (req, res) => {
  const { partnerId } = req.body;
  if (!partnerId || Array.isArray(partnerId)) {
    throw new ApiError(400, "Cannot Get Partner Id");
  }

  await adminService.reuploadDocuments(partnerId);
  ApiResponse.success(res, 200, "Reupload Documents");
});

export const viewDocument = asyncHandler(async (req, res) => {
  const { path } = req.body;
  const url = await adminService.generateDocumentUrl(path);
  return ApiResponse.success(res, 200, "Open Pdf", url);
});

export const rejectPartner = asyncHandler(async (req, res) => {
  const body = rejectPartnerSchema.parse(req.body);

  const partner = await adminService.rejectPartner(body);

  return ApiResponse.success(
    res,
    200,
    "Partner rejected successfully",
    partner,
  );
});

export const getAllUserProfilesController = asyncHandler(async (req, res) => {
  try {
    const userProfiles = await userDocumentService.getAllUserProfiles();
    return ApiResponse.success(
      res,
      201,
      "Profiles get successfully",
      userProfiles,
    );
  } catch (error) {
    console.log(error);
  }
});

export const getDocumentUrlController = asyncHandler(async (req, res) => {
  const { path } = req.body;

  if (!path || typeof path !== "string") {
    throw new ApiError(400, "Document path is required");
  }

  const signedUrl = await adminRepository.getDocumentUrl(path);

  return ApiResponse.success(res, 201, signedUrl);
});

export const updateKYCStatus = asyncHandler(
  async (req, res) => {
    try {
      const documentId  = req.query.documentId as string;
      if (!documentId) {
        throw new ApiError(400, "documentId is required");
      }
      const validation = KYCDecisionSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ApiError(
          400,
          validation.error.issues[0]?.message || "Invalid request data",
        );
      }
      const result = await userDocumentService.updateKYCStatus(
        documentId,
        validation.data,
      );

      return res.status(200).json({
        success: true,
        message: validation.data.verified
          ? "User KYC approved successfully"
          : "User KYC rejected successfully",
        data: result,
      });
    } catch (error) {
      console.error("KYC status update error:", error);

      throw error;
    }
  },
);
