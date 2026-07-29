import User, { PartnerNextStep, PartnerStatus } from "../models/user.model.js";

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
}

export default new AdminRepository();
