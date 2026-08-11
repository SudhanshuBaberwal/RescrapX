import { Router } from "express";

import {
  approveAuction,
  approveAuctionStart,
  checkStartApproval,
  condifureAuctionVehicle,
  createAuction,
  getAuctionData,
  getAuctionDataForPartner,
  getPendingApprovalAuctions,
  getPendingStartApproval,
  placeBid,
  rejectAuctionStart,
} from "../controllers/auction.controller.js";
import adminOnly from "../middlewares/adminOnly.js";
import partnerOnly from "../middlewares/partnerOnly.js";
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
router.post("/bid", partnerOnly, placeBid);
export default router;
