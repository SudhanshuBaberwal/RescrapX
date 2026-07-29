import ApiError from "../lib/ApiError.js";
import ApiResponse from "../lib/ApiResponse.js";
import asyncHandler from "../lib/asyncHandler.js";
import AdminService from "../service/admin.service.js";

export const approvePartnerController = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;

  if (!partnerId || Array.isArray(partnerId)) {
    throw new ApiError(400, "Cannot get partner id");
  }

  const partner = await AdminService.approvePartner(partnerId);

  ApiResponse.success(res, 200, "Partner approved successfully", partner);
});
