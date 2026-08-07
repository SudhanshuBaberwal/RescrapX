import { Router } from "express";
import {
  getAllCustomersData,
  getUserProfileController,
  KYCController,
  syncVehicleDocumentsController,
  updateUserProfileController,
} from "../controllers/user.controller.js";
import protect from "../middleware/protect.middleware.js";
import adminOnly from "../middleware/adminOnly.js";
import { uploaduserDocuments } from "../middleware/uploadPartnerDocuments.js";

const router = Router();

router.post("/sync-vehicle-documents", protect, syncVehicleDocumentsController);
router.get("/customers-data", adminOnly, getAllCustomersData);
router.post(
  "/kyc",
  protect,
  uploaduserDocuments.fields([
    {
      name: "currentPic",
      maxCount: 1,
    },
    {
      name: "front",
      maxCount: 1,
    },
    {
      name: "back",
      maxCount: 1,
    },
  ]),
  KYCController,
);
router.get(
  "/profile",
  protect,
  getUserProfileController,
);
router.put(
  "/profile",
  protect,
  updateUserProfileController,
);

export default router;
