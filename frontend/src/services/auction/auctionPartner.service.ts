import api from "@/utils/api";

export const partnerAuctionData = async () => {
  const result = await api.get("/api/auction/partner/live");
  return result.data.data;
};

export const placeBid = async (data: {
  auctionId: string;
  vehicleId: string;
  bidAmount: number;
}) => {
  const result = await api.post("/api/auction/bid", data);
  return result.data.data;
};

export const getMyBids = async () => {
  const response = await api.get("/api/auction/partner/my-bids", {
    withCredentials: true,
  });
  return response.data.data;
};

export const wonVehicles = async () => {
  const result = await api.get("/api/auction/partner/won-vehicles");
  return result.data.data;
};
