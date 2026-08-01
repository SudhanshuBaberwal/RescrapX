import { Router } from "express";

import {
  createVehicleDraft,
  majorComponents,
  registerBasicVehicleDetails,
  vehicleCondition,
} from "../controllers/vehicle.controller.js";
import {
  vehicleBasicSchema,
  vehicleConditionSchema,
  vehicleMajorComponentsSchema,
} from "../validations/vehicle.validation.js";
import { attachUser } from "../middlewares/attachUser.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/", createVehicleDraft);
router.put(
  "/basic-details",
  attachUser,
  validate(vehicleBasicSchema),
  registerBasicVehicleDetails,
);

router.put(
  "/vehicle-condition",
  attachUser,
  validate(vehicleConditionSchema),
  vehicleCondition,
);

router.put(
  "/major-components",
  attachUser,
  validate(vehicleMajorComponentsSchema),
  majorComponents,
);

export default router;
