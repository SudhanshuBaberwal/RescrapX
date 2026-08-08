import { supabase } from "../config/supabase.js";
import ApiError from "../lib/ApiError.js";
import UserDocuments, { VerificationStatus } from "../models/user-documents.js";
import User, {
  PartnerNextStep,
  PartnerStatus,
  UserRole,
} from "../models/user.model.js";
import { RejectPartnerDto } from "../validations/admin.validation.js";
import { KYCDecisionInput } from "../validations/user-document.validation.js";

class AdminRepository {
  BUCKET_NAME = "partner-documents";
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

  async getAllCustomers() {
    return await User.find({ role: UserRole.USER })
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });
  }

  async getDocumentUrl(
    path: string,
    expiresIn = 60 * 10, // 10 minutes
  ): Promise<string> {
    if (!path) {
      throw new ApiError(400, "Document path is required");
    }

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .createSignedUrl(path, expiresIn);

    if (error || !data?.signedUrl) {
      console.error("Supabase signed URL error:", error);

      throw new ApiError(404, "Unable to generate document URL");
    }

    return data.signedUrl;
  }

  async updateKYCStatus(userId: string, data: KYCDecisionInput) {
    const update: any = {
      isVerifiedProfile: data.verified,

      "verificationDocument.status": data.verified
        ? VerificationStatus.VERIFIED
        : VerificationStatus.REJECTED,
    };

    if (data.verified) {
      update["verificationDocument.rejectionReason"] = undefined;
    } else {
      update["verificationDocument.rejectionReason"] = data.rejectionReason;
    }

    const userDocuments = await UserDocuments.findOneAndUpdate(
      {
        $or: [{ owner: userId }, { _id: userId }],
      },
      {
        $set: update,
      },
      {
        new: true,
      },
    );

    console.log(
      "Updated document:",
      userDocuments
        ? {
            documentId: userDocuments._id,
            owner: userDocuments.owner,
            isVerifiedProfile: userDocuments.isVerifiedProfile,
            status: userDocuments.verificationDocument?.status,
            rejectionReason:
              userDocuments.verificationDocument?.rejectionReason,
          }
        : null,
    );

    if (!userDocuments) {
      throw new ApiError(404, "User profile not found");
    }

    return {
      documentId: userDocuments._id,
      owner: userDocuments.owner,
      isVerifiedProfile: userDocuments.isVerifiedProfile,
      status: userDocuments.verificationDocument?.status,
      rejectionReason: userDocuments.verificationDocument?.rejectionReason,
    };
  }
}

export default new AdminRepository();
