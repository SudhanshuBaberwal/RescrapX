import ApiError from "../lib/ApiError.js";
import {
  PartnerNextStep,
  PartnerStatus,
  UserRole,
} from "../models/user.model.js";
import authRepository from "../repository/auth.repository.js";
import partnerRepository from "../repository/partner.repository.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import {
  UploadedFiles,
  validatePartnerDocuments,
} from "../validations/partner.validation.js";

class PartnerService {
  async uploadDocuments(userId: string, files: UploadedFiles) {
    try {
      validatePartnerDocuments(files);

      // Check partner
      const partner = await partnerRepository.findPartnerById(userId);

      if (!partner) {
        throw new ApiError(404, "Partner not found");
      }

      // Prevent duplicate upload
      if (partner.documents?.uploadedAt) {
        throw new ApiError(400, "Documents have already been uploaded");
      }

      // Upload all documents simultaneously
      const [
        rvsfCertificate,
        gstCertificate,
        panCard,
        registrationCertificate,
        bankDetails,
      ] = await Promise.all([
        uploadOnCloudinary(
          files.rvsfCertificate[0],
          "RescrapX/Partners/Documents",
        ),

        uploadOnCloudinary(
          files.gstCertificate[0],
          "RescrapX/Partners/Documents",
        ),

        uploadOnCloudinary(files.panCard[0], "RescrapX/Partners/Documents"),

        uploadOnCloudinary(
          files.registrationCertificate[0],
          "RescrapX/Partners/Documents",
        ),

        uploadOnCloudinary(files.bankDetails[0], "RescrapX/Partners/Documents"),
      ]);

      const documents = {
        rvsfCertificate,
        gstCertificate,
        panCard,
        registrationCertificate,
        bankDetails,
        uploadedAt: new Date(),
      };

      const updatedPartner = await partnerRepository.updatePartnerDocuments(
        userId,
        documents,
      );

      return updatedPartner;
    } catch (error) {
      console.log(error);
    }
  }

  async getPartnertStatus(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role !== UserRole.PARTNER) {
      throw new ApiError(403, "Only partners can access this resources");
    }

    let nextStep = "";
    switch (user.partnerStatus) {
      case PartnerStatus.PENDING:
        nextStep = PartnerNextStep.UPLOAD_DOCUMENTS;
        break;

      case PartnerStatus.UNDER_REVIEW:
        nextStep = PartnerNextStep.WAIT_APPROVAL;
        break;

      case PartnerStatus.APPROVED:
        nextStep = PartnerNextStep.DASHBOARD;
        break;

      case PartnerStatus.REJECTED:
        nextStep = PartnerNextStep.REUPLOAD_DOCUMENTS;
        break;

      default:
        nextStep = PartnerNextStep.WAIT_APPROVAL;
    }

    return {
      role: user.role,
      partnerStatus: user.partnerStatus,
      PartnerNextStep: nextStep,
    };
  }
}

export default new PartnerService();
