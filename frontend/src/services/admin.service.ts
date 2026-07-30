import api from "@/utils/api";

export const approvePartner = async (partnerId: string) => {
  try {
    const res = await api.post(`/api/auth/admin/update-partner-status`, {
      partnerId,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPartnersData = async () => {
  try {
    const res = await api.get("/api/auth/partner/all-partners");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const rejectPartner = async (partnerId: string, reason: string) => {
  try {
    const res = await api.patch("/api/auth/admin/reject-partner", {
      partnerId,
      reason,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const reuploadDocuments = async (partnerId: string) => {
  try {
    const result = await api.patch("/api/auth/admin/reupload-document", {
      partnerId,
    });
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
