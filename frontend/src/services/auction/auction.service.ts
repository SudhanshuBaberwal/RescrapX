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

export const approveAuction = async (auctionId: string) => {
  try {
    const result = await api.post(
      `/api/auction/approve?auctionId=${auctionId}`,
    );
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPendingStartApprovalAuctions = async () => {
  try {
    const response = await api.get("/api/auction/start-approval/pending");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const approveAuctionStart = async (auctionId: string) => {
  try {
    const response = await api.patch(
      `/api/auction/start-approval/approve?auctionId=${auctionId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const rejectAuctionStart = async (auctionId: string) => {
  try {
    const response = await api.patch(
      `/api/auction/start-approval/reject?auctionId=${auctionId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
