import express from "express";

import protect from "../middleware/protect.middleware.js";
import uploadPartnerDocuments from "../middleware/uploadPartnerDocuments.js";
import partnerController from "../controllers/partner.controller.js";

const router = express.Router();

router.post(
  "/upload-documents",
  protect,
  uploadPartnerDocuments,
  partnerController.uploadDocuments,
);

router.get(
    "/status",
    protect,
    partnerController.getPartnerStatusController
);

export default router;