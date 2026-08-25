import api from "@/utils/api";

export const partnerRegister = async (data: {
  phoneNumber: string;
  companyName: string;
  gstNumber: string;
  panNumber: string;
  registrationNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}) => {
  const result = await api.post("/api/auth/partner/signup", data);
  return result.data.data;
};

export const getPartnerStatus = async () => {
  const data = await api.get("/api/auth/partner/status");
  return data.data.data;
};

export const setPartner = async () => {
  const data = await api.post("/api/auth/partner/set-partner");
  return data.data.data;
};

export const partnerDashboardData = async () => {
  const response1 = await api.get("/api/vehicle/register/partner/dashboard");
  return response1.data.data;
};

export const liveBiddingPartnerDashboardData = async () => {
  const response = await api.get("/api/auction/partner/live-opportunities");
  return response.data.data;
};
