import { Router } from "express";

import { createVehicleDraft } from "../controllers/vehicle.controller.js";

const router = Router();

router.post("/", createVehicleDraft);

export default router;