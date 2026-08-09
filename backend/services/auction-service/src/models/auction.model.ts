import mongoose, { Document, Model, Schema } from "mongoose";
import { v4 as uuid } from "uuid";

export enum AuctionStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  LIVE = "LIVE",
  ENDED = "ENDED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum AuctionType {
  LIVE = "LIVE",
  INSTANT = "INSTANT",
}

export enum WinnerStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IAuctionVehicle {
  vehicleId: string;
  sellerId: string;
  model?: string;

  latitude: number;
  longitude: number;

  state?: string;
  district?: string;
}

export interface IAuctionPartner {
  partnerId: string;
  companyName?: string;

  latitude: number;
  longitude: number;

  state?: string;
  district?: string;

  // Vehicles this partner can bid on
  vehicleIds: string[];
}

export interface IAuction extends Document {
  auctionId: string;

  vehicles: IAuctionVehicle[];

  partners: IAuctionPartner[];

  type: AuctionType;
  status: AuctionStatus;

  winnerStatus: WinnerStatus;
  paymentStatus: PaymentStatus;

  minimumBid: number;
  reservePrice: number;
  bidIncrement: number;

  currentHighestBid: number;
  highestBidder?: string;

  winnerBid?: number;
  winnerPartner?: string;

  totalBids: number;
  totalParticipants: number;

  startTime: Date;
  endTime: Date;

  autoExtend: boolean;
  autoExtendDuration: number;
  extensionCount: number;
  maxExtensions: number;

  visibility: "PUBLIC" | "PRIVATE";

  cancellationReason?: string;
  completedAt?: Date;
  cancelledAt?: Date;

  createdBy: string;
  updatedBy?: string;

  createdAt: Date;
  updatedAt: Date;
}

const AuctionVehicleSchema = new Schema<IAuctionVehicle>(
  {
    vehicleId: {
      type: String,
      required: true,
    },

    sellerId: {
      type: String,
      required: true,
    },

    model: {
      type: String,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    state: String,
    district: String,
  },
  { _id: false },
);

const AuctionPartnerSchema = new Schema<IAuctionPartner>(
  {
    partnerId: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    state: String,
    district: String,

    vehicleIds: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const auctionSchema = new Schema<IAuction>(
  {
    auctionId: {
      type: String,
      unique: true,
      default: () => uuid(),
    },

    vehicles: {
      type: [AuctionVehicleSchema],
      required: true,
      default: [],
    },

    partners: {
      type: [AuctionPartnerSchema],
      required: true,
      default: [],
    },

    type: {
      type: String,
      enum: Object.values(AuctionType),
      default: AuctionType.LIVE,
    },

    status: {
      type: String,
      enum: Object.values(AuctionStatus),
      default: AuctionStatus.DRAFT,
      index: true,
    },

    winnerStatus: {
      type: String,
      enum: Object.values(WinnerStatus),
      default: WinnerStatus.PENDING,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    minimumBid: {
      type: Number,
      required: true,
      min: 0,
    },

    reservePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    bidIncrement: {
      type: Number,
      default: 1000,
      min: 100,
    },

    currentHighestBid: {
      type: Number,
      default: 0,
    },

    highestBidder: {
      type: String,
      default: null,
    },

    winnerBid: {
      type: Number,
      default: null,
    },

    winnerPartner: {
      type: String,
      default: null,
    },

    totalBids: {
      type: Number,
      default: 0,
    },

    totalParticipants: {
      type: Number,
      default: 0,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    autoExtend: {
      type: Boolean,
      default: true,
    },

    autoExtendDuration: {
      type: Number,
      default: 120,
    },

    extensionCount: {
      type: Number,
      default: 0,
    },

    maxExtensions: {
      type: Number,
      default: 5,
    },

    visibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PUBLIC",
    },

    cancellationReason: {
      type: String,
      default: null,
    },

    completedAt: Date,

    cancelledAt: Date,

    createdBy: {
      type: String,
      required: true,
    },

    updatedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

auctionSchema.index({ startTime: 1 });
auctionSchema.index({ endTime: 1 });
auctionSchema.index({ "vehicles.vehicleId": 1 });
auctionSchema.index({ "partners.partnerId": 1 });

const Auction: Model<IAuction> =
  mongoose.models.Auction || mongoose.model<IAuction>("Auction", auctionSchema);

export default Auction;
