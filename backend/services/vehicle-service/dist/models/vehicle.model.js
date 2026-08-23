import mongoose, { Schema } from "mongoose";
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROOF_UPLOADED"] = "PROOF_UPLOADED";
    PaymentStatus["VERIFIED"] = "VERIFIED";
    PaymentStatus["REJECTED"] = "REJECTED";
})(PaymentStatus || (PaymentStatus = {}));
export var PartnerDocumentSubmissionStatus;
(function (PartnerDocumentSubmissionStatus) {
    PartnerDocumentSubmissionStatus["NOT_STARTED"] = "NOT_STARTED";
    PartnerDocumentSubmissionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    PartnerDocumentSubmissionStatus["SUBMITTED"] = "SUBMITTED";
    PartnerDocumentSubmissionStatus["APPROVED"] = "APPROVED";
    PartnerDocumentSubmissionStatus["REJECTED"] = "REJECTED";
})(PartnerDocumentSubmissionStatus || (PartnerDocumentSubmissionStatus = {}));
export var ProcessingStage;
(function (ProcessingStage) {
    ProcessingStage["WAITING_FOR_ARRIVAL"] = "WAITING_FOR_ARRIVAL";
    ProcessingStage["VEHICLE_RECEIVED"] = "VEHICLE_RECEIVED";
    ProcessingStage["INSPECTION_COMPLETED"] = "INSPECTION_COMPLETED";
    ProcessingStage["DISMANTLING"] = "DISMANTLING";
    ProcessingStage["RECYCLING"] = "RECYCLING";
    ProcessingStage["CERTIFICATE_PENDING"] = "CERTIFICATE_PENDING";
    ProcessingStage["COMPLETED"] = "COMPLETED";
})(ProcessingStage || (ProcessingStage = {}));
export var PartnerDocumentType;
(function (PartnerDocumentType) {
    PartnerDocumentType["CERTIFICATE_OF_DEPOSIT"] = "CERTIFICATE_OF_DEPOSIT";
    PartnerDocumentType["CERTIFICATE_OF_SCRAPPING"] = "CERTIFICATE_OF_SCRAPPING";
    PartnerDocumentType["CHASSIS_PROOF"] = "CHASSIS_PROOF";
    PartnerDocumentType["OTHER"] = "OTHER";
})(PartnerDocumentType || (PartnerDocumentType = {}));
export var PartnerDocumentStatus;
(function (PartnerDocumentStatus) {
    PartnerDocumentStatus["PENDING"] = "PENDING";
    PartnerDocumentStatus["APPROVED"] = "APPROVED";
    PartnerDocumentStatus["REJECTED"] = "REJECTED";
})(PartnerDocumentStatus || (PartnerDocumentStatus = {}));
export var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["DRAFT"] = "DRAFT";
    VehicleStatus["SUBMITTED"] = "SUBMITTED";
    VehicleStatus["UNDER_VERIFICATION"] = "UNDER_VERIFICATION";
    VehicleStatus["VERIFIED"] = "VERIFIED";
    VehicleStatus["REJECTED"] = "REJECTED";
    VehicleStatus["READY_FOR_BIDDING"] = "READY_FOR_BIDDING";
    VehicleStatus["SOLD"] = "SOLD";
    VehicleStatus["UNSOLD"] = "UNSOLD";
    VehicleStatus["READY_FOR_PICKUP"] = "READY_FOR_PICKUP";
    VehicleStatus["SCHEDULED"] = "SCHEDULED";
    VehicleStatus["DRIVER_ASSIGNED"] = "DRIVER_ASSIGNED";
    VehicleStatus["PICKED_UP"] = "PICKED_UP";
    VehicleStatus["IN_TRANSIT"] = "IN_TRANSIT";
    VehicleStatus["ARRIVED"] = "ARRIVED";
    VehicleStatus["CANCELLED"] = "CANCELLED";
})(VehicleStatus || (VehicleStatus = {}));
export var VehicleDocumentType;
(function (VehicleDocumentType) {
    VehicleDocumentType["RC_BOOK"] = "RC_BOOK";
    VehicleDocumentType["INSURANCE"] = "INSURANCE";
    VehicleDocumentType["PUC"] = "PUC";
    VehicleDocumentType["LOAN_CLOSURE"] = "LOAN_CLOSURE";
    VehicleDocumentType["OTHER"] = "OTHER";
})(VehicleDocumentType || (VehicleDocumentType = {}));
export var RegistrationStep;
(function (RegistrationStep) {
    RegistrationStep[RegistrationStep["VEHICLE_DETAILS"] = 1] = "VEHICLE_DETAILS";
    RegistrationStep[RegistrationStep["VEHICLE_CONDITION"] = 2] = "VEHICLE_CONDITION";
    RegistrationStep[RegistrationStep["MAJOR_COMPONENTS"] = 3] = "MAJOR_COMPONENTS";
    RegistrationStep[RegistrationStep["DOCUMENTS"] = 4] = "DOCUMENTS";
    RegistrationStep[RegistrationStep["PHOTOS"] = 5] = "PHOTOS";
    RegistrationStep[RegistrationStep["PICKUP"] = 6] = "PICKUP";
    RegistrationStep[RegistrationStep["REVIEW"] = 7] = "REVIEW";
    RegistrationStep[RegistrationStep["SUBMITTED"] = 8] = "SUBMITTED";
})(RegistrationStep || (RegistrationStep = {}));
export var TransmissionType;
(function (TransmissionType) {
    TransmissionType["MANUAL"] = "MANUAL";
    TransmissionType["AUTOMATIC"] = "AUTOMATIC";
    TransmissionType["CVT"] = "CVT";
    TransmissionType["DCT"] = "DCT";
    TransmissionType["AMT"] = "AMT";
})(TransmissionType || (TransmissionType = {}));
export var EngineCondition;
(function (EngineCondition) {
    EngineCondition["EXCELLENT"] = "EXCELLENT";
    EngineCondition["GOOD"] = "GOOD";
    EngineCondition["FAIR"] = "FAIR";
    EngineCondition["POOR"] = "POOR";
    EngineCondition["NOT_WORKING"] = "NOT_WORKING";
})(EngineCondition || (EngineCondition = {}));
export var ComponentCondition;
(function (ComponentCondition) {
    ComponentCondition["GOOD"] = "GOOD";
    ComponentCondition["NOT_WORKING"] = "NOT_WORKING";
    ComponentCondition["MISSING"] = "MISSING";
})(ComponentCondition || (ComponentCondition = {}));
export var accidentType;
(function (accidentType) {
    accidentType["NO_ACCIDENT"] = "NO_ACCIDENT";
    accidentType["ACCIDENTAL_DAMAGE"] = "ACCIDENTAL_DAMAGE";
    accidentType["BURNT"] = "BURNT";
    accidentType["FLOODED"] = "FLOODED";
    accidentType["OTHER"] = "OTHER";
})(accidentType || (accidentType = {}));
export var structuralDamage;
(function (structuralDamage) {
    structuralDamage["NO_DAMAGE"] = "NO_DAMAGE";
    structuralDamage["MINOR_DAMAGE"] = "MINOR_DAMAGE";
    structuralDamage["MAJOR_DAMAGE"] = "MAJOR_DAMAGE";
})(structuralDamage || (structuralDamage = {}));
const vehicleDetailsSchema = new Schema({
    registrationNumber: { type: String, trim: true },
    manufacturer: String,
    model: String,
    variant: String,
    fuelType: String,
    transmission: {
        type: String,
        enum: Object.values(TransmissionType),
    },
    manufacturingYear: Number,
    ownership: Number,
    kmsDriven: Number,
}, { _id: false });
const vehicleConditionSchema = new Schema({
    accidentType: {
        type: String,
        enum: Object.values(accidentType),
    },
    structure: {
        type: String,
        enum: Object.values(structuralDamage),
    },
    airbagsDeployed: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        default: "",
    },
}, { _id: false });
const majorComponentsSchema = new Schema({
    engine: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    radiator: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    fuelSystem: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    gearbox: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    suspension: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    steering: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    electrical: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    exhaust: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    tyres: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    ac: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    bodyPanels: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    glass: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    lights: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
    interior: {
        type: String,
        enum: Object.values(ComponentCondition),
        default: null,
    },
}, { _id: false });
const vehicleDocumentSchema = new Schema({
    path: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    _id: false,
});
const documentsSchema = new Schema({
    rcbook: {
        type: vehicleDocumentSchema,
        default: null,
    },
    insurance: {
        type: vehicleDocumentSchema,
        default: null,
    },
    puc: {
        type: vehicleDocumentSchema,
        default: null,
    },
    loanClosure: {
        type: vehicleDocumentSchema,
        default: null,
    },
    other: {
        type: vehicleDocumentSchema,
        default: null,
    },
}, {
    _id: false,
});
// 1. Photo Document ke liye Sub-Schema banayein
const uploadedPhotoSchema = new Schema({
    path: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });
