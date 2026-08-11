import { Router } from "express";

import {
  createAuction,
  getAuctionData,
  getAuctionDataForPartner,
} from "../controllers/auction.controller.js";
import adminOnly from "../middlewares/adminOnly.js";
const router = Router();

router.post("/create", adminOnly, createAuction);
router.get("/auction", adminOnly, getAuctionData);
router.get("/partner/live", getAuctionDataForPartner);
export default router;
