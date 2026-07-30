import { supabase } from "../config/supabase.js";
import ApiError from "../lib/ApiError.js";
import { PartnerStatus, UserRole } from "../models/user.model.js";
import adminRepository from "../repository/admin.repository.js";
class AdminService {
  // async changePartnerStatus(data:partnerStatusChangeDto){
  //     try {
  //         const id = data.partnerId
  //         const partner = await authRepository.findById(id)
  //         if (!partner){
  //             throw new ApiError(404 , "Partner Not found")
  //         }

  //     } catch (error) {
  //         console.log(error)
  //     }
  // }

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
}

export default new AdminService();
