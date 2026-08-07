import api from "@/utils/api"

export const getUserDocument = async () => {
    try {
        const result = await api.post("/api/auth/sync-vehicle-documents")
        return result.data
    } catch (error) {
        console.log(error)
    }
}

export const KYC = async (formData: FormData) => {
  try {
    const result = await api.post("/api/auth/KYC", formData, {
      headers: {
        "Content-Type": "multipart/form-[#form-data]",
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateProfile = async (profileData: Record<string, any>) => {
  try {
    const result = await api.put("/api/auth/profile", profileData);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};