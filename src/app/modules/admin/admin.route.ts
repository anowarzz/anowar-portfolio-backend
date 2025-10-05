import { Router } from "express";
import { verifyAdmin } from "../../middleware/checkAuth";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/stats", verifyAdmin, AdminController.getAdminStats);

router.get("/verify-token", AdminController.verifyAdminToken);

export const AdminRoutes = router;
