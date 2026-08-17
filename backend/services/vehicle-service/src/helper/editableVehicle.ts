import ApiError from "../lib/ApiError.js";
import { ProcessingStage } from "../models/vehicle.model.js";
import vehicleRepository from "../repositories/vehicle.repository.js";

const getEditableVehicle = async (vehicleId: string, userId: string) => {
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
};

export function getProcessingStage(
  timeline: {
    title: string;
    completed: boolean;
    completedAt?: Date;
  }[] = [],
): ProcessingStage {
  const completedStages = timeline
    .filter((item) => item.completed)
    .map((item) => item.title.toUpperCase());

  if (
    completedStages.includes("COMPLETED") ||
    completedStages.includes("SCRAPPING COMPLETED")
  ) {
    return ProcessingStage.COMPLETED;
  }

  if (
    completedStages.includes("CERTIFICATE PENDING") ||
    completedStages.includes("COD PENDING") ||
    completedStages.includes("CERTIFICATE")
  ) {
    return ProcessingStage.CERTIFICATE_PENDING;
  }

  if (
    completedStages.includes("RECYCLING") ||
    completedStages.includes("RECYCLING STARTED")
  ) {
    return ProcessingStage.RECYCLING;
  }

  if (
    completedStages.includes("DISMANTLING") ||
    completedStages.includes("DISMANTLING STARTED")
  ) {
    return ProcessingStage.DISMANTLING;
  }

  if (
    completedStages.includes("INSPECTION COMPLETED") ||
    completedStages.includes("INSPECTION")
  ) {
    return ProcessingStage.INSPECTION_COMPLETED;
  }

  if (
    completedStages.includes("VEHICLE RECEIVED") ||
    completedStages.includes("RECEIVED")
  ) {
    return ProcessingStage.VEHICLE_RECEIVED;
  }

  return ProcessingStage.WAITING_FOR_ARRIVAL;
}

export default getEditableVehicle;
