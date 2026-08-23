export interface IVehicleDocument {
    path: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedAt: Date;
}

export interface IPartnerDocument {
    _id?: string;
    type: VehicleDocumentType;
    required: boolean;
    path: string;
    fullPath: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedAt: Date;
    status: PartnerDocumentStatus;
    rejectionReason?: string | null;
    reviewedAt?: Date | null;
    reviewedBy?: string | null;
}

export interface IUploadedPhoto {
    path: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedAt: Date;
}

export enum PartnerDocumentSubmissionStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum ProcessingStage {
    WAITING_FOR_ARRIVAL = "WAITING_FOR_ARRIVAL",
    VEHICLE_RECEIVED = "VEHICLE_RECEIVED",
    INSPECTION_COMPLETED = "INSPECTION_COMPLETED",
    DISMANTLING = "DISMANTLING",
    RECYCLING = "RECYCLING",
    CERTIFICATE_PENDING = "CERTIFICATE_PENDING",
    COMPLETED = "COMPLETED",
}

export enum PartnerDocumentType {
    CERTIFICATE_OF_DEPOSIT = "CERTIFICATE_OF_DEPOSIT",
    CERTIFICATE_OF_SCRAPPING = "CERTIFICATE_OF_SCRAPPING",
    CHASSIS_PROOF = "CHASSIS_PROOF",
    OTHER = "OTHER",
}

export enum PartnerDocumentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum VehicleStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_VERIFICATION = "UNDER_VERIFICATION",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED",
    READY_FOR_BIDDING = "READY_FOR_BIDDING",
    SOLD = "SOLD",
    UNSOLD = "UNSOLD",
    READY_FOR_PICKUP = "READY_FOR_PICKUP",
    SCHEDULED = "SCHEDULED",
    DRIVER_ASSIGNED = "DRIVER_ASSIGNED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    ARRIVED = "ARRIVED",
    CANCELLED = "CANCELLED",
}

export enum VehicleDocumentType {
    RC_BOOK = "RC_BOOK",
    INSURANCE = "INSURANCE",
    PUC = "PUC",
    LOAN_CLOSURE = "LOAN_CLOSURE",
    OTHER = "OTHER",
}

export enum RegistrationStep {
    VEHICLE_DETAILS = 1,
    VEHICLE_CONDITION,
    MAJOR_COMPONENTS,
    DOCUMENTS,
    PHOTOS,
    PICKUP,
    REVIEW,
    SUBMITTED,
}

export enum TransmissionType {
    MANUAL = "MANUAL",
    AUTOMATIC = "AUTOMATIC",
    CVT = "CVT",
    DCT = "DCT",
    AMT = "AMT",
}

export enum EngineCondition {
    EXCELLENT = "EXCELLENT",
    GOOD = "GOOD",
    FAIR = "FAIR",
    POOR = "POOR",
    NOT_WORKING = "NOT_WORKING",
}

export enum ComponentCondition {
    GOOD = "GOOD",
    NOT_WORKING = "NOT_WORKING",
    MISSING = "MISSING",
}

export enum accidentType {
    NO_ACCIDENT = "NO_ACCIDENT",
    ACCIDENTAL_DAMAGE = "ACCIDENTAL_DAMAGE",
    BURNT = "BURNT",
    FLOODED = "FLOODED",
    OTHER = "OTHER",
}

export enum structuralDamage {
    NO_DAMAGE = "NO_DAMAGE",
    MINOR_DAMAGE = "MINOR_DAMAGE",
    MAJOR_DAMAGE = "MAJOR_DAMAGE",
}
export interface IVehicle {
    _id: string
    owner: string;
    pickupCharges?: number;
    documentCharges?: number;
    auctionResult?: {
        auctionId: string;
        partnerId: string | null;
        winningBid: number | null;
        wonAt: Date | null;
    };

    status: VehicleStatus;
    processingStage?: ProcessingStage;
    isRegistered?: boolean;
    currentStep: RegistrationStep;
    vehicleDetails: {
        carName: string;
        registrationNumber: string;
        model: string;
        variant: string;
        fuelType: string;
        transmission: TransmissionType;
        manufacturingYear: number;
        ownership: number;
        kmsDriven: number;
    };

    vehicleCondition: {
        accidentType: accidentType;
        structure: structuralDamage;
        airbagsDeployed: boolean;
        description: string;
    };

    majorComponents: {
        engine: ComponentCondition;
        radiator: ComponentCondition;
        fuelSystem: ComponentCondition;
        gearbox: ComponentCondition;
        suspension: ComponentCondition;
        steering: ComponentCondition;
        electrical: ComponentCondition;
        exhaust: ComponentCondition;
        tyres: ComponentCondition;
        ac: ComponentCondition;
        bodyPanels: ComponentCondition;
        glass: ComponentCondition;
        lights: ComponentCondition;
        interior: ComponentCondition;
    };

    documents: {
        rcbook?: IVehicleDocument;
        insurance?: IVehicleDocument;
        puc?: IVehicleDocument;
        loanClosure?: IVehicleDocument;
        other?: IVehicleDocument;
    };
    partnerDocumentStatus?: PartnerDocumentSubmissionStatus;
    partnerDocuments?: IPartnerDocument[];
    photos: {
        front?: IUploadedPhoto;
        rear?: IUploadedPhoto;
        left?: IUploadedPhoto;
        right?: IUploadedPhoto;
        dashboard?: IUploadedPhoto;
        interior?: IUploadedPhoto;
        engine?: IUploadedPhoto;
        odometer?: IUploadedPhoto;
        chassisNumber?: IUploadedPhoto;
    };

