import supabase from "../config/supabase.js";
import { getProcessingStage } from "../helper/editableVehicle.js";
import ApiError from "../lib/ApiError.js";
import Vehicle, {
  IVehicle,
  ProcessingStage,
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

  async findVehicleByVehicleId(vehicleId: string) {
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

  async updateAuctionResult(
    vehicleId: string,
    status: VehicleStatus.SOLD | VehicleStatus.UNSOLD,
    auctionId: string,
    partnerId: string | null,
    winningBid: number | null,
  ) {
    return Vehicle.findByIdAndUpdate(
      vehicleId,
      {
        $set: {
          status,

          auctionResult: {
            auctionId,
            partnerId,
            winningBid,
            wonAt: status === VehicleStatus.SOLD ? new Date() : null,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async approveVehicleForPickup(vehicleId: string) {
    return Vehicle.findOneAndUpdate(
      {
        _id: vehicleId,
        status: VehicleStatus.SOLD,
      },
      {
        $set: {
          status: VehicleStatus.READY_FOR_PICKUP,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async findReadyForPickupVehicle(vehicleId: string) {
    return await Vehicle.findOne({
      _id: vehicleId,
      status: VehicleStatus.READY_FOR_PICKUP,
    });
  }

  async scheduledVehiclePickup(
    vehicleId: string,
    pickupData: any,
    scheduledAt: Date,
    confirmedBy: string,
  ) {
    return await Vehicle.findOneAndUpdate(
      {
        _id: vehicleId,
        status: VehicleStatus.READY_FOR_PICKUP,
      },
      {
        $set: {
          status: VehicleStatus.SCHEDULED,

          pickup: {
            ...pickupData,
            scheduledAt,
            confirmedAt: new Date(),
            confirmedBy,
          },
        },
        $push: {
          timeline: {
            title: "Pickup Scheduled",
            completed: true,
            completedAt: new Date(),
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async findAllReadyForPickupVehicles() {
    return await Vehicle.find({
      status: {
        $in: [
          VehicleStatus.READY_FOR_PICKUP,
          VehicleStatus.SCHEDULED,
          VehicleStatus.DRIVER_ASSIGNED,
        ],
      },
    })
      .select(
        "_id status assignedDriver vehicleDetails.manufacturer vehicleDetails.model vehicleDetails.manufacturingYear vehicleDetails.registrationNumber pickup.contactName pickup.mobileNumber pickup.area pickup.city pickup.state pickup.scheduledAt createdAt",
      )
      .populate({
        path: "owner",
        select: "name phone email",
      })
      .lean()
      .exec();
  }

  async getVehicleDashboardStats() {
    const totalVehicles = await Vehicle.countDocuments();
    return {
      totalVehicles,
    };
  }

  async getActivePickupLocations() {
    return Vehicle.find({
      "pickup.status": {
        $in: ["SCHEDULED", "DRIVER_ASSIGNED", "IN_TRANSIT"],
      },
      "pickup.latitude": {
        $exists: true,
      },
      "pickup.longitude": {
        $exists: true,
      },
    })
      .select({
        _id: 1,
        "vehicleDetails.model": 1,
        "pickup.latitude": 1,
        "pickup.longitude": 1,
        "pickup.status": 1,
      })
      .lean();
  }

  async scheduleVehiclePickup(
    vehicleId: string,
    scheduledAt: Date,
    pickupCharges: number,
    documentCharges: number,
  ) {
    return Vehicle.findOneAndUpdate(
      {
        _id: vehicleId,
        status: VehicleStatus.READY_FOR_PICKUP,
      },
      {
        $set: {
          "pickup.scheduledAt": scheduledAt,
          status: VehicleStatus.SCHEDULED,
          pickupCharges,
          documentCharges,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async assignVehicleDriver(vehicleId: string, driverName: string) {
    return Vehicle.findOneAndUpdate(
      {
        _id: vehicleId,
        status: VehicleStatus.SCHEDULED,
      },
      {
        $set: {
          "pickup.assignedDriver": driverName,
          status: VehicleStatus.DRIVER_ASSIGNED,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async getIncomingVehiclesByPartner(partnerId: string) {
    return Vehicle.find({
      "auctionResult.partnerId": partnerId,

      status: {
        $in: [
          VehicleStatus.SCHEDULED,
          VehicleStatus.DRIVER_ASSIGNED,
          VehicleStatus.IN_TRANSIT,
          VehicleStatus.ARRIVED,
        ],
      },
    })
      .sort({
        updatedAt: -1,
      })
      .lean();
  }

  async getProcessingVehiclesByPartner(partnerId: string) {
    console.log("[PROCESSING] Partner ID:", partnerId);

    const vehicles = await Vehicle.find({
      status: {
        $in: [
          VehicleStatus.PICKED_UP,
          VehicleStatus.IN_TRANSIT,
          VehicleStatus.ARRIVED,
        ],
      },
    })
      .select("_id status auctionResult vehicleDetails pickup updatedAt")
      .sort({
        updatedAt: -1,
      })
      .lean();

    console.log("[PROCESSING] All matching statuses:", vehicles.length);

    for (const vehicle of vehicles) {
      console.log({
        vehicleId: vehicle._id,
        status: vehicle.status,
        partnerId: vehicle.auctionResult?.partnerId,
        matchesPartner: vehicle.auctionResult?.partnerId === partnerId,
      });
    }

    return vehicles.filter(
      (vehicle) => vehicle.auctionResult?.partnerId === partnerId,
    );
  }

  async getProcessingStatsByPartner(partnerId: string) {
    const vehicles = await Vehicle.find({
      "auctionResult.partnerId": partnerId,

      status: {
        $in: [
          VehicleStatus.PICKED_UP,
          VehicleStatus.IN_TRANSIT,
          VehicleStatus.ARRIVED,
        ],
      },
    })
      .select("timeline status")
      .lean();

    const stats = {
      waitingForArrival: 0,
      vehicleReceived: 0,
      inspectionCompleted: 0,
      dismantling: 0,
      recycling: 0,
      certificatePending: 0,
      completed: 0,
    };

    for (const vehicle of vehicles) {
      const stage = getProcessingStage(vehicle.timeline ?? []);

      switch (stage) {
        case ProcessingStage.WAITING_FOR_ARRIVAL:
          stats.waitingForArrival++;
          break;

        case ProcessingStage.VEHICLE_RECEIVED:
          stats.vehicleReceived++;
          break;

        case ProcessingStage.INSPECTION_COMPLETED:
          stats.inspectionCompleted++;
          break;

        case ProcessingStage.DISMANTLING:
          stats.dismantling++;
          break;

        case ProcessingStage.RECYCLING:
          stats.recycling++;
          break;

        case ProcessingStage.CERTIFICATE_PENDING:
          stats.certificatePending++;
          break;

        case ProcessingStage.COMPLETED:
          stats.completed++;
          break;
      }
    }

    return stats;
  }

  async generatePickupOtp(vehicleId: string, otpHash: string, expiresAt: Date) {
    return Vehicle.findOneAndUpdate(
      {
        _id: vehicleId,

        status: VehicleStatus.DRIVER_ASSIGNED,
      },

      {
        $set: {
          "pickup.pickupOtpHash": otpHash,
          "pickup.pickupOtpExpiresAt": expiresAt,
          "pickup.pickupOtpAttempts": 0,
          "pickup.pickupOtpVerifiedAt": null,
        },
      },
      {
        new: true,
      },
    ).lean();
  }
  async getVehicleForPickupVerification(vehicleId: string) {
    return Vehicle.findOne({
      _id: vehicleId,

      status: VehicleStatus.DRIVER_ASSIGNED,
    });
  }
  async markVehiclePickedUp(vehicleId: string, confirmedBy: string) {
    return Vehicle.findOneAndUpdate(
      {
        _id: vehicleId,
        status: VehicleStatus.DRIVER_ASSIGNED,
      },
      {
        $set: {
          status: VehicleStatus.PICKED_UP,
          "pickup.confirmedAt": new Date(),
          "pickup.confirmedBy": confirmedBy,
          "pickup.pickupOtpHash": null,
          "pickup.pickupOtpExpiresAt": null,
          "pickup.pickupOtpAttempts": 0,
          "pickup.pickupOtpVerifiedAt": new Date(),
        },

        $push: {
          timeline: {
            title: "Vehicle Picked Up",
            completed: true,
            completedAt: new Date(),
          },
        },
      },
      {
        new: true,
      },
    ).lean();
  }

  async incrementPickupOtpAttempts(vehicleId: string) {
    return Vehicle.findOneAndUpdate(
      {
        _id: vehicleId,

        status: VehicleStatus.DRIVER_ASSIGNED,
      },
      {
        $inc: {
          "pickup.pickupOtpAttempts": 1,
        },
      },
      {
        new: true,
      },
    );
  }

  async pickedupVehicleRepo(vehicleId: string) {
    return Vehicle.findOneAndUpdate(
      {
        _id: vehicleId,
        status: VehicleStatus.DRIVER_ASSIGNED,
      },
      {
        $set: {
          status: VehicleStatus.PICKED_UP,
        },
        $push: {
          timeline: {
            title: "Vehicle Picked Up",
            completed: true,
            completedAt: new Date(),
          },
        },
      },
      {
        new: true,
      },
    );
  }

  async getAllVehiclesWithStatus() {
    return Vehicle.find({})
      .sort({
        updatedAt: -1,
      })
      .lean();
  }

  async getVehicleStatusById(vehicleId: string) {
    return Vehicle.findById(vehicleId).lean();
  }
}

export default new VehicleRepository();
