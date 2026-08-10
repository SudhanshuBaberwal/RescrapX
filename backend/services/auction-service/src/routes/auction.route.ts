import { Router } from "express";

import { createAuction } from "../controllers/auction.controller.js";
import adminOnly from "../middlewares/adminOnly.js";
const router = Router();

router.post("/create", adminOnly, createAuction);

export default router;
