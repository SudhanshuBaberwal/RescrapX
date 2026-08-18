import vehicleRepository from "../repositories/vehicle.repository.js";
import Vehicle, { PartnerDocumentStatus, PartnerDocumentSubmissionStatus, PartnerDocumentType, RegistrationStep, VehicleStatus, } from "../models/vehicle.model.js";
import ApiError from "../lib/ApiError.js";
import { vehicleDocumentSchema, } from "../validations/vehicle.validation.js";
import getEditableVehicle from "../helper/editableVehicle.js";
import supabaseService from "./supabase.service.js";
import mongoose from "mongoose";
import { generatePickupOtp, hashPickupOtp } from "../helper/otp.js";
const createPhoto = (upload, file) => ({
    path: upload.path,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date(),
});
class VehicleService {
    validateStep(vehicle, requiredStep) {
        if (vehicle.currentStep < requiredStep) {
            throw new ApiError(400, `Complete Step ${requiredStep} first.`);
        }
        if (vehicle.isRegistered) {
            throw new ApiError(400, "Vehicle already submitted.");
        }
    }
    async createDraftVehicle(userId) {
        const existingDraft = await vehicleRepository.findDraftByUserId(userId);
        if (existingDraft) {
            throw new ApiError(409, "You already have an unfinished vehicle draft.");
        }
        return vehicleRepository.createDraftCar(userId);
    }
    async basicDetails(userId, data, vehicleId) {
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
            carName: data.carName,
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
    async vehicleCondition(userId, vehicleId, data) {
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
    async majorComponents(userId, vehicleId, data) {
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
    async uploadDocument(userId, vehicleId, files) {
        vehicleDocumentSchema(files);
        const vehicle = await vehicleRepository.findByVehicleId(vehicleId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found");
        }
        if (vehicle.owner.toString() !== userId) {
            throw new ApiError(403, "Unauthorized");
        }
        // Step 3 must be completed first
        if (vehicle.currentStep < 3) {
            throw new ApiError(400, "Please complete previous registration steps first.");
        }
        // const extension = file.originalname.split(".").pop();
        const filePath = `vehicles/${userId}/document${vehicleId}`;
        const [rcbook, insurance, puc, loan_closure, other] = await Promise.all([
            supabaseService.uploadToSupabase(files.rcbook[0], filePath, "rcbook"),
            supabaseService.uploadToSupabase(files.insurance[0], filePath, "insurance"),
            supabaseService.uploadToSupabase(files.loan_closure[0], filePath, "loan_closure"),
            supabaseService.uploadToSupabase(files.puc[0], filePath, "puc"),
            supabaseService.uploadToSupabase(files.other[0], filePath, "other"),
        ]);
        vehicle.documents = {
            rcbook: {
                path: rcbook.path,
                originalName: files.rcbook[0].originalname,
                mimeType: files.rcbook[0].mimetype,
                size: files.rcbook[0].size,
                uploadedAt: new Date(),
            },
            insurance: {
                path: insurance.path,
                originalName: files.insurance[0].originalname,
                mimeType: files.insurance[0].mimetype,
                size: files.insurance[0].size,
                uploadedAt: new Date(),
            },
            puc: {
                path: puc.path,
                originalName: files.puc[0].originalname,
                mimeType: files.puc[0].mimetype,
                size: files.puc[0].size,
                uploadedAt: new Date(),
            },
            loanClosure: {
                path: loan_closure.path,
                originalName: files.loan_closure[0].originalname,
                mimeType: files.loan_closure[0].mimetype,
                size: files.loan_closure[0].size,
                uploadedAt: new Date(),
            },
            other: {
                path: other.path,
                originalName: files.other[0].originalname,
                mimeType: files.other[0].mimetype,
                size: files.other[0].size,
                uploadedAt: new Date(),
            },
        };
        // vehicle.documents = document as any;
        if (vehicle.documents.rcbook) {
            vehicle.currentStep = Math.max(vehicle.currentStep, RegistrationStep.PHOTOS);
        }
        await vehicle.save();
        return vehicle;
    }
    async uploadPhotos(userId, vehicleId, files) {
        const vehicle = await vehicleRepository.findByVehicleId(vehicleId);
        if (!vehicle) {
            throw new ApiError(400, "Vehicle Not Found");
        }
        if (vehicle.owner.toString() !== userId) {
            throw new ApiError(403, "Unauthrorized");
        }
        if (vehicle.currentStep < RegistrationStep.DOCUMENTS) {
            throw new ApiError(400, "Complete previous step first.");
        }
        const folder = `vehicles/${userId}/${vehicleId}/photos`;
        const [front, rear, left, right, dashboard, interior, engine, odometer] = await Promise.all([
            supabaseService.uploadToSupabase(files.front[0], folder, "front"),
            supabaseService.uploadToSupabase(files.rear[0], folder, "rear"),
            supabaseService.uploadToSupabase(files.left[0], folder, "left"),
            supabaseService.uploadToSupabase(files.right[0], folder, "right"),
            supabaseService.uploadToSupabase(files.dashboard[0], folder, "dashboard"),
            supabaseService.uploadToSupabase(files.interior[0], folder, "interior"),
            supabaseService.uploadToSupabase(files.engine[0], folder, "engine"),
            supabaseService.uploadToSupabase(files.odometer[0], folder, "odometer"),
        ]);
        vehicle.photos = {
            front: createPhoto(front, files.front[0]),
            rear: createPhoto(rear, files.rear[0]),
            left: createPhoto(left, files.left[0]),
            right: createPhoto(right, files.right[0]),
            dashboard: createPhoto(dashboard, files.dashboard[0]),
            interior: createPhoto(interior, files.interior[0]),
            engine: createPhoto(engine, files.engine[0]),
            odometer: createPhoto(odometer, files.odometer[0]),
        };
        if (files.chassisNumber) {
            const chassis = await supabaseService.uploadToSupabase(files.chassisNumber[0], folder, "chassis");
            vehicle.photos.chassisNumber = createPhoto(chassis, files.chassisNumber[0]);
        }
        vehicle.currentStep = Math.max(vehicle.currentStep, RegistrationStep.PHOTOS);
        await vehicle.save();
        return vehicle;
    }
    async savePickupLocation(userId, vehicleId, payload) {
        const vehicle = await vehicleRepository.findByVehicleId(vehicleId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found");
        }
        if (vehicle.owner.toString() != userId) {
            throw new ApiError(403, "Unauthorized");
        }
        if (vehicle.currentStep < RegistrationStep.PHOTOS) {
            throw new ApiError(400, "Complete previous steps first.");
        }
        vehicle.pickup = {
            houseNumber: payload.houseNumber,
            street: payload.street,
            area: payload.area,
            landmark: payload.landmark,
            city: payload.city,
            state: payload.state,
            pincode: payload.pincode,
            latitude: payload.latitude,
            longitude: payload.longitude,
            formattedAddress: payload.formattedAddress,
            contactName: payload.contactName,
            mobileNumber: payload.mobileNumber,
            alternateNumber: payload.alternateNumber,
            vehicleLocation: payload.vehicleLocation,
            towAccessibility: payload.towAccessibility,
            currentVehiclePosition: payload.currentVehiclePosition,
        };
        vehicle.currentStep = Math.max(vehicle.currentStep, RegistrationStep.PICKUP);
        await vehicle.save();
        return vehicle;
    }
    async reviewVehicleAndConfirm(vehicleId) {
        const vehicle = await vehicleRepository.findByVehicleId(vehicleId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle Not Found");
        }
        vehicle.isRegistered = true;
        vehicle.currentStep = Math.max(vehicle.currentStep, RegistrationStep.SUBMITTED);
        await vehicle.save();
        return vehicle;
    }
    async vehicleUnderVerification(vehicleId) {
        const vehicle = await vehicleRepository.findByVehicleId(vehicleId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle Not Found");
        }
        vehicle.status = VehicleStatus.UNDER_VERIFICATION;
        await vehicle.save();
        return vehicle;
    }
    async handleStatusByAdmin(vehicleId, status, rejectionReason) {
        const vehicle = await vehicleRepository.findByVehicleId(vehicleId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found");
        }
        if (status !== VehicleStatus.VERIFIED &&
            status !== VehicleStatus.REJECTED) {
            throw new ApiError(400, "Status must be VERIFIED or REJECTED");
        }
        if (status === VehicleStatus.REJECTED &&
            (!rejectionReason || rejectionReason.trim() === "")) {
            throw new ApiError(400, "Rejection reason is required");
        }
        vehicle.status = status;
        if (status === VehicleStatus.REJECTED) {
            vehicle.rejectionReason = rejectionReason;
        }
        else {
            vehicle.rejectionReason = "";
        }
        await vehicle.save();
        return vehicle;
    }
    async findAllVehicleOfUser(userId) {
        const vehicles = await vehicleRepository.findVehicleByUserId(userId);
        if (!vehicles) {
            throw new ApiError(400, "No Vehicle Found");
        }
        return vehicles;
    }
    async applyVehicleForBidding(vehicleId) {
        const vehicle = await vehicleRepository.findByVehicleId(vehicleId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found");
        }
        if (vehicle?.status === VehicleStatus.REJECTED) {
            throw new ApiError(404, "This Vehicle is Rejected By Admin");
        }
        if (vehicle?.status !== VehicleStatus.VERIFIED) {
            throw new ApiError(404, "This Vehicle is Not Verifed By Admin");
        }
        vehicle.status = VehicleStatus.READY_FOR_BIDDING;
        await vehicle.save();
        return vehicle;
    }
    async getReadyForBiddingVehicles() {
        return Vehicle.find({
            status: VehicleStatus.READY_FOR_BIDDING,
        }).select("_id vehicleDetails pickup owner status");
    }
    async updateAuctionResult(vehicleId, status, auctionId, partnerId, winningBid) {
        const vehicle = await vehicleRepository.updateAuctionResult(vehicleId, status, auctionId, partnerId, winningBid);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found.");
        }
        return vehicle;
    }
    async approveVehicleForPickup(vehicleId) {
        const vehicle = await vehicleRepository.approveVehicleForPickup(vehicleId);
        if (!vehicle) {
            const existingVehicle = await vehicleRepository.findByVehicleId(vehicleId);
            if (!existingVehicle) {
                throw new Error("Vehicle not found.");
            }
            if (existingVehicle.status !== VehicleStatus.SOLD) {
                throw new Error(`Vehicle cannot be approved for pickup. Current status: ${existingVehicle.status}`);
            }
            throw new Error("Vehicle could not be updated for pickup.");
        }
        return vehicle;
    }
    async scheduledPickup(vehicleId, scheduledAt, pickup, confirmedBy) {
        if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
            throw new Error("Invalid vehicle ID");
        }
        if (!scheduledAt) {
            throw new Error("Pickup date and time are required");
        }
        const pickupDate = new Date(scheduledAt);
        if (isNaN(pickupDate.getTime())) {
            throw new Error("Invalid pickup date/time");
        }
        // Past date prevent karo
        if (pickupDate <= new Date()) {
            throw new Error("Pickup time must be in the future");
        }
        if (!pickup?.city) {
            throw new Error("Pickup city is required");
        }
        if (!pickup?.state) {
            throw new Error("Pickup state is required");
        }
        if (!pickup?.pincode) {
            throw new Error("Pickup pincode is required");
        }
        if (!pickup?.contactName) {
            throw new Error("Pickup contact name is required");
        }
        if (!pickup?.mobileNumber) {
            throw new Error("Pickup mobile number is required");
        }
        const vehicle = await vehicleRepository.findReadyForPickupVehicle(vehicleId);
        if (!vehicle) {
            throw new Error("Vehicle not found or vehicle is not ready for pickup");
        }
        const updatedVehicle = await vehicleRepository.scheduledVehiclePickup(vehicleId, pickup, pickupDate, confirmedBy);
        if (!updatedVehicle) {
            throw new Error("Unable to schedule pickup. Vehicle status may have changed.");
        }
        return updatedVehicle;
    }
    async schedulePickup(vehicleId, scheduledAt, pickupCharges, documentCharges) {
        if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
            throw new Error("Invalid vehicle ID");
        }
        if (!scheduledAt) {
            throw new Error("Pickup date and time is required");
        }
        const pickupDate = new Date(scheduledAt);
        if (Number.isNaN(pickupDate.getTime())) {
            throw new Error("Invalid pickup date and time");
        }
        if (pickupDate.getTime() <= Date.now()) {
            throw new Error("Pickup date and time must be in the future");
        }
        const vehicle = await vehicleRepository.scheduleVehiclePickup(vehicleId, pickupDate, pickupCharges, documentCharges);
        if (!vehicle) {
            throw new Error("Vehicle not found or vehicle is not READY_FOR_PICKUP");
        }
        return vehicle;
    }
    async assignDriver(vehicleId, driverName) {
        if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
            throw new Error("Invalid vehicle ID");
        }
        if (!driverName?.trim()) {
            throw new Error("Driver name is required");
        }
        const vehicle = await vehicleRepository.assignVehicleDriver(vehicleId, driverName.trim());
        if (!vehicle) {
            throw new Error("Vehicle not found or vehicle is not SCHEDULED");
        }
        return vehicle;
    }
    async getIncomingVehiclesForPartner(partnerId) {
        if (!partnerId) {
            throw new Error("Partner ID is required");
        }
        const vehicles = await vehicleRepository.getIncomingVehiclesByPartner(partnerId);
        return vehicles;
    }
    async getProcessingVehiclesByPartner(partnerId) {
        const vehicles = await vehicleRepository.getProcessingVehiclesByPartner(partnerId);
        return vehicles.map((vehicle) => {
            return {
                vehicleId: vehicle._id,
                vehicleDetails: {
                    carName: vehicle.vehicleDetails?.carName ??
                        vehicle.vehicleDetails?.model ??
                        null,
                    model: vehicle.vehicleDetails?.model ?? null,
                    variant: vehicle.vehicleDetails?.variant ?? null,
                    fuelType: vehicle.vehicleDetails?.fuelType ?? null,
                    transmission: vehicle.vehicleDetails?.transmission ?? null,
                    manufacturingYear: vehicle.vehicleDetails?.manufacturingYear ?? null,
                    registrationNumber: vehicle.vehicleDetails?.registrationNumber ?? null,
                    kmsDriven: vehicle.vehicleDetails?.kmsDriven ?? null,
                    ownership: vehicle.vehicleDetails?.ownership ?? null,
                },
                auction: {
                    auctionId: vehicle.auctionResult?.auctionId ?? null,
                    winningBid: vehicle.auctionResult?.winningBid ?? null,
                    wonAt: vehicle.auctionResult?.wonAt ?? null,
                },
                status: vehicle.status,
                // IMPORTANT:
                // Use the value stored in MongoDB.
                processingStage: vehicle.processingStage,
                pickup: vehicle.pickup ?? null,
                timeline: vehicle.timeline ?? [],
                updatedAt: vehicle.updatedAt,
            };
        });
    }
    async getProcessingStatsByPartner(partnerId) {
        return vehicleRepository.getProcessingStatsByPartner(partnerId);
    }
    async requestPickupOtp(vehicleId) {
        const vehicle = await vehicleRepository.getVehicleForPickupVerification(vehicleId);
        if (!vehicle) {
            throw new Error("Vehicle is not assigned to a driver");
        }
        if (vehicle.status !== VehicleStatus.DRIVER_ASSIGNED) {
            throw new Error("Vehicle is not ready for pickup verification");
        }
        if (!vehicle.pickup?.mobileNumber) {
            throw new Error("Customer mobile number not available");
        }
        const otp = generatePickupOtp();
        const otpHash = hashPickupOtp(otp);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await vehicleRepository.generatePickupOtp(vehicleId, otpHash, expiresAt);
        /*
         * TODO:
         * Send OTP through notification service
         *
         * await notificationService.sendPickupOtp({
         *   mobileNumber:
         *     vehicle.pickup.mobileNumber,
         *   otp,
         * });
         */
        console.log(`[PICKUP OTP] ${vehicleId}: ${otp}`);
        return {
            vehicleId,
            expiresAt,
            message: "Pickup verification OTP generated successfully",
        };
    }
    async verifyPickupOtp(vehicleId, otp, confirmedBy) {
        const vehicle = await vehicleRepository.getVehicleForPickupVerification(vehicleId);
        if (!vehicle) {
            throw new Error("Vehicle is not assigned for pickup");
        }
        const pickup = vehicle.pickup;
        if (!pickup) {
            throw new Error("Pickup information not found");
        }
        if (!pickup.pickupOtpHash || !pickup.pickupOtpExpiresAt) {
            throw new Error("Pickup OTP has not been generated");
        }
        // OTP expired
        if (new Date() > new Date(pickup.pickupOtpExpiresAt)) {
            throw new Error("Pickup OTP has expired");
        }
        // Too many attempts
        if ((pickup.pickupOtpAttempts ?? 0) >= 5) {
            throw new Error("Too many invalid OTP attempts");
        }
        const otpHash = hashPickupOtp(otp);
        if (otpHash !== pickup.pickupOtpHash) {
            await vehicleRepository.incrementPickupOtpAttempts(vehicleId);
            throw new Error("Invalid pickup OTP");
        }
        const updatedVehicle = await vehicleRepository.markVehiclePickedUp(vehicleId, confirmedBy);
        if (!updatedVehicle) {
            throw new Error("Vehicle pickup could not be completed");
        }
        return updatedVehicle;
    }
    async CurrentVehiclePickedUp(vehicleId) {
        const vehicle = await vehicleRepository.pickedupVehicleRepo(vehicleId);
        if (!vehicle) {
            throw new ApiError(400, "No Vehicle to pick up");
        }
        return vehicle;
    }
    async getAllVehiclesWithStatus() {
        const vehicles = await vehicleRepository.getAllVehiclesWithStatus();
        return vehicles.map((vehicle) => ({
            vehicleId: vehicle._id.toString(),
            status: vehicle.status,
            ownerId: vehicle.owner?.toString() ?? null,
            vehicleDetails: vehicle.vehicleDetails,
            auctionResult: vehicle.auctionResult,
            pickup: vehicle.pickup,
            timeline: vehicle.timeline,
            currentStep: vehicle.currentStep,
            createdAt: vehicle.createdAt,
            updatedAt: vehicle.updatedAt,
        }));
    }
    async getVehicleStatusById(vehicleId) {
        const vehicle = await vehicleRepository.getVehicleStatusById(vehicleId);
        if (!vehicle) {
            throw new Error("Vehicle not found");
        }
        return {
            vehicleId: vehicle._id.toString(),
            status: vehicle.status,
            ownerId: vehicle.owner?.toString() ?? null,
            vehicleDetails: vehicle.vehicleDetails,
            auctionResult: vehicle.auctionResult,
            pickup: vehicle.pickup,
            timeline: vehicle.timeline,
            currentStep: vehicle.currentStep,
            createdAt: vehicle.createdAt,
            updatedAt: vehicle.updatedAt,
        };
    }
    async markVehicleArrived(vehicleId) {
        const vehicle = await vehicleRepository.markVehicleArrived(vehicleId);
        if (!vehicle) {
            throw new Error("Vehicle not found or vehicle is not in PICKED_UP status");
        }
        return vehicle;
    }
    async getPartnerVehicleDocuments(vehicleId, partnerId) {
        const vehicle = await vehicleRepository.getPartnerVehicleDocuments(vehicleId, partnerId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found or vehicle is not available for documents");
        }
        return {
            vehicleId: vehicle._id,
            vehicleDetails: {
                carName: vehicle.vehicleDetails?.carName ?? null,
                manufacturer: vehicle.vehicleDetails?.carName ?? null,
                model: vehicle.vehicleDetails?.model ?? null,
                variant: vehicle.vehicleDetails?.variant ?? null,
                registrationNumber: vehicle.vehicleDetails?.registrationNumber ?? null,
                fuelType: vehicle.vehicleDetails?.fuelType ?? null,
                transmission: vehicle.vehicleDetails?.transmission ?? null,
                manufacturingYear: vehicle.vehicleDetails?.manufacturingYear ?? null,
            },
            pickup: {
                city: vehicle.pickup?.city ?? null,
                state: vehicle.pickup?.state ?? null,
                formattedAddress: vehicle.pickup?.formattedAddress ?? null,
            },
            auction: {
                auctionId: vehicle.auctionResult?.auctionId ?? null,
                winningBid: vehicle.auctionResult?.winningBid ?? null,
                wonAt: vehicle.auctionResult?.wonAt ?? null,
            },
            status: vehicle.status,
            processingStage: vehicle.processingStage,
            partnerDocumentStatus: vehicle.partnerDocumentStatus ??
                PartnerDocumentSubmissionStatus.NOT_STARTED,
            partnerDocuments: vehicle.partnerDocuments ?? [],
            updatedAt: vehicle.updatedAt,
        };
    }
    async getPartnerDocumentVehicles(partnerId) {
        const vehicles = await vehicleRepository.getArrivedVehiclesForPartner(partnerId);
        return vehicles.map((vehicle) => ({
            vehicleId: vehicle._id,
            vehicleDetails: {
                carName: vehicle.vehicleDetails?.carName ?? null,
                model: vehicle.vehicleDetails?.model ?? null,
                variant: vehicle.vehicleDetails?.variant ?? null,
                fuelType: vehicle.vehicleDetails?.fuelType ?? null,
                registrationNumber: vehicle.vehicleDetails?.registrationNumber ?? null,
            },
            auction: {
                auctionId: vehicle.auctionResult?.auctionId ?? null,
                winningBid: vehicle.auctionResult?.winningBid ?? null,
                wonAt: vehicle.auctionResult?.wonAt ?? null,
            },
            status: vehicle.status,
            processingStage: vehicle.processingStage,
            documents: {
                submissionStatus: vehicle.partnerDocumentStatus ?? "NOT_STARTED",
                partnerDocuments: vehicle.partnerDocuments ?? [],
            },
            updatedAt: vehicle.updatedAt,
        }));
    }
    async uploadPartnerDocument(vehicleId, partnerId, documentType, file) {
        const vehicle = await vehicleRepository.getPartnerVehicleDocuments(vehicleId, partnerId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found or vehicle is not ready for documents");
        }
        const requiredDocuments = [
            PartnerDocumentType.CERTIFICATE_OF_DEPOSIT,
            PartnerDocumentType.CERTIFICATE_OF_SCRAPPING,
            PartnerDocumentType.CHASSIS_PROOF,
        ];
        const isRequired = requiredDocuments.includes(documentType);
        const uploadResult = await supabaseService.uploadToSupabase(file, `vehicles/${vehicleId}/partner-documents`, documentType.toLowerCase());
        const document = {
            type: documentType,
            required: isRequired,
            path: uploadResult.path,
            fullPath: uploadResult.fullPath,
            originalName: file.originalname,
            mimeType: file.mimetype,
            uploadedAt: new Date(),
            status: PartnerDocumentStatus.PENDING,
            rejectionReason: null,
            reviewedAt: null,
            reviewedBy: null,
        };
        const updatedVehicle = await vehicleRepository.upsertPartnerDocument(vehicleId, partnerId, document);
        if (!updatedVehicle) {
            throw new ApiError(404, "Vehicle not found");
        }
        return document;
    }
}
export default new VehicleService();
