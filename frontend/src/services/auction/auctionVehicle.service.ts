import api from "@/utils/api";

export const applyForAuction = async (vehicleId: string) => {
  try {
    const vehicle = await api.post(
      `/api/vehicle/register/apply?vehicleId=${vehicleId}`,
    );
    return vehicle.data;
  } catch (error) {
    console.log(error);
  }
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
  try {
    const result = await api.patch(`/api/auction/configure?auctionId=${auctionId}`, data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
