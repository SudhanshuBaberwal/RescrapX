import { Router } from "express";
import {
  createVehicleDraft,
  findVehicle,
  getAllVehicles,
  majorComponents,
  registerBasicVehicleDetails,
  reviewVehicle,
  // savePickupLocation,
  uploadVehicleDocumentController,
  uploadVehiclePhotosController,
  vehicleCondition,
  vehiclePickupLocation,
} from "../controllers/vehicle.controller.js";
import {
  pickupSchema,
  vehicleBasicSchema,
  vehicleConditionSchema,
  vehicleDocumentSchema,
  vehicleMajorComponentsSchema,
} from "../validations/vehicle.validation.js";
import { attachUser } from "../middlewares/attachUser.js";
import validate from "../middlewares/validate.middleware.js";
import uploadVehicleDocument, {
  uploadVehiclePhotos,
} from "../middlewares/uploadVehicleDocument.js";

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

router.get("/all-vehicles", attachUser, getAllVehicles);

router.put(
  "/photos",
  attachUser,
  uploadVehiclePhotos,
  uploadVehiclePhotosController,
);

router.put(
  "/pickup-location",
  attachUser,
  validate(pickupSchema),
  vehiclePickupLocation,
);

router.get("/get-vehicle", attachUser, findVehicle);
router.put("/reviews", attachUser, reviewVehicle);
export default router;
