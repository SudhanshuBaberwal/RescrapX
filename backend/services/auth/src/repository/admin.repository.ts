import User, { PartnerNextStep, PartnerStatus } from "../models/user.model.js";
import { RejectPartnerDto } from "../validations/admin.validation.js";

class AdminRepository {
  async findPartnerById(id: string) {
    return User.findById(id);
  }

  async approvePartner(id: string) {
    return User.findByIdAndUpdate(
      id,
      {
        partnerStatus: PartnerStatus.APPROVED,
        partnerNextStep: PartnerNextStep.DASHBOARD,
      },
      {
        returnDocument: "after",
      },
    );
  }

  async rejectPartner(dto: RejectPartnerDto) {
    return User.findByIdAndUpdate(
      dto.partnerId,
      {
        partnerStatus: PartnerStatus.REJECTED,

        partnerNextStep: PartnerNextStep.REUPLOAD_DOCUMENTS,

        rejectionReason: dto.reason,

        documents: {
          rvsfCertificate: null,
          gstCertificate: null,
          panCard: null,
          registrationCertificate: null,
          bankDetails: null,
          uploadedAt: null,
        },
      },
      {
        new: true,
      },
    );
  }

  async reuploadDocument(partnerId: string) {
    return User.findByIdAndUpdate(
      partnerId,
      {
        partnerStatus: PartnerStatus.PENDING,
        partnerNextStep: PartnerNextStep.WAIT_APPROVAL,
      },
      {
        returnDocument: "after",
      },
    );
  }
}

export default new AdminRepository();
