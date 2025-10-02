import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.adminLogin);
router.post("/logout", AuthController.adminLogout);

export const AuthRoutes = router;
