import mongoose, { Document, Model, Schema } from "mongoose";
import { v4 as uuid } from "uuid";

export enum AuctionStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  APPROVAL_PENDING = "APPROVAL_PENDING",
  START_APPROVED = "START_APPROVED",
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

  latitude: number;
  longitude: number;

  state?: string;
  district?: string;

  minimumBid?: number | null;
  reservePrice?: number | null;
  bidIncrement?: number | null;

  currentHighestBid?: number;
  highestBidder?: string | null;
  totalBids?: number;

  winnerBid?: number | null;
  winnerPartner?: string | null;
  winnerStatus?: WinnerStatus;

  paymentStatus?: PaymentStatus;
}

export interface IAuctionPartnerVehicle {
  vehicleId: string;
  distanceInKm: number;
}

export interface IAuctionPartner {
  partnerId: string;
  companyName?: string;

  latitude: number;
  longitude: number;

  state?: string;
  district?: string;

  vehicleIds: IAuctionPartnerVehicle[];
}

export interface IAuction extends Document {
  auctionId: string;

  vehicles: IAuctionVehicle[];
  partners: IAuctionPartner[];

  type: AuctionType;
  status: AuctionStatus;

  totalBids: number;
  totalParticipants: number;

  startTime: Date;
  endTime: Date;
  startApprovalPending: boolean;
  startApprovalRequestedAt?: Date;
  startApprovedAt?: Date;
  startApprovedBy?: string;
  autoExtend: boolean;
  autoExtendDuration: number;
  extensionCount: number;
  maxExtensions: number;

  visibility: "PUBLIC" | "PRIVATE";

  cancellationReason?: string | null;
  completedAt?: Date | null;
  cancelledAt?: Date | null;

  createdBy: string;
  updatedBy?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

const AuctionVehicleSchema = new Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      index: true,
    },

    sellerId: {
      type: String,
      required: true,
      index: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    state: {
      type: String,
      default: null,
    },

    district: {
      type: String,
      default: null,
    },

    minimumBid: {
      type: Number,
      default: null,
      min: 0,
    },

    reservePrice: {
      type: Number,
      default: null,
      min: 0,
    },

    bidIncrement: {
      type: Number,
      default: null,
      min: 1,
    },

    currentHighestBid: {
      type: Number,
      default: 0,
      min: 0,
    },

    highestBidder: {
      type: String,
      default: null,
    },

    totalBids: {
      type: Number,
      default: 0,
      min: 0,
    },

    winnerBid: {
      type: Number,
      default: null,
    },

    winnerPartner: {
      type: String,
      default: null,
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
  },
  {
    _id: false,
  },
);

const AuctionPartnerVehicleSchema = new Schema(
  {
    vehicleId: {
      type: String,
      required: true,
    },

    distanceInKm: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const AuctionPartnerSchema = new Schema(
  {
    partnerId: {
      type: String,
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      default: null,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    state: {
      type: String,
      default: null,
    },

    district: {
      type: String,
      default: null,
    },

    vehicleIds: {
      type: [AuctionPartnerVehicleSchema],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const auctionSchema = new Schema(
  {
    auctionId: {
      type: String,
      unique: true,
      default: () => uuid(),
      index: true,
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

    totalBids: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },

    startTime: {
      type: Date,
      required: true,
      index: true,
    },

    endTime: {
      type: Date,
      required: true,
      index: true,
    },

    autoExtend: {
      type: Boolean,
      default: true,
    },

    autoExtendDuration: {
      type: Number,
      default: 120,
      min: 1,
    },

    extensionCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxExtensions: {
      type: Number,
      default: 5,
      min: 0,
    },

    visibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PUBLIC",
    },

    startApprovalPending: {
      type: Boolean,
      default: false,
      index: true,
    },

    startApprovalRequestedAt: {
      type: Date,
      default: null,
    },

    startApprovedAt: {
      type: Date,
      default: null,
    },

    startApprovedBy: {
      type: String,
      default: null,
    },

    cancellationReason: {
      type: String,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

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

auctionSchema.index({
  status: 1,
  startTime: 1,
  endTime: 1,
});

const Auction: Model<IAuction> =
  mongoose.models.Auction || mongoose.model<IAuction>("Auction", auctionSchema);

export default Auction;
