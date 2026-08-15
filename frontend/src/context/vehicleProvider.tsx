export interface IVehicleDocument {
    path: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedAt: Date;
}

export interface IUploadedPhoto {
    path: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedAt: Date;
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
    IN_TRANSIT = "IN_TRANSIT",
    PICKED_UP="PICKED_UP",
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