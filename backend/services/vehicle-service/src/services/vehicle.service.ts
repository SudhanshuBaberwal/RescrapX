import vehicleRepository from "../repositories/vehicle.repository.js";
import { IVehicle } from "../models/vehicle.model.js";
import ApiError from "../lib/ApiError.js";
import {
  vehicleBasicDto,
  vehicleConditionDto,
  vehicleMajorComponentsDto,
} from "../validations/vehicle.validation.js";
import getEditableVehicle from "../helper/editableVehicle.js";

class VehicleService {
  private validateStep(vehicle: IVehicle, requiredStep: number) {
    if (vehicle.currentStep < requiredStep) {
      throw new ApiError(400, `Complete Step ${requiredStep} first.`);
    }

    if (vehicle.isRegistered) {
      throw new ApiError(400, "Vehicle already submitted.");
    }
  }

  async createDraftVehicle(userId: string): Promise<IVehicle | null> {
    const existingDraft = await vehicleRepository.findDraftByUserId(userId);

    if (existingDraft) {
      throw new ApiError(409, "You already have an unfinished vehicle draft.");
    }

    return vehicleRepository.createDraftCar(userId);
  }
  async basicDetails(userId: string, data: vehicleBasicDto, vehicleId: string) {
    const vehicle = await getEditableVehicle(vehicleId, userId);

    this.validateStep(vehicle, 0);
    if (vehicle.owner.toString() !== userId) {
      throw new ApiError(404, "Unauthorized For this Vehicle");
    }

    if (vehicle.currentStep < 0) {
      throw new ApiError(400, "Create Draft first");
    }
    vehicle.vehicleDetails = {
      registrationNumber: data.registrationNumber,
      manufacturer: data.carName,
      model: data.model,
      variant: data.variant,
      fuelType: data.fuelType,
      transmission: data.transmission,
      manufacturingYear: data.manufacturingYear,
      kmsDriven: data.odometerReading,
      ownership: data.ownership,
    };

    vehicle.currentStep = Math.max(vehicle.currentStep, 1);
    await vehicleRepository.saveVehicle(vehicle);
    return vehicle;
  }

  async vehicleCondition(
    userId: string,
    vehicleId: string,
    data: vehicleConditionDto,
  ) {
    const vehicle = await getEditableVehicle(vehicleId, userId);
    this.validateStep(vehicle, 1);
    vehicle.vehicleCondition = {
      accidentType: data.accidentType,
      structure: data.structuralDamage,
      airbagsDeployed: data.airbagsDeployed,
      description: data.description ?? "",
    };

    vehicle.currentStep = Math.max(vehicle.currentStep, 2);

    await vehicleRepository.saveVehicle(vehicle);

    return vehicle;
  }

  async majorComponents(
    userId: string,
    vehicleId: string,
    data: vehicleMajorComponentsDto,
  ) {
    const vehicle = await getEditableVehicle(vehicleId, userId);
    this.validateStep(vehicle, 2);
    vehicle.majorComponents = {
      engine: data.engine,
      radiator: data.radiator,
      fuelSystem: data.fuelSystem,
      gearbox: data.gearbox,
      suspension: data.suspension,
      steering: data.steering,
      electrical: data.electrical,
      exhaust: data.exhaust,
      tyres: data.tyres,
      ac: data.ac,
      bodyPanels: data.bodyPanels,
      glass: data.glass,
      lights: data.lights,
      interior: data.interior,
    };
    vehicle.currentStep = Math.max(vehicle.currentStep, 3);
    await vehicleRepository.saveVehicle(vehicle);
    return vehicle;
  }
}

export default new VehicleService();
