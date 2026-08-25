import api from "@/utils/api";

export const approvePartner = async (partnerId: string) => {
  const res = await api.post(`/api/auth/admin/update-partner-status`, {
    partnerId,
  });
  return res.data.data;
};

export const getAllPartnersData = async () => {
  const res = await api.get("/api/auth/partner/all-partners");
  return res.data.data;
};

export const rejectPartner = async (partnerId: string, reason: string) => {
  const res = await api.patch("/api/auth/admin/reject-partner", {
    partnerId,
    reason,
  });
  return res.data.data;
};

export const reuploadDocuments = async (partnerId: string) => {
  const result = await api.patch("/api/auth/admin/reupload-document", {
    partnerId,
  });
  return result.data.data;
};

export const geAllUserProfiles = async () => {
  const result = await api.get("/api/auth/admin/users/profiles");
  return result.data.data;
};

export const openImage = async (path: string) => {
  const response = await api.post(
    "/api/auth/admin/open-image",
    { path },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data.data;
};
