import api from "@/utils/api";

export const getCurrentUser = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const signup = async (data: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const res = await api.post("/api/auth/signup", data);
  return res.data;
};

export const verifyOTP = async (data: {
  email: string;
  otp: string;
}) => {
  const res = await api.post("/api/auth/verify-email", data);
  return res.data;
};