import { Router } from "express";
import { ProjectController } from "./project.controller";

const router = Router();

router.post("/add-project", ProjectController.addProject);

export const ProjectRoutes = router;
