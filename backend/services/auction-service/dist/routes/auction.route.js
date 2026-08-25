import { Router } from "express";
import { approveAuction, approveAuctionStart, cancelAdminAuction, checkStartApproval, condifureAuctionVehicle, createAuction, finalizeAuction, getAdminAuctionActivity, getAdminAuctionById, getAdminAuctions, getAdminAuctionStats, getAdminDashboardAuctionData, getAuctionData, getAuctionDataForPartner, getPartnerLiveBidding, getPartnerWonVehicles, getPendingApprovalAuctions, getPendingStartApproval, placeBid, rejectAuctionStart, } from "../controllers/auction.controller.js";
import adminOnly from "../middlewares/adminOnly.js";
import partnerOnly from "../middlewares/partnerOnly.js";
import { MyBids } from "../controllers/bid.controller.js";
import { auctionMutationLimiter, bidLimiter } from "../middlewares/ratelimit.middleware.js";
const router = Router();
router.post("/create", adminOnly, auctionMutationLimiter, createAuction);
router.get("/auction", adminOnly, getAuctionData);
router.get("/partner/live", getAuctionDataForPartner);
router.post("/approve", adminOnly, auctionMutationLimiter, approveAuction);
router.patch("/configure", adminOnly, condifureAuctionVehicle);
router.get("/pending-approval", adminOnly, getPendingApprovalAuctions);
router.get("/start-approval/check", adminOnly, checkStartApproval);
router.get("/start-approval/pending", adminOnly, getPendingStartApproval);
router.patch("/start-approval/approve", adminOnly, auctionMutationLimiter, approveAuctionStart);
router.patch("/start-approval/reject", adminOnly, rejectAuctionStart);
router.post("/bid", partnerOnly, bidLimiter, placeBid);
router.post("/:auctionId/finalize", adminOnly, auctionMutationLimiter, finalizeAuction);
// ==========================================
// ADMIN DASHBOARD
// ==========================================
router.get("/admin/stats", getAdminAuctionStats);
router.get("/admin/activity", getAdminAuctionActivity);
router.get("/admin", getAdminAuctions);
router.get("/admin/:auctionId", getAdminAuctionById);
router.patch("/admin/:auctionId/cancel", cancelAdminAuction);
router.get("/partner/my-bids", partnerOnly, MyBids);
router.get("/admin/dashboard", adminOnly, getAdminDashboardAuctionData);
router.get("/partner/won-vehicles", partnerOnly, getPartnerWonVehicles);
router.get("/partner/live-opportunities", partnerOnly, getPartnerLiveBidding);
export default router;
