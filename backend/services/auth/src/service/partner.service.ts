import ApiError from "../lib/ApiError.js";
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
}

export default new PartnerService();
