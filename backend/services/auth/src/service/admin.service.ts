import { supabase } from "../config/supabase.js";
import { deleteDocuments } from "../helper/deleteDocuments.js";
import ApiError from "../lib/ApiError.js";
import { PartnerStatus, UserRole } from "../models/user.model.js";
import adminRepository from "../repository/admin.repository.js";
import { RejectPartnerDto } from "../validations/admin.validation.js";
class AdminService {
  async approvePartner(partnerId: string) {
    const partner = await adminRepository.findPartnerById(partnerId);

    if (!partner) {
      throw new ApiError(404, "Partner not found");
    }

    if (partner.role !== UserRole.PARTNER) {
      throw new ApiError(400, "User is not a partner");
    }

    if (partner.partnerStatus !== PartnerStatus.UNDER_REVIEW) {
      throw new ApiError(400, "Partner is not under review");
    }

    return await adminRepository.approvePartner(partnerId);
  }

  async generateDocumentUrl(path: string) {
    const { data, error } = await supabase.storage
      .from("partner-documents")
      .createSignedUrl(path, 60);

    if (error) {
      throw new ApiError(500, error.message);
    }

    return data.signedUrl;
  }
  async rejectPartner(dto: RejectPartnerDto) {
    const partner = await adminRepository.findPartnerById(dto.partnerId);

    if (!partner) {
      throw new ApiError(404, "Partner not found");
    }

    if (partner.partnerStatus === PartnerStatus.APPROVED) {
      throw new ApiError(400, "Approved partner cannot be rejected.");
    }

    if (partner.partnerStatus === PartnerStatus.REJECTED) {
      throw new ApiError(400, "Partner is already rejected.");
    }

    const paths = [
      partner.documents?.rvsfCertificate?.path,
      partner.documents?.gstCertificate?.path,
      partner.documents?.panCard?.path,
      partner.documents?.registrationCertificate?.path,
      partner.documents?.bankDetails?.path,
    ].filter((path): path is string => !!path);

    await deleteDocuments(paths);

    await deleteDocuments(paths);

    const user = await adminRepository.rejectPartner(dto);
    user?.save();
    return user;
  }

  async reuploadDocuments(partnerId: string) {
    const partner = await adminRepository.findPartnerById(partnerId);
    if (!partner) {
      throw new ApiError(404, "Partner Not found");
    }
    if (partner.role !== UserRole.PARTNER) {
      throw new ApiError(400, "User is not partner");
    }
    if (
      partner.partnerStatus !== PartnerStatus.REJECTED &&
      partner.partnerNextStep !== "REUPLOAD_DOCUMENTS"
    ) {
      throw new ApiError(400, "Partner is not Rejected");
    }
    return await adminRepository.reuploadDocument(partnerId);
  }
}

export default new AdminService();
