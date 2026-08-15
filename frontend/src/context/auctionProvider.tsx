
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


export type MyBidStatus =
  | "ACTIVE"
  | "OUTBID"
  | "WON"
  | "LOST";

export interface MyBid {
  bidId: string;

  auctionId: string;

  vehicleId: string;

  amount: number;

  currentHighestBid: number;

  highestBidder: string | null;

  totalBids: number;

  minimumBid: number;

  bidIncrement: number;

  reservePrice: number;

  auctionStatus:
    | "DRAFT"
    | "SCHEDULED"
    | "LIVE"
    | "ENDED"
    | "CANCELLED";

  startTime: string;

  endTime: string;

  status: MyBidStatus;

  createdAt: string;

  vehicle?: {
    manufacturer?: string;
    model?: string;
    manufacturingYear?: number;
    fuelType?: string;
    transmission?: string;
  };

  pickup?: {
    city?: string;
    state?: string;
  };

  photos?: string[];
}