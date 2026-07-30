import ApiError from "../lib/ApiError.js";
import ApiResponse from "../lib/ApiResponse.js";
import asyncHandler from "../lib/asyncHandler.js";
import adminService from "../service/admin.service.js";
import AdminService from "../service/admin.service.js";
import { rejectPartnerSchema } from "../validations/admin.validation.js";

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
