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
  try {
    const result = await api.post("/api/auth/partner/signup",data);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getPartnerStatus = async () => {
  try {
    const data= await api.get("/api/auth/partner/status")
    return data.data;
  } catch (error) {
    console.log(error)
  }
}

export const setPartner = async () => {
  try {
    const data = await api.post("/api/auth/partner/set-partner")
    return data.data;
  } catch (error) {
    console.log(error)
  }
}

export const partnerDashboardData = async () => {
  try {
    const response1 = await api.get("/api/vehicle/register/partner/dashboard")
    // const response2 = await api.get("/api/auction/partner/live-opportunities")
    return response1.data ;
  } catch (error) {
    console.log(error)
  }
}

export const liveBiddingPartnerDashboardData = async () => {
  try {
    const response = await api.get("/api/auction/partner/live-opportunities")
    return response.data;
  } catch (error) {
    console.log(error)
  }
}
