import { Router } from "express";
import {
  acceptOfferAndSubmitPaymentDocuments,
  allVehiclesDataForAdmin,
  ApplyForBiddingVehicleController,
  approveAllPartnerDocuments,
  approveVehicleForPickup,
  assignDriver,
  calculateVehicleEstimatedPrice,
  createVehicleDraft,
  FindALlVehicleForUserController,
  findScheduledVehicles,
  findVehicle,
  getAllVehicles,
  getAllVehiclesWithStatus,
  getCustomerBookingById,
  getCustomerBookings,
  getOwnerVerifiedPaymentVehicles,
  getPartnerDashboard,
  getPartnerDocumentVehicles,
  getPartnerDocumentVehiclesForAdmin,
  getPartnerIncomingVehicles,
  getPartnerPaymentVehicles,
  getPartnerProcessingStats,
  getPartnerProcessingVehicles,
  getPartnerVehicleDocuments,
  getPaymentProofsForAdmin,
  getPickupMap,
  getReadyForBiddingVehicles,
  getVehicleDashboardStats,
  getVehiclePricing,
  getVehicleStatusById,
  majorComponents,
  markVehicleArrived,
  registerBasicVehicleDetails,
  requestPickupOtp,
  reviewPartnerDocument,
  reviewPaymentProof,
  reviewVehicle,
  schedulePickup,
  scheduleVehiclePickup,
  setPickupVehicleController,
  submitPartnerDocuments,
  underVerification,
  updateAuctionVehicleStatus,
  updatePartnerProcessingStage,
  updateVehicleStatus,
  uploadPartnerDocument,
  uploadPartnerPaymentProof,
  uploadVehicleDocumentController,
  uploadVehiclePhotosController,
  vehicleCondition,
  vehiclePickupLocation,
  verifyPickupOtp,
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
  paymentProofUpload,
  uploadOwnerPaymentDocuments,
  uploadVehicleDocumentByPartner,
  uploadVehiclePhotos,
} from "../middlewares/uploadVehicleDocument.js";
import adminOnly from "../middlewares/adminOnly.js";
import serviceAuth from "../middlewares/serviceAuth.js";
import { uploadLimiter } from "../middlewares/ratelimit.middleware.js";

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
  uploadLimiter,
  attachUser,
  uploadVehicleDocument,
  uploadVehicleDocumentController,
);

router.get("/all-vehicles", attachUser, getAllVehicles);

router.put(
  "/photos",
  uploadLimiter,
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
router.get("/partner/incoming", getPartnerIncomingVehicles);
router.get("/partner/processing", getPartnerProcessingVehicles);
router.get("/partner/processing/stats", getPartnerProcessingStats);
// router.post("/pickup/request-otp", requestPickupOtp);
// router.post("/pickup/verify-otp", verifyPickupOtp);
router.post("/pickup-vehicle", adminOnly, setPickupVehicleController);
router.get("/admin/all-status", getAllVehiclesWithStatus);
router.get("/admin/status", getVehicleStatusById);
router.patch("/admin/arrived", markVehicleArrived);

router.get("/partner/documents/vehicles", getPartnerDocumentVehicles);

router.get(
  "/partner/documents/vehicles/check",

  getPartnerVehicleDocuments,
);

router.post(
  "/partner/documents/upload",
  uploadLimiter,
  uploadVehicleDocumentByPartner,
  uploadPartnerDocument,
);

router.post("/partner/documents/submit", submitPartnerDocuments);

router.get(
  "/customer/bookings",

  getCustomerBookings,
);

router.get(
  "/customer/bookings",

  getCustomerBookingById,
);

router.get(
  "/partner/dashboard",

  getPartnerDashboard,
);

router.patch("/partner/processing-stage", updatePartnerProcessingStage);

router.get(
  "/admin/partner-documents/vehicles",
  adminOnly,
  getPartnerDocumentVehiclesForAdmin,
);

router.patch(
  "/admin/partner-documents/vehicles/review",
  adminOnly,
  reviewPartnerDocument,
);

router.patch(
  "/admin/partner-documents/vehicles/approve",
  adminOnly,
  approveAllPartnerDocuments,
);

router.get("/partner/payments/vehicles", getPartnerPaymentVehicles);

router.post(
  "/partner/payments/proof",
  uploadLimiter,
  paymentProofUpload.single("paymentProof"),
  uploadPartnerPaymentProof,
);

router.get("/vehicles/estimated-price", calculateVehicleEstimatedPrice);

router.get("/admin/payments/pending", adminOnly, getPaymentProofsForAdmin);

router.patch("/admin/payments/review", adminOnly, reviewPaymentProof);

router.get("/owner/verified-payment", getOwnerVerifiedPaymentVehicles);

router.post(
  "/owner/accept-offer",
  uploadLimiter,
  uploadOwnerPaymentDocuments,
  acceptOfferAndSubmitPaymentDocuments,
);

router.get("/vehicles/pricing", getVehiclePricing);

export default router;