    pickup: {
        houseNumber: string;
        street: string;
        area: string;
        landmark?: string;
        city: string;
        state: string;
        pincode: string;
        latitude: number;
        longitude: number;
        formattedAddress?: string;
        contactName: string;
        mobileNumber: string;
        alternateNumber?: string;
        vehicleLocation: "HOME" | "OFFICE" | "PARKING" | "WORKSHOP" | "OTHER";
        towAccessibility: "YES" | "NO" | "NOT_SURE";
        currentVehiclePosition:
        | "ON_ROAD"
        | "BASEMENT"
        | "SOCIETY"
        | "ROADSIDE"
        | "GARAGE";
        scheduledAt?: Date;
        confirmedAt?: Date;
        confirmedBy?: string;
        assignedDriver?: string;

        pickupOtpHash?: string | null;
        pickupOtpExpiresAt?: Date | null;
        pickupOtpAttempts?: number;
        pickupOtpVerifiedAt?: Date | null;
    };
    timeline: {
        title: string;
        completed: boolean;
        completedAt?: Date;
    }[];
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}




export interface CustomerBookingResponse {
    bookingId: string;
    vehicleId: string;

    status: string;

    vehicle: {
        name: string;
        registrationNumber: string | null;
        fuelType: string | null;
        model: string | null;
        variant: string | null;
    };

    bookingDate: Date | null;

    offerAmount: number | null;

    pickup: {
        status: string;
        scheduledAt: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null;
        contactName: string | null;
        assignedDriver: string | null;
    };

    journey: {
        step: number;
        title: string;
        completed: boolean;
        completedAt: Date | null;
    }[];
}

// src/types/partnerDashboard.ts

// ======================================================
// VEHICLE STATUS
// ======================================================

export type AuctionType =
    | "LIVE"
    | "INSTANT";

// ======================================================
// PARTNER DOCUMENT TYPE
// ======================================================
export interface PartnerDashboardSummary {
    ordersWonToday: number;

    ordersWonTodayValue: number;

    vehiclesAwaitingArrival: number;

    vehiclesInProcessing: number;

    pendingDocuments: number;

    monthlyRevenue: number;
}

// ======================================================
// LIVE BIDDING OPPORTUNITY
// ======================================================

export interface LiveBiddingOpportunity {
    auctionId: string;

    vehicleId: string;

    minimumBid: number | null;

    currentHighestBid: number;

    totalBids: number;

    startTime: string;

    endTime: string;

    /**
     * Remaining auction time in milliseconds
     */
    timeLeft: number;

    type: AuctionType;
}

// ======================================================
// INCOMING VEHICLE
// ======================================================

export interface IncomingVehicle {
    vehicleId: string;

    vehicleName: string;

    registrationNumber: string | null;

    status: VehicleStatus;

    driver: string | null;

    scheduledAt: string | null;

    pickupAddress: string | null;
}

// ======================================================
// PROCESSING YARD OVERVIEW
// ======================================================

export interface ProcessingOverview {
    waitingForArrival: number;

    vehicleReceived: number;

    inspectionCompleted: number;

    dismantling: number;

    recycling: number;

    certificatePending: number;

    completed: number;
}

// ======================================================
// REQUIRED DOCUMENT
// ======================================================

export interface PartnerRequiredDocument {
    vehicleId: string;

    vehicleName: string;

    registrationNumber: string | null;

    documentId: string | undefined;

    type: PartnerDocumentType;

    required: boolean;

    status: PartnerDocumentStatus;

    rejectionReason: string | null;
}

// ======================================================
// EARNINGS
// ======================================================

export interface PartnerDashboardEarnings {
    totalRevenue: number;

    /**
     * Currently unavailable because
     * settlement service/model is not implemented.
     */
    netSettlement: number | null;

    pendingSettlements: number | null;

    completedSettlements: number | null;
}

// ======================================================
// DASHBOARD DATA
// ======================================================

export interface PartnerDashboardData {
    summary: PartnerDashboardSummary;

    liveBiddingOpportunities: LiveBiddingOpportunity[];

    incomingVehicles: IncomingVehicle[];

    processingOverview: ProcessingOverview;

    documentsRequired: PartnerRequiredDocument[];

    earnings: PartnerDashboardEarnings;
}

// ======================================================
// COMPLETE API RESPONSE
// ======================================================

export interface PartnerDashboardResponse {
    data: PartnerDashboardData;
}


export interface PaymentProof {
    _id: string;

    type:
    | "OWNER_PAYMENT_PROOF"
    | "PARTNER_PAYMENT_PROOF";

    fileName: string;

    fileUrl: string;

    storagePath?: string;

    uploadedAt: string;

    verified: boolean;

    verifiedAt?: string | null;

    rejectionReason?: string | null;
}

export interface PartnerPaymentVehicle {

    vehicleId: string;

    vehicleDetails: {
        carName: string | null;
        model: string | null;
        variant: string | null;
        registrationNumber: string | null;
        manufacturingYear: number | null;
    };

    auction: {
        auctionId: string | null;
        winningBid: number;
        wonAt: string | null;
    };

    status: string;

    processingStage: string;

    partnerDocumentStatus:
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "SUBMITTED"
    | "APPROVED"
    | "REJECTED";

    paymentStatus:
    | "PENDING"
    | "PROOF_UPLOADED"
    | "VERIFIED"
    | "REJECTED";

    paymentProofs: PaymentProof[];

    updatedAt: string;
}