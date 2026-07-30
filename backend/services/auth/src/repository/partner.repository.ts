import User, { PartnerNextStep } from "../models/user.model.js";
import { PartnerStatus, UserRole } from "../models/user.model.js";

class PartnerRepository {
  async findPartnerById(userId: string) {
    return User.findOne({
      _id: userId,
      role: UserRole.PARTNER,
    });
  }

  async updatePartnerDocuments(userId: string, documents: any) {
   return User.findByIdAndUpdate(
    userId,
    {
        documents,
        partnerStatus: PartnerStatus.UNDER_REVIEW,
        partnerNextStep: PartnerNextStep.WAIT_APPROVAL,
    },
    {
        returnDocument: "after",
    }
);
  }

  async findByPartnerRole() {
    const partners = await User.find({
      role: UserRole.PARTNER,
    });
    return partners;
  }
}

export default new PartnerRepository();
