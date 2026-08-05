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

export interface IAuction extends Document {
  auctionId: string;
  vehicleId: string;
  sellerId: string;
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

const auctionSchema = new Schema<IAuction>(
  {
    auctionId: {
      type: String,
      unique: true,
      default: () => uuid(),
    },
    vehicleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sellerId: {
      type: String,
      required: true,
      index: true,
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
  }
);
auctionSchema.index({ vehicleId: 1 }, { unique: true });
auctionSchema.index({ sellerId: 1 });
auctionSchema.index({ status: 1 });
auctionSchema.index({ startTime: 1 });
auctionSchema.index({ endTime: 1 });
auctionSchema.index({ highestBidder: 1 });
auctionSchema.index({ winnerPartner: 1 });
auctionSchema.index({ createdAt: -1 });
auctionSchema.index({
  status: 1,
  startTime: 1,
});

auctionSchema.index({
  status: 1,
  endTime: 1,
});

const Auction: Model<IAuction> = mongoose.model<IAuction>(
  "Auction",
  auctionSchema
);

export default Auction;