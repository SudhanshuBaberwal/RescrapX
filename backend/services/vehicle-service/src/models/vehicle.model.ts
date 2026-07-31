import mongoose, { Document, Model, Schema } from "mongoose";

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

export interface IVehicle extends Document {
  userId: mongoose.Types.ObjectId;

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
    color: String,
    city: String,
  },
  { _id: false },
);

const vehicleConditionSchema = new Schema(
  {
    runningCondition: Boolean,
    accidental: Boolean,
    floodAffected: Boolean,
    engineCondition: {
      type: String,
      enum: Object.values(EngineCondition),
    },
    transmissionCondition: {
      type: String,
      enum: Object.values(TransmissionType),
    },
  },
  { _id: false },
);

const majorComponentsSchema = new Schema(
  {
    batteryAvailable: Boolean,
    batteryCondition: String,
    tyreCondition: String,
    alloyWheels: Boolean,
    musicSystem: Boolean,
    catalyticConverter: Boolean,
    ecuAvailable: Boolean,
    airbagsAvailable: Boolean,
    spareWheel: Boolean,
    toolkitAvailable: Boolean,
  },
  { _id: false },
);

const documentsSchema = new Schema(
  {
    rc: String,
    insurance: String,
    puc: String,
    ownerIdProof: String,
    keysAvailable: Boolean,
    numberOfKeys: Number,
    loanStatus: Boolean,
    nocDocument: String,
  },
  { _id: false },
);

const photosSchema = new Schema(
  {
    front: String,
    rear: String,
    left: String,
    right: String,
    interior: String,
    dashboard: String,
    engine: String,
    odometer: String,
    chassisNumber: String,
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
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
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
vehicleSchema.index({ userId: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ "vehicleDetails.registrationNumber": 1 });

const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>(
  "Vehicle",
  vehicleSchema,
);

export default Vehicle;