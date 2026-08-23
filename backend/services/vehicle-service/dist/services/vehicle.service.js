import vehicleRepository, { PROCESSING_STAGE_ORDER, } from "../repositories/vehicle.repository.js";
import Vehicle, { PartnerDocumentStatus, PartnerDocumentSubmissionStatus, PartnerDocumentType, ProcessingStage, RegistrationStep, VehicleStatus, } from "../models/vehicle.model.js";
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
    async getBookingJourney(vehicle) {
        const timeline = vehicle.timeline ?? [];
        const hasTimeline = (titles) => {
            return timeline.some((item) => item.completed && titles.includes(item.title?.toUpperCase()));
        };
        const getTimelineDate = (titles) => {
            const item = timeline.find((item) => item.completed && titles.includes(item.title?.toUpperCase()));
            return item?.completedAt ?? null;
        };
        const journey = [
            {
                step: 1,
                title: "Sold",
                completed: vehicle.status !== VehicleStatus.UNSOLD &&
                    vehicle.auctionResult?.partnerId != null,
                completedAt: vehicle.auctionResult?.wonAt ?? null,
            },
            {
                step: 2,
                title: "Ready For Pickup",
                completed: hasTimeline(["READY FOR PICKUP", "READY_FOR_PICKUP"]) ||
                    [
                        VehicleStatus.READY_FOR_PICKUP,
                        VehicleStatus.SCHEDULED,
                        VehicleStatus.DRIVER_ASSIGNED,
                        VehicleStatus.PICKED_UP,
                        VehicleStatus.IN_TRANSIT,
                        VehicleStatus.ARRIVED,
                    ].includes(vehicle.status),
                completedAt: getTimelineDate(["READY FOR PICKUP", "READY_FOR_PICKUP"]),
            },
            {
                step: 3,
                title: "Pickup Scheduled",
                completed: hasTimeline(["PICKUP SCHEDULED", "SCHEDULED"]) ||
                    [
                        VehicleStatus.SCHEDULED,
                        VehicleStatus.DRIVER_ASSIGNED,
                        VehicleStatus.PICKED_UP,
                        VehicleStatus.IN_TRANSIT,
                        VehicleStatus.ARRIVED,
                    ].includes(vehicle.status),
                completedAt: vehicle.pickup?.confirmedAt ??
                    vehicle.pickup?.scheduledAt ??
                    getTimelineDate(["PICKUP SCHEDULED", "SCHEDULED"]),
            },
            {
                step: 4,
                title: "Driver Assigned",
                completed: hasTimeline(["DRIVER ASSIGNED", "DRIVER_ASSIGNED"]) ||
                    [
                        VehicleStatus.DRIVER_ASSIGNED,
                        VehicleStatus.PICKED_UP,
                        VehicleStatus.IN_TRANSIT,
                        VehicleStatus.ARRIVED,
                    ].includes(vehicle.status),
                completedAt: getTimelineDate(["DRIVER ASSIGNED", "DRIVER_ASSIGNED"]),
            },
            {
                step: 5,
                title: "Picked Up",
                completed: hasTimeline(["PICKED UP", "VEHICLE PICKED UP", "CAR PICKED UP"]) ||
                    [
                        VehicleStatus.PICKED_UP,
                        VehicleStatus.IN_TRANSIT,
                        VehicleStatus.ARRIVED,
                    ].includes(vehicle.status),
                completedAt: getTimelineDate([
                    "PICKED UP",
                    "VEHICLE PICKED UP",
                    "CAR PICKED UP",
                ]),
            },
            {
                step: 6,
                title: "In Transit",
                completed: hasTimeline(["IN TRANSIT", "VEHICLE IN TRANSIT"]) ||
                    [VehicleStatus.IN_TRANSIT, VehicleStatus.ARRIVED].includes(vehicle.status),
                completedAt: getTimelineDate(["IN TRANSIT", "VEHICLE IN TRANSIT"]),
            },
            {
                step: 7,
                title: "Arrived",
                completed: hasTimeline(["ARRIVED", "VEHICLE ARRIVED", "VEHICLE RECEIVED"]) ||
                    vehicle.status === VehicleStatus.ARRIVED,
                completedAt: getTimelineDate([
                    "ARRIVED",
                    "VEHICLE ARRIVED",
                    "VEHICLE RECEIVED",
                ]),
            },
            {
                step: 8,
                title: "Inspection Complete",
                completed: hasTimeline(["INSPECTION", "INSPECTION COMPLETED"]) ||
                    vehicle.processingStage === ProcessingStage.INSPECTION_COMPLETED,
                completedAt: getTimelineDate(["INSPECTION", "INSPECTION COMPLETED"]),
            },
        ];
        return journey;
    }
    async getCustomerBookings(ownerId) {
        const vehicles = await vehicleRepository.getCustomerBookings(ownerId);
        return vehicles.map((vehicle) => {
            const vehicleDetails = vehicle.vehicleDetails ?? {};
            const pickup = vehicle.pickup ?? {};
            const auction = vehicle.auctionResult ?? {};
            const journey = this.getBookingJourney(vehicle);
            return {
                bookingId: auction.auctionId ?? vehicle._id.toString(),
                vehicleId: vehicle._id.toString(),
                status: vehicle.status,
                vehicle: {
                    name: vehicleDetails.carName ??
                        vehicleDetails.manufacturer ??
                        vehicleDetails.model ??
                        "Vehicle",
                    registrationNumber: vehicleDetails.registrationNumber ?? null,
                    fuelType: vehicleDetails.fuelType ?? null,
                    model: vehicleDetails.model ?? null,
                    variant: vehicleDetails.variant ?? null,
                },
                bookingDate: auction.wonAt ?? vehicle.createdAt ?? null,
                offerAmount: auction.winningBid ?? null,
                pickup: {
                    status: vehicle.status,
                    scheduledAt: pickup.scheduledAt ?? null,
                    address: (pickup.formattedAddress ??
                        [pickup.area, pickup.city, pickup.state, pickup.pincode]
                            .filter(Boolean)
                            .join(", ")) ||
                        null,
                    city: pickup.city ?? null,
                    state: pickup.state ?? null,
                    pincode: pickup.pincode ?? null,
                    contactName: pickup.contactName ?? null,
                    assignedDriver: pickup.assignedDriver ?? null,
                },
                journey,
            };
        });
    }
    async getCustomerBookingById(ownerId, vehicleId) {
        const vehicle = await vehicleRepository.getCustomerBookingById(ownerId, vehicleId);
        if (!vehicle) {
            throw new ApiError(404, "Booking not found");
        }
        const vehicleDetails = vehicle.vehicleDetails ?? {};
        const pickup = vehicle.pickup ?? {};
        const auction = vehicle.auctionResult;
        if (!auction) {
            throw new ApiError(400, "No Auction Data for this vehicle ");
        }
        return {
            bookingId: auction.auctionId ?? vehicle._id.toString(),
            vehicleId: vehicle._id.toString(),
            status: vehicle.status,
            vehicle: {
                name: vehicleDetails.carName ??
                    vehicleDetails.carName ??
                    vehicleDetails.model ??
                    "Vehicle",
                registrationNumber: vehicleDetails.registrationNumber ?? null,
                fuelType: vehicleDetails.fuelType ?? null,
                model: vehicleDetails.model ?? null,
                variant: vehicleDetails.variant ?? null,
            },
            bookingDate: auction.wonAt ?? vehicle.createdAt ?? null,
            offerAmount: auction.winningBid ?? null,
            pickup: {
                status: vehicle.status,
                scheduledAt: pickup.scheduledAt ?? null,
                address: (pickup.formattedAddress ??
                    [pickup.area, pickup.city, pickup.state, pickup.pincode]
                        .filter(Boolean)
                        .join(", ")) ||
                    null,
                city: pickup.city ?? null,
                state: pickup.state ?? null,
                pincode: pickup.pincode ?? null,
                contactName: pickup.contactName ?? null,
                assignedDriver: pickup.assignedDriver ?? null,
            },
            journey: this.getBookingJourney(vehicle),
        };
    }
    async getPartnerDashboard(partnerId) {
        const [vehicles, ordersWonToday, monthlyRevenue, pendingDocuments, processingStats,] = await Promise.all([
            vehicleRepository.getPartnerDashboardVehicles(partnerId),
            vehicleRepository.getPartnerOrdersWonToday(partnerId),
            vehicleRepository.getPartnerMonthlyRevenue(partnerId),
            vehicleRepository.getPartnerPendingDocuments(partnerId),
            vehicleRepository.getPartnerProcessingStats(partnerId),
        ]);
        const getProcessingCount = (stage) => {
            return (processingStats.find((item) => item._id === stage)?.count ?? 0);
        };
        const vehiclesAwaitingArrival = vehicles.filter((vehicle) => [
            VehicleStatus.READY_FOR_PICKUP,
            VehicleStatus.SCHEDULED,
            VehicleStatus.DRIVER_ASSIGNED,
            VehicleStatus.PICKED_UP,
            VehicleStatus.IN_TRANSIT,
        ].includes(vehicle.status)).length;
        const vehiclesInProcessing = vehicles.filter((vehicle) => [
            ProcessingStage.VEHICLE_RECEIVED,
            ProcessingStage.INSPECTION_COMPLETED,
            ProcessingStage.DISMANTLING,
            ProcessingStage.RECYCLING,
            ProcessingStage.CERTIFICATE_PENDING,
        ].includes(vehicle.processingStage)).length;
        const incomingVehicles = vehicles
            .filter((vehicle) => [
            VehicleStatus.READY_FOR_PICKUP,
            VehicleStatus.SCHEDULED,
            VehicleStatus.DRIVER_ASSIGNED,
            VehicleStatus.PICKED_UP,
            VehicleStatus.IN_TRANSIT,
        ].includes(vehicle.status))
            .slice(0, 10)
            .map((vehicle) => ({
            vehicleId: vehicle._id.toString(),
            vehicleName: vehicle.vehicleDetails?.carName ??
                vehicle.vehicleDetails?.model ??
                "Vehicle",
            registrationNumber: vehicle.vehicleDetails?.registrationNumber ?? null,
            status: vehicle.status,
            driver: vehicle.pickup?.assignedDriver ?? null,
            scheduledAt: vehicle.pickup?.scheduledAt ?? null,
            pickupAddress: vehicle.pickup?.formattedAddress ?? null,
        }));
        const processingOverview = {
            waitingForArrival: getProcessingCount(ProcessingStage.WAITING_FOR_ARRIVAL),
            vehicleReceived: getProcessingCount(ProcessingStage.VEHICLE_RECEIVED),
            inspectionCompleted: getProcessingCount(ProcessingStage.INSPECTION_COMPLETED),
            dismantling: getProcessingCount(ProcessingStage.DISMANTLING),
            recycling: getProcessingCount(ProcessingStage.RECYCLING),
            certificatePending: getProcessingCount(ProcessingStage.CERTIFICATE_PENDING),
            completed: getProcessingCount(ProcessingStage.COMPLETED),
        };
        return {
            summary: {
                ordersWonToday: ordersWonToday.count,
                ordersWonTodayValue: ordersWonToday.totalValue,
                vehiclesAwaitingArrival,
                vehiclesInProcessing,
                pendingDocuments: pendingDocuments.length,
                monthlyRevenue,
            },
            liveBiddingOpportunities: [],
            incomingVehicles,
            processingOverview,
            documentsRequired: pendingDocuments.slice(0, 10),
            earnings: {
                totalRevenue: monthlyRevenue,
                netSettlement: null,
                pendingSettlements: null,
                completedSettlements: null,
            },
        };
    }
    async updatePartnerProcessingStage(vehicleId, partnerId, nextStage) {
        // ==========================================
        // VALIDATE VEHICLE ID
        // ==========================================
        if (!vehicleId) {
            throw new ApiError(400, "Vehicle ID is required");
        }
        // ==========================================
        // VALIDATE NEXT STAGE
        // ==========================================
        const nextStageIndex = PROCESSING_STAGE_ORDER.indexOf(nextStage);
        if (nextStageIndex === -1) {
            throw new ApiError(400, "Invalid processing stage");
        }
        // ==========================================
        // FIND VEHICLE
        // ==========================================
        const vehicle = await vehicleRepository.findByVehicleId(vehicleId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found");
        }
        // ==========================================
        // VERIFY PARTNER
        // ==========================================
        const vehiclePartnerId = vehicle.auctionResult?.partnerId;
        if (!vehiclePartnerId || vehiclePartnerId !== partnerId) {
            throw new ApiError(403, "You are not authorized to manage this vehicle");
        }
        // ==========================================
        // VEHICLE MUST HAVE ARRIVED
        // ==========================================
        if (vehicle.status !== VehicleStatus.ARRIVED) {
            throw new ApiError(400, "Vehicle must be arrived before processing can start");
        }
        // ==========================================
        // CURRENT PROCESSING STAGE
        // ==========================================
        const currentStage = vehicle.processingStage;
        const currentStageIndex = PROCESSING_STAGE_ORDER.indexOf(currentStage);
        if (currentStageIndex === -1) {
            throw new ApiError(400, "Current processing stage is invalid");
        }
        // ==========================================
        // ALREADY COMPLETED
        // ==========================================
        if (currentStage === ProcessingStage.COMPLETED) {
            throw new ApiError(400, "Vehicle processing is already completed");
        }
        // ==========================================
        // ONLY ALLOW NEXT STAGE
        // ==========================================
        if (nextStageIndex !== currentStageIndex + 1) {
            throw new ApiError(400, `Invalid stage transition. Vehicle is currently at ${currentStage}. It can only move to ${PROCESSING_STAGE_ORDER[currentStageIndex + 1]}.`);
        }
        // ==========================================
        // UPDATE
        // ==========================================
        const updatedVehicle = await vehicleRepository.updateProcessingStage(vehicleId, partnerId, currentStage, nextStage);
        if (!updatedVehicle) {
            throw new ApiError(409, "Vehicle stage was changed by another request. Please refresh and try again.");
        }
        return updatedVehicle;
    }
    async getVehiclesWithPartnerDocumentsForAdmin() {
        const vehicles = await vehicleRepository.getVehiclesWithPartnerDocumentsForAdmin();
        return vehicles;
    }
    async getPartnerDocumentsForAdmin(vehicleId) {
        const vehicle = await vehicleRepository.getPartnerDocumentsForAdmin(vehicleId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found");
        }
        return vehicle;
    }
    async reviewPartnerDocument(vehicleId, documentId, status, adminId, rejectionReason) {
        if (status !== PartnerDocumentStatus.APPROVED &&
            status !== PartnerDocumentStatus.REJECTED) {
            throw new ApiError(400, "Invalid document review status");
        }
        if (status === PartnerDocumentStatus.REJECTED && !rejectionReason?.trim()) {
            throw new ApiError(400, "Rejection reason is required");
        }
        const vehicle = await vehicleRepository.reviewPartnerDocument(vehicleId, documentId, status, adminId, rejectionReason ?? null);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle or document not found");
        }
        return vehicle;
    }
    async approveAllPartnerDocuments(vehicleId, adminId) {
        const vehicle = await vehicleRepository.getPartnerDocumentsForAdmin(vehicleId);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found");
        }
        if (vehicle.partnerDocumentStatus !==
            PartnerDocumentSubmissionStatus.SUBMITTED) {
            throw new ApiError(400, "Documents have not been submitted for approval");
        }
        const documents = vehicle.partnerDocuments ?? [];
        if (documents.length === 0) {
            throw new ApiError(400, "No partner documents found");
        }
        // Required documents
        const requiredDocuments = documents.filter((document) => document.required === true);
        if (requiredDocuments.length === 0) {
            throw new ApiError(400, "No required documents found");
        }
        // Check that every required document exists
        const hasPendingRequiredDocument = requiredDocuments.some((document) => document.status !== PartnerDocumentStatus.PENDING);
        if (hasPendingRequiredDocument) {
            throw new ApiError(400, "Some required documents have already been reviewed");
        }
        const updatedVehicle = await vehicleRepository.approveAllPartnerDocuments(vehicleId, adminId);
        if (!updatedVehicle) {
            throw new ApiError(409, "Documents could not be approved");
        }
        return updatedVehicle;
    }
}
export default new VehicleService();
