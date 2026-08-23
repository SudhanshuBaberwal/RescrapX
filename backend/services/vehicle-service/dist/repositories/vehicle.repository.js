import supabase from "../config/supabase.js";
import ApiError from "../lib/ApiError.js";
import Vehicle, { PartnerDocumentStatus, PartnerDocumentSubmissionStatus, PartnerDocumentType, PaymentStatus, ProcessingStage, RegistrationStep, VehicleStatus, } from "../models/vehicle.model.js";
export const PROCESSING_STAGE_ORDER = [
    ProcessingStage.VEHICLE_RECEIVED,
    ProcessingStage.INSPECTION_COMPLETED,
    ProcessingStage.DISMANTLING,
    ProcessingStage.RECYCLING,
    ProcessingStage.CERTIFICATE_PENDING,
    ProcessingStage.COMPLETED,
];
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
            processingStage: ProcessingStage.CERTIFICATE_PENDING,
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
            processingStage: ProcessingStage.CERTIFICATE_PENDING,
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
            processingStage: ProcessingStage.CERTIFICATE_PENDING,
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
        vehicle.partnerDocumentStatus = PartnerDocumentSubmissionStatus.SUBMITTED;
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
    async getCustomerBookings(ownerId) {
        return Vehicle.find({
            owner: ownerId,
            // Only vehicles which actually became bookings.
            "auctionResult.partnerId": {
                $ne: null,
            },
            status: {
                $in: [
                    VehicleStatus.SOLD,
                    VehicleStatus.READY_FOR_PICKUP,
                    VehicleStatus.SCHEDULED,
                    VehicleStatus.DRIVER_ASSIGNED,
                    VehicleStatus.PICKED_UP,
                    VehicleStatus.IN_TRANSIT,
                    VehicleStatus.ARRIVED,
                    VehicleStatus.CANCELLED,
                ],
            },
        })
            .sort({
            updatedAt: -1,
        })
            .lean();
    }
    async getCustomerBookingById(ownerId, vehicleId) {
        return Vehicle.findOne({
            _id: vehicleId,
            owner: ownerId,
            "auctionResult.partnerId": {
                $ne: null,
            },
        }).lean();
    }
    async getPartnerDashboardVehicles(partnerId) {
        return Vehicle.find({
            "auctionResult.partnerId": partnerId,
        })
            .sort({
            updatedAt: -1,
        })
            .lean();
    }
    async getPartnerProcessingStats(partnerId) {
        const result = await Vehicle.aggregate([
            {
                $match: {
                    "auctionResult.partnerId": partnerId,
                },
            },
            {
                $group: {
                    _id: "$processingStage",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
        return result;
    }
    async getPartnerOrdersWonToday(partnerId) {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        const result = await Vehicle.aggregate([
            {
                $match: {
                    "auctionResult.partnerId": partnerId,
                    "auctionResult.wonAt": {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    count: {
                        $sum: 1,
                    },
                    totalValue: {
                        $sum: {
                            $ifNull: ["$auctionResult.winningBid", 0],
                        },
                    },
                },
            },
        ]);
        return (result[0] ?? {
            count: 0,
            totalValue: 0,
        });
    }
    async getPartnerMonthlyRevenue(partnerId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const result = await Vehicle.aggregate([
            {
                $match: {
                    "auctionResult.partnerId": partnerId,
                    "auctionResult.wonAt": {
                        $gte: startOfMonth,
                        $lte: endOfMonth,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    revenue: {
                        $sum: {
                            $ifNull: ["$auctionResult.winningBid", 0],
                        },
                    },
                },
            },
        ]);
        return result[0]?.revenue ?? 0;
    }
    async getPartnerPendingDocuments(partnerId) {
        const vehicles = await Vehicle.find({
            "auctionResult.partnerId": partnerId,
            partnerDocuments: {
                $elemMatch: {
                    status: {
                        $in: [
                            PartnerDocumentStatus.PENDING,
                            PartnerDocumentStatus.REJECTED,
                        ],
                    },
                },
            },
        })
            .select({
            vehicleDetails: 1,
            partnerDocuments: 1,
            auctionResult: 1,
        })
            .lean();
        const documents = [];
        for (const vehicle of vehicles) {
            for (const document of vehicle.partnerDocuments ?? []) {
                if (document.status === PartnerDocumentStatus.PENDING ||
                    document.status === PartnerDocumentStatus.REJECTED) {
                    documents.push({
                        vehicleId: vehicle._id.toString(),
                        registrationNumber: vehicle.vehicleDetails?.registrationNumber ?? null,
                        vehicleName: vehicle.vehicleDetails?.carName ??
                            vehicle.vehicleDetails?.model ??
                            "Vehicle",
                        documentId: document._id?.toString(),
                        type: document.type,
                        required: document.required,
                        status: document.status,
                        rejectionReason: document.rejectionReason ?? null,
                    });
                }
            }
        }
        return documents;
    }
    async updateProcessingStage(vehicleId, partnerId, currentStage, nextStage) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            "auctionResult.partnerId": partnerId,
            processingStage: currentStage,
            status: VehicleStatus.ARRIVED,
        }, {
            $set: {
                processingStage: nextStage,
            },
            $push: {
                timeline: {
                    status: VehicleStatus.ARRIVED,
                    title: nextStage,
                    message: `Processing stage changed to ${nextStage}`,
                    completed: true,
                    completedAt: new Date(),
                    createdAt: new Date(),
                },
            },
        }, {
            new: true,
            runValidators: true,
        }).lean();
    }
    async getVehiclesWithPartnerDocumentsForAdmin() {
        return Vehicle.find({
            partnerDocumentStatus: {
                $in: [
                    PartnerDocumentSubmissionStatus.SUBMITTED,
                    PartnerDocumentSubmissionStatus.IN_PROGRESS,
                    PartnerDocumentSubmissionStatus.REJECTED,
                    PartnerDocumentSubmissionStatus.APPROVED,
                ],
            },
            partnerDocuments: {
                $exists: true,
                $ne: [],
            },
        })
            .sort({
            updatedAt: -1,
        })
            .lean();
    }
    async getPartnerDocumentsForAdmin(vehicleId) {
        return Vehicle.findById(vehicleId)
            .select({
            vehicleDetails: 1,
            owner: 1,
            auctionResult: 1,
            processingStage: 1,
            status: 1,
            partnerDocumentStatus: 1,
            partnerDocuments: 1,
            updatedAt: 1,
        })
            .lean();
    }
    async reviewPartnerDocument(vehicleId, documentId, status, reviewedBy, rejectionReason) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            "partnerDocuments._id": documentId,
        }, {
            $set: {
                "partnerDocuments.$.status": status,
                "partnerDocuments.$.reviewedAt": new Date(),
                "partnerDocuments.$.reviewedBy": reviewedBy,
                "partnerDocuments.$.rejectionReason": status === PartnerDocumentStatus.REJECTED ? rejectionReason : null,
            },
        }, {
            new: true,
            runValidators: true,
        }).lean();
    }
    async approveAllPartnerDocuments(vehicleId, reviewedBy) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            "partnerDocuments.0": {
                $exists: true,
            },
            partnerDocumentStatus: PartnerDocumentSubmissionStatus.SUBMITTED,
        }, {
            $set: {
                "partnerDocuments.$[].status": PartnerDocumentStatus.APPROVED,
                "partnerDocuments.$[].reviewedAt": new Date(),
                "partnerDocuments.$[].reviewedBy": reviewedBy,
                "partnerDocuments.$[].rejectionReason": null,
                partnerDocumentStatus: PartnerDocumentSubmissionStatus.APPROVED,
            },
        }, {
            new: true,
            runValidators: true,
        }).lean();
    }
    async getPaymentVehiclesForPartner(partnerId) {
        return Vehicle.find({
            "auctionResult.partnerId": partnerId,
            // Vehicle has arrived
            status: VehicleStatus.ARRIVED,
            // Partner documents approved
            partnerDocumentStatus: PartnerDocumentSubmissionStatus.APPROVED,
        })
            .sort({
            updatedAt: -1,
        })
            .lean();
    }
    async uploadPartnerPaymentProof(vehicleId, partnerId, document) {
        return Vehicle.findOneAndUpdate({
            _id: vehicleId,
            "auctionResult.partnerId": partnerId,
            status: VehicleStatus.ARRIVED,
            partnerDocumentStatus: PartnerDocumentSubmissionStatus.APPROVED,
        }, {
            $push: {
                paymentProofs: {
                    type: document.type,
                    fileName: document.fileName,
                    fileUrl: document.fileUrl,
                    storagePath: document.storagePath,
                    uploadedBy: partnerId,
                    uploadedAt: new Date(),
                    verified: false,
                },
            },
            $set: {
                paymentStatus: PaymentStatus.PROOF_UPLOADED,
            },
        }, {
            new: true,
            runValidators: true,
        }).lean();
    }
}
export default new VehicleRepository();
