import supabase from "../config/supabase.js";
import ApiError from "../lib/ApiError.js";
import Vehicle, { PartnerDocumentStatus, PartnerDocumentSubmissionStatus, PartnerDocumentType, ProcessingStage, RegistrationStep, VehicleStatus, } from "../models/vehicle.model.js";
class VehicleRepository {
    BUCKET_NAME = "partner-documents";
    async findDraftByUserId(userId) {
        return Vehicle.findOne({
            userId,
            status: VehicleStatus.DRAFT,
        });
    }
    async createDraftCar(userId) {
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
    async findByVehicleId(vehicleId) {
        return Vehicle.findById(vehicleId);
    }
    async saveVehicle(vehicle) {
        return vehicle.save();
    }
    async findVehicleByUserId(userId) {
        return await Vehicle.find({ owner: userId });
    }
    async findAllVehicles() {
        return await Vehicle.find({ isRegistered: true });
    }
    async findVehicleByVehicleId(vehicleId) {
        return await Vehicle.findOne({
            _id: vehicleId,
        });
    }
    async getPublicUrl(path) {
        if (!path)
            return null;
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
    async getDocumentUrl(path, expiresIn = 60 * 10) {
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
    async updateAuctionResult(vehicleId, status, auctionId, partnerId, winningBid) {
        return Vehicle.findByIdAndUpdate(vehicleId, {
            $set: {
                status,
                auctionResult: {
                    auctionId,
                    partnerId,
                    winningBid,
                    wonAt: status === VehicleStatus.SOLD ? new Date() : null,
                },
            },
        }, {
            new: true,
            runValidators: true,
        });
    }
    async approveVehicleForPickup(vehicleId) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            status: VehicleStatus.SOLD,
        }, {
            $set: {
                status: VehicleStatus.READY_FOR_PICKUP,
            },
        }, {
            new: true,
            runValidators: true,
        });
    }
    async findReadyForPickupVehicle(vehicleId) {
        return await Vehicle.findOne({
            _id: vehicleId,
            status: VehicleStatus.READY_FOR_PICKUP,
        });
    }
    async scheduledVehiclePickup(vehicleId, pickupData, scheduledAt, confirmedBy) {
        return await Vehicle.findOneAndUpdate({
            _id: vehicleId,
            status: VehicleStatus.READY_FOR_PICKUP,
        }, {
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
        }, {
            new: true,
            runValidators: true,
        });
    }
    async findAllReadyForPickupVehicles() {
        return await Vehicle.find({
            status: {
                $in: [
                    VehicleStatus.READY_FOR_PICKUP,
                    VehicleStatus.SCHEDULED,
                    VehicleStatus.DRIVER_ASSIGNED,
                    VehicleStatus.PICKED_UP,
                    VehicleStatus.ARRIVED,
                ],
            },
        })
            .select("_id status assignedDriver vehicleDetails.manufacturer vehicleDetails.model vehicleDetails.manufacturingYear vehicleDetails.registrationNumber pickup.contactName pickup.mobileNumber pickup.area pickup.city pickup.state pickup.scheduledAt createdAt")
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
    async scheduleVehiclePickup(vehicleId, scheduledAt, pickupCharges, documentCharges) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            status: VehicleStatus.READY_FOR_PICKUP,
        }, {
            $set: {
                "pickup.scheduledAt": scheduledAt,
                status: VehicleStatus.SCHEDULED,
                pickupCharges,
                documentCharges,
            },
        }, {
            new: true,
            runValidators: true,
        });
    }
    async assignVehicleDriver(vehicleId, driverName) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            status: VehicleStatus.SCHEDULED,
        }, {
            $set: {
                "pickup.assignedDriver": driverName,
                status: VehicleStatus.DRIVER_ASSIGNED,
            },
        }, {
            new: true,
            runValidators: true,
        });
    }
    async getIncomingVehiclesByPartner(partnerId) {
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
    async getProcessingVehiclesByPartner(partnerId) {
        return Vehicle.find({
            "auctionResult.partnerId": partnerId,
            status: {
                $in: [
                    VehicleStatus.PICKED_UP,
                    VehicleStatus.IN_TRANSIT,
                    VehicleStatus.ARRIVED,
                ],
            },
        })
            .select("_id status processingStage auctionResult vehicleDetails pickup timeline updatedAt")
            .sort({
            updatedAt: -1,
        })
            .lean();
    }
    async getProcessingStatsByPartner(partnerId) {
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
            .select("processingStage")
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
            switch (vehicle.processingStage) {
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
    async generatePickupOtp(vehicleId, otpHash, expiresAt) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            status: VehicleStatus.DRIVER_ASSIGNED,
        }, {
            $set: {
                "pickup.pickupOtpHash": otpHash,
                "pickup.pickupOtpExpiresAt": expiresAt,
                "pickup.pickupOtpAttempts": 0,
                "pickup.pickupOtpVerifiedAt": null,
            },
        }, {
            new: true,
        }).lean();
    }
    async getVehicleForPickupVerification(vehicleId) {
        return Vehicle.findOne({
            _id: vehicleId,
            status: VehicleStatus.DRIVER_ASSIGNED,
        });
    }
    async markVehiclePickedUp(vehicleId, confirmedBy) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            status: VehicleStatus.DRIVER_ASSIGNED,
        }, {
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
        }, {
            new: true,
        }).lean();
    }
    async incrementPickupOtpAttempts(vehicleId) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            status: VehicleStatus.DRIVER_ASSIGNED,
        }, {
            $inc: {
                "pickup.pickupOtpAttempts": 1,
            },
        }, {
            new: true,
        });
    }
    async pickedupVehicleRepo(vehicleId) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            status: VehicleStatus.DRIVER_ASSIGNED,
        }, {
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
        }, {
            new: true,
        });
    }
    async getAllVehiclesWithStatus() {
        return Vehicle.find({})
            .sort({
            updatedAt: -1,
        })
            .lean();
    }
    async getVehicleStatusById(vehicleId) {
        return Vehicle.findById(vehicleId).lean();
    }
    async markVehicleArrived(vehicleId) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            status: VehicleStatus.PICKED_UP,
        }, {
            $set: {
                status: VehicleStatus.ARRIVED,
                processingStage: ProcessingStage.VEHICLE_RECEIVED,
            },
            $push: {
                timeline: {
                    status: VehicleStatus.ARRIVED,
                    message: "Vehicle arrived at RVSF facility",
                    createdAt: new Date(),
                },
            },
        }, {
            new: true,
            runValidators: true,
        }).lean();
    }
    async getArrivedVehiclesForPartner(partnerId) {
        return Vehicle.find({
            "auctionResult.partnerId": partnerId,
            status: VehicleStatus.ARRIVED,
            processingStage: ProcessingStage.VEHICLE_RECEIVED,
        })
            .sort({
            updatedAt: -1,
        })
            .lean();
    }
    async getPartnerVehicleDocuments(vehicleId, partnerId) {
        return Vehicle.findOne({
            _id: vehicleId,
            "auctionResult.partnerId": partnerId,
            status: VehicleStatus.ARRIVED,
            processingStage: ProcessingStage.VEHICLE_RECEIVED,
        })
            .select({
            vehicleDetails: 1,
            auctionResult: 1,
            documents: 1,
            status: 1,
            processingStage: 1,
        })
            .lean();
    }
    async upsertPartnerDocument(vehicleId, partnerId, document) {
        const vehicle = await Vehicle.findOne({
            _id: vehicleId,
            "auctionResult.partnerId": partnerId,
            status: VehicleStatus.ARRIVED,
            processingStage: ProcessingStage.VEHICLE_RECEIVED,
        });
        if (!vehicle) {
            return null;
        }
        if (!vehicle.documents) {
            vehicle.documents = {};
        }
        if (!vehicle.partnerDocuments) {
            vehicle.partnerDocuments = [];
        }
        const existingIndex = vehicle.partnerDocuments.findIndex((doc) => doc.type === document.type);
        if (existingIndex !== -1) {
            vehicle.partnerDocuments[existingIndex] = document;
        }
        else {
            vehicle.partnerDocuments.push(document);
        }
        vehicle.partnerDocumentStatus = PartnerDocumentSubmissionStatus.IN_PROGRESS;
        await vehicle.save();
        return vehicle.toObject();
    }
    async submitPartnerDocuments(vehicleId, partnerId) {
        const vehicle = await Vehicle.findOne({
            _id: vehicleId,
            "auctionResult.partnerId": partnerId,
            status: VehicleStatus.ARRIVED,
            processingStage: ProcessingStage.VEHICLE_RECEIVED,
        });
        if (!vehicle) {
            return null;
        }
        const documents = vehicle.partnerDocuments ?? [];
        const requiredTypes = [
            PartnerDocumentType.CERTIFICATE_OF_DEPOSIT,
            PartnerDocumentType.CERTIFICATE_OF_SCRAPPING,
            PartnerDocumentType.CHASSIS_PROOF,
        ];
        const hasAllRequired = requiredTypes.every((requiredType) => documents.some((doc) => doc.type === requiredType &&
            doc.path &&
            doc.status !== PartnerDocumentStatus.REJECTED));
        if (!hasAllRequired) {
            throw new ApiError(400, "All required documents must be uploaded before submission");
        }
        vehicle.partnerDocumentStatus = PartnerDocumentSubmissionStatus.SUBMITTED;
        await vehicle.save();
        return vehicle.toObject();
    }
}
export default new VehicleRepository();
