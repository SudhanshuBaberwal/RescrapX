import mongoose, { Schema } from "mongoose";
const bidSchema = new Schema({
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
}, {
    timestamps: true,
});
bidSchema.index({
    partnerId: 1,
    createdAt: -1,
});
bidSchema.index({
    auctionId: 1,
    vehicleId: 1,
    createdAt: -1,
});
export const Bid = mongoose.model("Bid", bidSchema);
