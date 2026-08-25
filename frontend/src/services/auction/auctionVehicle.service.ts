import api from "@/utils/api";

export const applyForAuction = async (vehicleId: string) => {
  const vehicle = await api.post(
    `/api/vehicle/register/apply?vehicleId=${vehicleId}`,
  );
  return vehicle.data.data;
};

export const configureAuctionVehicle = async (
  auctionId: string,
  data: {
    vehicleId: string;
    minimumBid: number;
    reservePrice: number;
    bidIncrement: number;
  },
) => {
  const result = await api.patch(
    `/api/auction/configure?auctionId=${auctionId}`,
    data,
  );
  return result.data.data;
};

export const approveVehicleForPickup = async (vehicleId: string) => {
  const response = await api.patch(
    `/api/vehicle/register/approve-pickup?vehicleId=${vehicleId}`,
  );
  return response.data.data;
};
