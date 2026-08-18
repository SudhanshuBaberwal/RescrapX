import  { Router } from "express"
import { protect } from "../middleware/auth.middleware.js";
import { getAdminDashboard } from "../controller/admin.controller.js";

const router = Router()

router.get("/admin/dashboard",protect ,getAdminDashboard)

export default router;