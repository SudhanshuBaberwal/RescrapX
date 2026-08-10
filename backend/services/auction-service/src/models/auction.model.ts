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

/* ============================================================
   VEHICLE
============================================================ */

export interface IAuctionVehicle {
  vehicleId: string;
  sellerId: string;
  model?: string;

  latitude: number;
  longitude: number;

  state?: string;
  district?: string;
}

/* ============================================================
   PARTNER VEHICLE
============================================================ */

export interface IAuctionPartnerVehicle {
  vehicleId: string;
  distanceInKm: number;
}

/* ============================================================
   PARTNER
============================================================ */

export interface IAuctionPartner {
  partnerId: string;
  companyName?: string;

  latitude: number;
  longitude: number;

  state?: string;
  district?: string;

  // Vehicles available for this partner
  // within 150 KM radius
  vehicleIds: IAuctionPartnerVehicle[];
}

/* ============================================================
   AUCTION
============================================================ */

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

/* ============================================================
   AUCTION VEHICLE SCHEMA
============================================================ */

const AuctionVehicleSchema = new Schema(
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

/* ============================================================
   PARTNER VEHICLE SCHEMA
============================================================ */

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

/* ============================================================
   AUCTION PARTNER SCHEMA
============================================================ */

const AuctionPartnerSchema = new Schema(
  {
    partnerId: {
      type: String,
      required: true,
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

    /*
     * Vehicles which are inside this partner's
     * allowed radius.
     */
    vehicleIds: {
      type: [AuctionPartnerVehicleSchema],
      default: [],
    },
  },
  {
    _id: false,
  },
);

/* ============================================================
   AUCTION SCHEMA
============================================================ */

const auctionSchema = new Schema<IAuction>(
  {
    auctionId: {
      type: String,
      unique: true,
      default: () => uuid(),
    },

    /* ================= VEHICLES ================= */

    vehicles: {
      type: [AuctionVehicleSchema],
      required: true,
      default: [],
    },

    /* ================= PARTNERS ================= */

    partners: {
      type: [AuctionPartnerSchema],
      required: true,
      default: [],
    },

    /* ================= AUCTION TYPE ================= */

    type: {
      type: String,
      enum: Object.values(AuctionType),
      default: AuctionType.LIVE,
    },

    /* ================= STATUS ================= */

    status: {
      type: String,
      enum: Object.values(AuctionStatus),
      default: AuctionStatus.DRAFT,
      index: true,
    },

    /* ================= WINNER ================= */

    winnerStatus: {
      type: String,
      enum: Object.values(WinnerStatus),
      default: WinnerStatus.PENDING,
    },

    /* ================= PAYMENT ================= */

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    /* ================= BIDDING ================= */

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

    /* ================= STATISTICS ================= */

    totalBids: {
      type: Number,
      default: 0,
    },

    totalParticipants: {
      type: Number,
      default: 0,
    },

    /* ================= TIME ================= */

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

    /* ================= AUTO EXTENSION ================= */

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

    /* ================= VISIBILITY ================= */

    visibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PUBLIC",
    },

    /* ================= CANCELLATION ================= */

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

    /* ================= AUDIT ================= */

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

/* ============================================================
   INDEXES
============================================================ */

auctionSchema.index({ startTime: 1 });
auctionSchema.index({ endTime: 1 });

auctionSchema.index({
  "vehicles.vehicleId": 1,
});

auctionSchema.index({
  "vehicles.sellerId": 1,
});

auctionSchema.index({
  "partners.partnerId": 1,
});

auctionSchema.index({
  "partners.vehicleIds.vehicleId": 1,
});

/* ============================================================
   MODEL
============================================================ */

const Auction: Model<IAuction> =
  mongoose.models.Auction ||
  mongoose.model<IAuction>("Auction", auctionSchema);

export default Auction;