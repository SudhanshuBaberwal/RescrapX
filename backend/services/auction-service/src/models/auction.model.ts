import mongoose, { Document, Model, Schema } from "mongoose";

// ======================================================
// ENUMS
// ======================================================

export enum AuctionStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  APPROVAL_PENDING = "APPROVAL_PENDING",
  START_APPROVED = "START_APPROVED",
  LIVE = "LIVE",
  ENDED = "ENDED",
  CANCELLED = "CANCELLED",
}

export enum AuctionType {
  LIVE = "LIVE",
  INSTANT = "INSTANT",
}

export enum VehicleAssignedStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  UNSOLD = "UNSOLD",
}

// ======================================================
// AUCTION VEHICLE
// ======================================================

export interface IAuctionVehicle {
  vehicleId: string;
  sellerId: string;

  latitude: number;
  longitude: number;

  state?: string | null;
  district?: string | null;

  // Bid configuration
  minimumBid: number | null;
  bidIncrement: number | null;
  reservePrice: number | null;

  // Current bidding state
  currentHighestBid: number;
  highestBidder: string | null;
  totalBids: number;

  // Final assignment
  assignedPartnerId: string | null;
  assignedStatus: VehicleAssignedStatus;

  winnerBid: number | null;
}

// ======================================================
// AUCTION PARTNER
// ======================================================

export interface IAuctionPartner {
  partnerId: string;
  companyName?: string | null;

  latitude: number;
  longitude: number;

  state?: string | null;
  district?: string | null;
}

// ======================================================
// AUCTION
// ======================================================

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

  // Admin approval
  startApprovalRequestedAt: Date | null;
  startApprovedAt: Date | null;
  startApprovedBy: string | null;

  visibility: "PUBLIC" | "PRIVATE";

  completedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;

  createdBy: string;
  updatedBy: string | null;

  createdAt: Date;
  updatedAt: Date;
}

// ======================================================
// AUCTION VEHICLE SCHEMA
// ======================================================

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

    // ==================================================
    // BID CONFIGURATION
    // ==================================================

    minimumBid: {
      type: Number,
      default:null,
      min: 0,
    },

    bidIncrement: {
      type: Number,
      default: null,
      min: 1,
    },

    reservePrice: {
      type: Number,
      default: null,
      min: 0,
    },

    // ==================================================
    // CURRENT BID
    // ==================================================

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

    // ==================================================
    // FINAL ASSIGNMENT
    // ==================================================

    assignedPartnerId: {
      type: String,
      default: null,
    },

    assignedStatus: {
      type: String,
      enum: Object.values(VehicleAssignedStatus),
      default: VehicleAssignedStatus.PENDING,
    },

    winnerBid: {
      type: Number,
      default: null,
    },
  },
  {
    _id: false,
  },
);

// ======================================================
// AUCTION PARTNER SCHEMA
// ======================================================

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
  },
  {
    _id: false,
  },
);

// ======================================================
// AUCTION SCHEMA
// ======================================================

const auctionSchema = new Schema(
  {
    auctionId: {
      type: String,
      unique: true,
      index: true,
      // required: true,
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

    // ==================================================
    // AUCTION CONFIG
    // ==================================================

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

    // ==================================================
    // TIME
    // ==================================================

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

    // ==================================================
    // ADMIN APPROVAL
    // ==================================================

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

    // ==================================================
    // OTHER
    // ==================================================

    visibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PUBLIC",
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancellationReason: {
      type: String,
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

// ======================================================
// INDEX
// ======================================================

auctionSchema.index({
  status: 1,
  startTime: 1,
  endTime: 1,
});

// ======================================================
// MODEL
// ======================================================

const Auction: Model<IAuction> =
  mongoose.models.Auction || mongoose.model<IAuction>("Auction", auctionSchema);

export default Auction;