// 2. Updated photosSchema
const photosSchema = new Schema({
    front: { type: uploadedPhotoSchema, default: null },
    rear: { type: uploadedPhotoSchema, default: null },
    left: { type: uploadedPhotoSchema, default: null },
    right: { type: uploadedPhotoSchema, default: null },
    dashboard: { type: uploadedPhotoSchema, default: null },
    interior: { type: uploadedPhotoSchema, default: null },
    engine: { type: uploadedPhotoSchema, default: null },
    odometer: { type: uploadedPhotoSchema, default: null },
    chassisNumber: { type: uploadedPhotoSchema, default: null },
}, { _id: false });
const partnerDocumentSchema = new Schema({
    type: {
        type: String,
        enum: Object.values(PartnerDocumentType),
        required: true,
    },
    required: {
        type: Boolean,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    fullPath: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: Object.values(PartnerDocumentStatus),
        default: PartnerDocumentStatus.PENDING,
    },
    rejectionReason: {
        type: String,
        default: null,
    },
    reviewedAt: {
        type: Date,
        default: null,
    },
    reviewedBy: {
        type: String,
        default: null,
    },
}, {
    _id: true,
});
const pickupSchema = new Schema({
    houseNumber: String,
    street: String,
    area: String,
    landmark: {
        type: String,
        default: "",
    },
    city: String,
    state: String,
    pincode: String,
    latitude: Number,
    longitude: Number,
    formattedAddress: String,
    contactName: String,
    mobileNumber: String,
    alternateNumber: {
        type: String,
        default: "",
    },
    vehicleLocation: {
        type: String,
        enum: ["HOME", "OFFICE", "PARKING", "WORKSHOP", "OTHER"],
    },
    towAccessibility: {
        type: String,
        enum: ["YES", "NO", "NOT_SURE"],
    },
    currentVehiclePosition: {
        type: String,
        enum: [
            "ON_ROAD",
            "BASEMENT_PARKING",
            "SOCIETY_PARKING",
            "ROADSIDE",
            "GARAGE_WORKSHOP",
        ],
    },
    scheduledAt: {
        type: Date,
        default: null,
    },
    confirmedAt: {
        type: Date,
        default: null,
    },
    confirmedBy: {
        type: String,
        default: null,
    },
    assignedDriver: {
        type: String,
        default: null,
        trim: true,
    },
    pickupOtpHash: {
        type: String,
        default: null,
    },
    pickupOtpExpiresAt: {
        type: Date,
        default: null,
    },
    pickupOtpAttempts: {
        type: Number,
        default: 0,
    },
    pickupOtpVerifiedAt: {
        type: Date,
        default: null,
    },
}, {
    _id: false,
});
const timelineSchema = new Schema({
    title: String,
    completed: Boolean,
    completedAt: Date,
}, { _id: false });
const paymentProofSchema = new Schema({
    type: {
        type: String,
        enum: ["OWNER_PAYMENT_PROOF", "PARTNER_PAYMENT_PROOF"],
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    storagePath: {
        type: String,
        default: null,
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        default: null,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verifiedAt: {
        type: Date,
        default: null,
    },
    rejectionReason: {
        type: String,
        default: null,
    },
}, {
    _id: true,
});
const vehicleSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    pickupCharges: {
        type: Number,
        default: 0,
    },
    documentCharges: {
        type: Number,
        default: 0,
    },
    isRegistered: {
        type: Boolean,
    },
    status: {
        type: String,
        enum: Object.values(VehicleStatus),
        default: VehicleStatus.DRAFT,
    },
    processingStage: {
        type: String,
        enum: Object.values(ProcessingStage),
        default: ProcessingStage.WAITING_FOR_ARRIVAL,
    },
    currentStep: {
        type: Number,
        default: RegistrationStep.VEHICLE_DETAILS,
    },
    vehicleDetails: vehicleDetailsSchema,
    vehicleCondition: vehicleConditionSchema,
    majorComponents: majorComponentsSchema,
    documents: documentsSchema,
    photos: photosSchema,
    pickup: pickupSchema,
    partnerDocumentStatus: {
        type: String,
        enum: Object.values(PartnerDocumentSubmissionStatus),
        default: PartnerDocumentSubmissionStatus.NOT_STARTED,
    },
    partnerDocuments: {
        type: [partnerDocumentSchema],
        default: [],
    },
    paymentStatus: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    },
    paymentProofs: {
        type: [paymentProofSchema],
        default: [],
    },
    timeline: [timelineSchema],
    rejectionReason: {
        type: String,
        default: null,
    },
    auctionResult: {
        auctionId: {
            type: String,
            default: null,
        },
        partnerId: {
            type: String,
            default: null,
            index: true,
        },
        winningBid: {
            type: Number,
            default: null,
        },
        wonAt: {
            type: Date,
            default: null,
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
vehicleSchema.index({ owner: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ "vehicleDetails.registrationNumber": 1 });
const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
