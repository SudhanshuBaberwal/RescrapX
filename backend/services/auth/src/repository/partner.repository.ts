import User from "../models/user.model.js";
import { PartnerStatus, UserRole } from "../models/user.model.js";

class PartnerRepository {
  async findPartnerById(userId: string) {
    return User.findOne({
      _id: userId,
      role: UserRole.PARTNER,
    });
  }

  async updatePartnerDocuments(
    userId: string,
    documents: any,
  ) {
    return User.findByIdAndUpdate(
      userId,
      {
        documents,
        partnerStatus: PartnerStatus.UNDER_REVIEW,
      },
      {
        new: true,
      },
    );
  }
}

export default new PartnerRepository();