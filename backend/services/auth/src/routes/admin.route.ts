import express from "express";
import protect from "../middleware/protect.middleware.js";
import adminOnly from "../middleware/adminOnly.js";
import {
  approvePartnerController,
  rejectPartner,
  reuploadPartnerDocument,
  viewDocument,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post(
  "/update-partner-status",
  protect,
  adminOnly,
  approvePartnerController,
);

adminRouter.post("/document/view", protect, adminOnly, viewDocument);
adminRouter.patch("/reject-partner", protect, adminOnly, rejectPartner);
adminRouter.patch("/reupload-document" , protect,reuploadPartnerDocument)

export default adminRouter;
