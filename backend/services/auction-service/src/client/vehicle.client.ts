import axios from "axios";

export const vehicleClient = {
  async getReadyForBiddingVehicles(token: string) {
    const response = await axios.get(
      `${process.env.VEHICLE_SERVICE_URL}/api/vehicles/ready-for-bidding`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  },
};