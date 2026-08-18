import ApiResponse from "../lib/ApiResponse.js";
import asyncHandler from "../lib/asyncHandler.js";
import BidClass from "../service/bid.service.js";
export const MyBids = asyncHandler(async (req, res) => {
    const partnerId = req.headers["x-user-id"];
    if (!partnerId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const bids = await BidClass.getMyBids(partnerId);
    return ApiResponse.success(res, 201, "my bids", bids);
});
