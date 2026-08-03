import mongoose, { Document, Model, Schema } from "mongoose";

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
export interface IVehicle extends Document {
  owner: mongoose.Types.ObjectId;

  status: VehicleStatus;
  isRegistered?: boolean;
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

    formattedAddress: string;
    placeId: string;

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

const vehicleDetailsSchema = new Schema(
  {
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
  },
  { _id: false },
);

const vehicleConditionSchema = new Schema(
  {
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
  },
  { _id: false },
);

const majorComponentsSchema = new Schema(
  {
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
  },
  { _id: false },
);

const vehicleDocumentSchema = new Schema(
  {
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
  },
  {
    _id: false,
  },
);

const documentsSchema = new Schema(
  {
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
  },
  {
    _id: false,
  },
);

const uploadedPhotoSchema = new Schema(
  {
    path: String,
    originalName: String,
    mimeType: String,
    size: Number,
    uploadedAt: Date,
  },
  { _id: false },
);

const photosSchema = new Schema(
  {
    front: uploadedPhotoSchema,
    rear: uploadedPhotoSchema,
    left: uploadedPhotoSchema,
    right: uploadedPhotoSchema,
    dashboard: uploadedPhotoSchema,
    interior: uploadedPhotoSchema,
    engine: uploadedPhotoSchema,
    odometer: uploadedPhotoSchema,
    chassisNumber: uploadedPhotoSchema,
  },
  { _id: false },
);

const pickupSchema = new Schema(
  {
    address: String,
    city: String,
    state: String,
    pincode: String,
    latitude: Number,
    longitude: Number,
    preferredDate: Date,
    preferredTime: String,
  },
  { _id: false },
);

const timelineSchema = new Schema(
  {
    title: String,
    completed: Boolean,
    completedAt: Date,
  },
  { _id: false },
);

const vehicleSchema = new Schema<IVehicle>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isRegistered: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: Object.values(VehicleStatus),
      default: VehicleStatus.DRAFT,
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
    timeline: [timelineSchema],
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
vehicleSchema.index({ owner: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ "vehicleDetails.registrationNumber": 1 });

const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>(
  "Vehicle",
  vehicleSchema,
);

export default Vehicle;
