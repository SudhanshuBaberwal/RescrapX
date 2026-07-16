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
    console.log(data)
  } catch (error) {
    console.log(error);
  }
};
