import axios from "axios";
import { env } from "../config/env.js";

class VehicleClient {
  async getVehicle(vehicleId: string, token: string) {
    const { data } = await axios.get(
      `${env.VEHICLE_SERVICE_URL}/api/vehicle/register/${vehicleId}`,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    return data.data;
  }
}

export default new VehicleClient();