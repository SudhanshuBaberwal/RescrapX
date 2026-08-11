import supabase from "../config/supabase.js";
import ApiError from "../lib/ApiError.js";
import Vehicle, {
  IVehicle,
  RegistrationStep,
  VehicleStatus,
} from "../models/vehicle.model.js";

class VehicleRepository {
  BUCKET_NAME = "partner-documents";
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

  async findVehicleByVehicleId( vehicleId: string) {
    return await Vehicle.findOne({
      _id: vehicleId,
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

  async getDocumentUrl(
    path: string,
    expiresIn = 60 * 10, // 10 minutes
  ): Promise<string> {
    if (!path) {
      throw new ApiError(400, "Document path is required");
    }

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .createSignedUrl(path, expiresIn);

    if (error || !data?.signedUrl) {
      console.error("Supabase signed URL error:", error);

      throw new ApiError(404, "Unable to generate document URL");
    }

    return data.signedUrl;
  }
}

export default new VehicleRepository();
