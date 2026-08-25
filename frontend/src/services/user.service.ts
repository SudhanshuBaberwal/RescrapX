import api from "@/utils/api";

export const getUserDocument = async () => {
  const result = await api.post("/api/auth/sync-vehicle-documents");
  return result.data.data;
};

export const KYC = async (formData: FormData) => {
  const result = await api.post("/api/auth/KYC", formData, {
    headers: {
      "Content-Type": "multipart/form-[#form-data]",
    },
  });
  return result.data.data;
};

export const updateProfile = async (profileData: Record<string, any>) => {
  const result = await api.put("/api/auth/profile", profileData);
  return result.data.data;
};
export const approveKYC = async (documentId: string) => {
  const response = await api.patch(
    `/api/auth/update-status?documentId=${documentId}`,
    {
      verified: true,
    },
  );

  return response.data.data;
};

export const rejectKYC = async (
  documentId: string,
  rejectionReason: string,
) => {
  const response = await api.patch(
    `/api/auth/update-status?documentId=${documentId}`,
    {
      verified: false,
      rejectionReason,
    },
  );

  return response.data.data;
};

export const getMyVerifiedPaymentVehicles = async () => {
  const response = await api.get(
    "/api/vehicle/register/owner/verified-payment",
  );
  return response.data.data;
};
