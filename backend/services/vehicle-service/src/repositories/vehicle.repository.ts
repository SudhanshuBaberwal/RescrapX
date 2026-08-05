import supabase from "../config/supabase.js";
import ApiError from "../lib/ApiError.js";
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
    return await Vehicle.find({ owner: userId });
  }

  async findAllVehicles() {
    return await Vehicle.find({ isRegistered: true });
  }

  async findVehicleByVehicleId(userId: string, vehicleId: string) {
    return await Vehicle.findOne({
      _id: vehicleId,
      owner: userId,
    });
  }

  async getPublicUrl(path: string) {
    if (!path) return null;

    // Clean path to prevent leading slashes or accidental bucket prefix duplicates
    const cleanPath = path
      .replace(/^partner-documents\//, "")
      .replace(/^\/+/, "");

    // OPTION A: If your bucket "partner-documents" is set to PUBLIC in Supabase:
    const { data } = supabase.storage
      .from("partner-documents")
      .getPublicUrl(cleanPath);

    return data.publicUrl;
  }
}

export default new VehicleRepository();
