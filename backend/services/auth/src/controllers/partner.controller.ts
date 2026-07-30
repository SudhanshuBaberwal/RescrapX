import { Request, Response } from "express";
import partnerService from "../service/partner.service.js";
import ApiResponse from "../lib/ApiResponse.js";
import asyncHandler from "../lib/asyncHandler.js";
import { UploadedFiles } from "../validations/partner.validation.js";

class PartnerController {
  uploadDocuments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const files = (req as any).files as UploadedFiles;
    const partner = await partnerService.uploadDocuments(userId, files);

    return ApiResponse.success(
      res,
      200,
      "Documents uploaded successfully. Your account is now under review.",
      partner,
    );
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

    console.log(partners);

    ApiResponse.success(res, 200, "Get partner data", partners);
  });
}

export default new PartnerController();
