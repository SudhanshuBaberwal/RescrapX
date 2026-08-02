import { Router } from "express";

import {
  createVehicleDraft,
  majorComponents,
  registerBasicVehicleDetails,
  uploadVehicleDocumentController,
  vehicleCondition,
} from "../controllers/vehicle.controller.js";
import {
  vehicleBasicSchema,
  vehicleConditionSchema,
  vehicleDocumentSchema,
  vehicleMajorComponentsSchema,
} from "../validations/vehicle.validation.js";
import { attachUser } from "../middlewares/attachUser.js";
import validate from "../middlewares/validate.middleware.js";
import uploadVehicleDocument from "../middlewares/uploadVehicleDocument.js";

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

router.put(
  "/document",
  attachUser,
  uploadVehicleDocument,
  uploadVehicleDocumentController,
);

export default router;
