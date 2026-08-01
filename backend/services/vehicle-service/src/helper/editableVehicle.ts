import ApiError from "../lib/ApiError.js";
import vehicleRepository from "../repositories/vehicle.repository.js";

const getEditableVehicle = async(
    vehicleId: string,
    userId: string
) => {

    const vehicle = await vehicleRepository.findByVehicleId(vehicleId);

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    if (vehicle.owner.toString() !== userId) {
        throw new ApiError(403, "Unauthorized");
    }

    if (vehicle.isRegistered) {
        throw new ApiError(400, "Vehicle already submitted");
    }

    return vehicle;
}

export default getEditableVehicle