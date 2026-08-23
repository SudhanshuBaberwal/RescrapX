import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVehicleDocument {
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export interface IPartnerDocument {
  _id?: mongoose.Types.ObjectId;
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

export enum PaymentStatus {
  PENDING = "PENDING",
  PROOF_UPLOADED = "PROOF_UPLOADED",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
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

export interface IPaymentProof {
  _id?: mongoose.Types.ObjectId;

  type: "OWNER_PAYMENT_PROOF" | "PARTNER_PAYMENT_PROOF";

  fileName: string;

  fileUrl: string;

  storagePath?: string | null;

  uploadedBy?: mongoose.Types.ObjectId | null;

  uploadedAt: Date;

  verified: boolean;

  verifiedAt?: Date | null;

  rejectionReason?: string | null;
}
export interface IVehicle extends Document {
  owner: mongoose.Types.ObjectId;
  pickupCharges?: number;
  documentCharges?: number;
  auctionResult?: {
    auctionId: string;
    partnerId: string | null;
    winningBid: number | null;
    wonAt: Date | null;
  };

  status: VehicleStatus;
  paymentStatus: PaymentStatus;
  paymentProofs: IPaymentProof[];
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
// 1. Photo Document ke liye Sub-Schema banayein
const uploadedPhotoSchema = new Schema(
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
  { _id: false },
);

// 2. Updated photosSchema
const photosSchema = new Schema(
  {
    front: { type: uploadedPhotoSchema, default: null },
    rear: { type: uploadedPhotoSchema, default: null },
    left: { type: uploadedPhotoSchema, default: null },
    right: { type: uploadedPhotoSchema, default: null },
    dashboard: { type: uploadedPhotoSchema, default: null },
    interior: { type: uploadedPhotoSchema, default: null },
    engine: { type: uploadedPhotoSchema, default: null },
    odometer: { type: uploadedPhotoSchema, default: null },
    chassisNumber: { type: uploadedPhotoSchema, default: null },
  },
  { _id: false },
);

const partnerDocumentSchema = new Schema(
  {
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
  },
  {
    _id: true,
  },
);

const pickupSchema = new Schema(
  {
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
  },
  {
    _id: false,
  },
);

const timelineSchema = new Schema(
  {
    title: String,
    completed: Boolean,
    completedAt: Date,
  },
  { _id: false },
);

const paymentProofSchema = new Schema(
  {
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
  },
  {
    _id: true,
  },
);

const vehicleSchema = new Schema<IVehicle>(
  {
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
