import { Router } from "express";
import { verifyAdmin } from "../../middleware/checkAuth";
import { ProjectController } from "./project.controller";

const router = Router();

router.post("/", verifyAdmin, ProjectController.addProject);
router.get("/", ProjectController.getAllProjects);
router.get("/:id", ProjectController.getSingleProject);
router.patch("/:id", verifyAdmin, ProjectController.updateProject);
router.delete("/:id", verifyAdmin, ProjectController.deleteProject);

export const ProjectRoutes = router;
