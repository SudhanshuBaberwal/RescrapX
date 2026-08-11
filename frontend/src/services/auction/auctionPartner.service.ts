import api from "@/utils/api";

export const partnerAuctionData = async () => {
  try {
    const result = await api.get("/api/auction/partner/live");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const placeBid = async (data: {
  auctionId: string;
  vehicleId: string;
  bidAmount: number;
}) => {
  try {
    const result = await api.post("/api/auction/bid", data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
