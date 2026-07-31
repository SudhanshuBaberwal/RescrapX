import Vehicle, {
  IVehicle,
  RegistrationStep,
  VehicleStatus,
} from "../models/vehicle.model.js";

class VehicleRepository {
  async findDraftByUserId(userId: string): Promise<IVehicle | null> {
    return Vehicle.findOne({
      userId,
      status: VehicleStatus.DRAFT,
    });
  }
  async createDraftCar(userId: string): Promise<IVehicle | null> {
    return Vehicle.create({
      userId,
      status: VehicleStatus.DRAFT,
      currentStep: RegistrationStep.VEHICLE_DETAILS,
      timeline: [
        {
          title: "Draft Car Created",
          completed: true,
          completedAt: new Date(),
        },
      ],
    });
  }
}

export default new VehicleRepository();
