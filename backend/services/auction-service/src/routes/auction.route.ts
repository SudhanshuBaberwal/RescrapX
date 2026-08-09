import { Router } from "express";

import { createAuction } from "../controllers/auction.controller.js";
import adminOnly from "../middlewares/adminOnly.js";
import protect from "../middlewares/protect.js";
const router = Router();

router.post("/create",protect, adminOnly, createAuction);

export default router;
