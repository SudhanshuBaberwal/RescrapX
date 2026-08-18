import { Router } from "express";
import { getAdminDashboard } from "../controller/admin.controller.ts";
import { protect } from "../middleware/auth.middleware.ts";
const router = Router();
router.get("/admin/dashboard", protect, getAdminDashboard);
export default router;
