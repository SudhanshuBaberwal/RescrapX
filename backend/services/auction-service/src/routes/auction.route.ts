import { Router } from "express";

import {
  approveAuction,
  approveAuctionStart,
  cancelAdminAuction,
  checkStartApproval,
  condifureAuctionVehicle,
  createAuction,
  finalizeAuction,
  getAdminAuctionActivity,
  getAdminAuctionById,
  getAdminAuctions,
  getAdminAuctionStats,
  getAdminDashboardAuctionData,
  getAuctionData,
  getAuctionDataForPartner,
  getPendingApprovalAuctions,
  getPendingStartApproval,
  placeBid,
  rejectAuctionStart,
} from "../controllers/auction.controller.js";
import adminOnly from "../middlewares/adminOnly.js";
import partnerOnly from "../middlewares/partnerOnly.js";
import { MyBids } from "../controllers/bid.controller.js";
const router = Router();

router.post("/create", adminOnly, createAuction);
router.get("/auction", adminOnly, getAuctionData);
router.get("/partner/live", getAuctionDataForPartner);
router.post("/approve", adminOnly, approveAuction);
router.patch("/configure", adminOnly, condifureAuctionVehicle);
router.get("/pending-approval", adminOnly, getPendingApprovalAuctions);

router.get("/start-approval/check", adminOnly, checkStartApproval);
router.get("/start-approval/pending", adminOnly, getPendingStartApproval);
router.patch("/start-approval/approve", adminOnly, approveAuctionStart);
router.patch("/start-approval/reject", adminOnly, rejectAuctionStart);
router.post("/bid", placeBid);
router.post("/:auctionId/finalize", finalizeAuction);

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

export default router;
