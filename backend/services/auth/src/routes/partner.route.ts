import express from "express";

import protect from "../middleware/protect.middleware.js";
import uploadPartnerDocuments from "../middleware/uploadPartnerDocuments.js";
import partnerController from "../controllers/partner.controller.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

router.post(
  "/upload-documents",
  protect,
  uploadPartnerDocuments,
  partnerController.uploadDocuments,
);

router.get("/status", protect, partnerController.getPartnerStatusController);

router.get(
  "/all-partners",
  protect,
  adminOnly,
  partnerController.getAllPartnersController,
);

router.get(
  "/ready-for-auction",
  protect,
  adminOnly,
  partnerController.getReadyForAuctionPartners,
);

export default router;
