import { Router } from "express";
import {
  allVehiclesDataForAdmin,
  ApplyForBiddingVehicleController,
  approveVehicleForPickup,
  assignDriver,
  createVehicleDraft,
  FindALlVehicleForUserController,
  findScheduledVehicles,
  findVehicle,
  getAllVehicles,
  getPickupMap,
  getReadyForBiddingVehicles,
  getVehicleDashboardStats,
  majorComponents,
  registerBasicVehicleDetails,
  reviewVehicle,
  schedulePickup,
  scheduleVehiclePickup,
  underVerification,
  updateAuctionVehicleStatus,
  updateVehicleStatus,
  uploadVehicleDocumentController,
  uploadVehiclePhotosController,
  vehicleCondition,
  vehiclePickupLocation,
  viewDocument,
} from "../controllers/vehicle.controller.js";
import {
  pickupSchema,
  vehicleBasicSchema,
  vehicleConditionSchema,
  vehicleMajorComponentsSchema,
} from "../validations/vehicle.validation.js";
import { attachUser } from "../middlewares/attachUser.js";
import validate from "../middlewares/validate.middleware.js";
import uploadVehicleDocument, {
  uploadVehiclePhotos,
} from "../middlewares/uploadVehicleDocument.js";
import adminOnly from "../middlewares/adminOnly.js";
import serviceAuth from "../middlewares/serviceAuth.js";

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
router.get("/vehicles", adminOnly, allVehiclesDataForAdmin);
router.post("/view-document", viewDocument);
router.put("/under-verification", attachUser, underVerification);
router.put("/status", attachUser, adminOnly, updateVehicleStatus);
router.get("/user-vehicles", attachUser, FindALlVehicleForUserController);
router.post("/apply", attachUser, ApplyForBiddingVehicleController);
router.get("/ready-for-auction", serviceAuth, getReadyForBiddingVehicles);
router.patch("/auction/status", updateAuctionVehicleStatus);
router.patch("/approve-pickup", attachUser, approveVehicleForPickup);
router.patch("/schedule", adminOnly, scheduleVehiclePickup);
router.get("/scheduled-vehicles", adminOnly, findScheduledVehicles);

router.get("/admin/dashboard/stats", adminOnly, getVehicleDashboardStats);

router.get("/admin/dashboard/pickups/map", adminOnly, getPickupMap);

router.patch("/admin/pickup/schedule", adminOnly, schedulePickup);

router.patch("/admin/pickup/assign-driver", adminOnly, assignDriver);

export default router;
