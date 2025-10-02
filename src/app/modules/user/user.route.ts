import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { UserValidations } from "./user.validation";

const router = Router();

// Create user (admin)
router.post(
  "/create-admin",
  validateRequest(UserValidations.createUserValidationSchema),
  UserController.createUser
);

export const UserRoutes = router;
