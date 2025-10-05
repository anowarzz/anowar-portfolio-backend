import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get(
  "/stats",
  // verifyAdmin,
  AdminController.getAdminStats
);

export const AdminRoutes = router;
