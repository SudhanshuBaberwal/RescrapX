import vehicleRepository from "../repositories/vehicle.repository.js";
import { IVehicle } from "../models/vehicle.model.js";
import ApiError from "../lib/ApiError.js";

class VehicleService {
  async createDraftVehicle(userId: string): Promise<IVehicle | null> {
    const existingDraft = await vehicleRepository.findDraftByUserId(userId);

    if (existingDraft) {
      throw new ApiError(
        409,
        "You already have an unfinished vehicle draft."
      );
    }

    return vehicleRepository.createDraftCar(userId);
  }
}

export default new VehicleService();