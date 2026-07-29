import express from "express"
import protect from "../middleware/protect.middleware.js";
import adminOnly from "../middleware/adminOnly.js";
import { approvePartnerController } from "../controllers/admin.controller.js";

const adminRouter = express.Router()

adminRouter.patch(
    "/partners/:partnerId/approve",
    protect,
    adminOnly,
    approvePartnerController
);

export default adminRouter;