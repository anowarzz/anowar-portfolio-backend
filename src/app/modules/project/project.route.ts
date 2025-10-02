import { Router } from "express";
import { ProjectController } from "./project.controller";

const router = Router();

router.post("/add-project", ProjectController.addProject);
router.get("/", ProjectController.getAllProjects);

export const ProjectRoutes = router;
