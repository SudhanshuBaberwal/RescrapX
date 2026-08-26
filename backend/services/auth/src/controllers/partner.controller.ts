import { Request, Response } from "express";
import partnerService from "../service/partner.service.js";
import ApiResponse from "../lib/ApiResponse.js";
import asyncHandler from "../lib/asyncHandler.js";
import { UploadedFiles } from "../validations/partner.validation.js";
import ApiError from "../lib/ApiError.js";

class PartnerController {
  uploadDocuments = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const files = req.files as UploadedFiles;
    const result = await partnerService.uploadDocuments(userId, files);

    return res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      data: result,
    });
  });
  getPartnerStatusController = asyncHandler(async (req, res) => {
    const data = await partnerService.getPartnertStatus(req.user.id);

    return ApiResponse.success(
      res,
      200,
      "Partner status fetched successfully",
      data,
    );
  });

  getAllPartnersController = asyncHandler(async (req, res) => {
    const partners = await partnerService.getAllPartners();

    // console.log(partners);

    ApiResponse.success(res, 200, "Get partner data", partners);
  });

  getReadyForAuctionPartners = asyncHandler(async (req, res) => {
    const partners = await partnerService.getReadyForAuctionPartner();

    return ApiResponse.success(
      res,
      201,
      "partner fetch successfully",
      partners,
    );
  });
}

export default new PartnerController();
