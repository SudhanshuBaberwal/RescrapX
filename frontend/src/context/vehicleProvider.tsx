export enum VehicleStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_VERIFICATION = "UNDER_VERIFICATION",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED",
    READY_FOR_BIDDING = "READY_FOR_BIDDING",
    SOLD = "SOLD",
    CANCELLED = "CANCELLED",
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

export interface IVehicle {
    userId: string;
    status: VehicleStatus;
    currentStep: RegistrationStep;
    vehicleDetails: {
        registrationNumber: string;
        manufacturer: string;
        model: string;
        variant: string;
        fuelType: string;
        transmission: TransmissionType;
        manufacturingYear: number;
        ownership: number;
        kmsDriven: number;
        color: string;
        city: string;
    };
    vehicleCondition: {
        runningCondition: boolean;
        accidental: boolean;
        floodAffected: boolean;
        engineCondition: EngineCondition;
        transmissionCondition: TransmissionType;
    };

    majorComponents: {
        batteryAvailable: boolean;
        batteryCondition: string;
        tyreCondition: string;
        alloyWheels: boolean;
        musicSystem: boolean;
        catalyticConverter: boolean;
        ecuAvailable: boolean;
        airbagsAvailable: boolean;
        spareWheel: boolean;
        toolkitAvailable: boolean;
    };

    documents: {
        rc: string;
        insurance: string;
        puc: string;
        ownerIdProof: string;
        keysAvailable: boolean;
        numberOfKeys: number;
        loanStatus: boolean;
        nocDocument: string;
    };

    photos: {
        front: string;
        rear: string;
        left: string;
        right: string;
        interior: string;
        dashboard: string;
        engine: string;
        odometer: string;
        chassisNumber: string;
    };

    pickup: {
        address: string;
        city: string;
        state: string;
        pincode: string;
        latitude: number;
        longitude: number;
        preferredDate: Date;
        preferredTime: string;
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
