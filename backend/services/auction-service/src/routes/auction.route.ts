import { Router } from "express";

import {
  createAuction,
  getAuctionData,
} from "../controllers/auction.controller.js";
import adminOnly from "../middlewares/adminOnly.js";
const router = Router();

router.post("/create", adminOnly, createAuction);
router.get("/auction", adminOnly, getAuctionData);

export default router;
