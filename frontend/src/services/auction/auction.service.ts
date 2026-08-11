import api from "@/utils/api";

export const createAuction = async (data: {
  startTime: string;
  endTime: string;
  visibility: "PUBLIC" | "PRIVATE";
  autoExtend: boolean;
}) => {
  try {
    const result = await api.post("/api/auction/create", data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAuctionDataService = async () => {
  try {
    const result = await api.get("/api/auction/auction");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
