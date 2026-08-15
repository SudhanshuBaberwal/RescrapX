import mongoose, { Schema, Document } from "mongoose";

export interface IBid extends Document {
  auctionId: string;
  vehicleId: string;
  partnerId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const bidSchema = new Schema<IBid>(
  {
    auctionId: {
      type: String,
      required: true,
      index: true,
    },

    vehicleId: {
      type: String,
      required: true,
      index: true,
    },

    partnerId: {
      type: String,
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

bidSchema.index({
  partnerId: 1,
  createdAt: -1,
});

bidSchema.index({
  auctionId: 1,
  vehicleId: 1,
  createdAt: -1,
});

export const Bid = mongoose.model<IBid>("Bid", bidSchema);