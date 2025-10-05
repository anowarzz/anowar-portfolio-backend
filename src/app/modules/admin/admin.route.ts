import { Router } from "express";
import { AdminController } from "./admin.controller";
import { verifyAdmin } from "../../middleware/checkAuth";

const router = Router();

router.get(
  "/stats",
  verifyAdmin,
  AdminController.getAdminStats
);

export const AdminRoutes = router;
