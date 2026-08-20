import ApiError from "../lib/ApiError.js";
import User, {
  PartnerNextStep,
  PartnerStatus,
  UserRole,
} from "../models/user.model.js";
import authRepository from "../repository/auth.repository.js";
import partnerRepository from "../repository/partner.repository.js";
import {
  UploadedFiles,
  validatePartnerDocuments,
} from "../validations/partner.validation.js";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";
import adminRepository from "../repository/admin.repository.js";

class PartnerService {
  async uploadDocuments(userId: string, files: UploadedFiles) {
    try {
      validatePartnerDocuments(files);

      const partner = await partnerRepository.findPartnerById(userId);

      if (!partner) {
        throw new ApiError(404, "Partner not found");
      }

      if (partner.documents?.uploadedAt) {
        throw new ApiError(400, "Documents have already been uploaded");
      }

      const folder = `partners/${userId}/documents`;

      const [rvsf, gst, pan, reg, bank] = await Promise.all([
        uploadToSupabase(files.rvsfCertificate[0], folder, "rvsf"),
        uploadToSupabase(files.gstCertificate[0], folder, "gst"),
        uploadToSupabase(files.panCard[0], folder, "pan"),
        uploadToSupabase(
          files.registrationCertificate[0],
          folder,
          "registration",
        ),
        uploadToSupabase(files.bankDetails[0], folder, "bank"),
      ]);

      const documents = {
        rvsfCertificate: { path: rvsf.path },
        gstCertificate: { path: gst.path },
        panCard: { path: pan.path },
        registrationCertificate: { path: reg.path },
        bankDetails: { path: bank.path },
        uploadedAt: new Date(),
      };

      return await partnerRepository.updatePartnerDocuments(userId, documents);
    } catch (error) {
      console.error("Upload Documents Error:", error);
      throw error;
    }
  }

  async getPartnertStatus(userId: string) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role !== UserRole.PARTNER) {
      throw new ApiError(403, "Only partners can access this resource");
    }

    return {
      role: user.role,
      partnerStatus: user.partnerStatus,
      partnerNextStep: user.partnerNextStep,
      rejectionReason: user.rejectionReason,
    };
  }

  async getAllPartners() {
    const partners = await partnerRepository.findByPartnerRole();

    return partners;
  }

  async getReadyForAuctionPartner() {
    return User.find({
      role: UserRole.PARTNER,
      partnerStatus: PartnerStatus.APPROVED,
      partnerNextStep: PartnerNextStep.DASHBOARD,
    }).select("_id fullName company");
  }
}

export default new PartnerService();
