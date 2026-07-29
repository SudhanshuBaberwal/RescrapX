import api from "@/utils/api";

export const approvePartner = async (partnerId: string) => {
  try {
    const res = await api.patch(
      `/api/auth/admin/partners/${partnerId}/approve`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPartnersData =async () => {
  try {
    const res = await api.get("/api/auth/partner/all-partners")
    return res.data
  } catch (error) {
    console.log(error)
  }
}
