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
      owner: userId,
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

  async findByVehicleId(vehicleId: string) {
    return Vehicle.findById(vehicleId);
  }

  async saveVehicle(vehicle: IVehicle) {
    return vehicle.save();
  }

  async findVehicleByUserId(userId: string) {
    return Vehicle.find({ owner: userId });
  }

  async findVehicleByVehicleId(userId: string, vehicleId: string) {
    return await Vehicle.findOne({
      _id: vehicleId,
      owner: userId,
    });
  }
}

export default new VehicleRepository();
