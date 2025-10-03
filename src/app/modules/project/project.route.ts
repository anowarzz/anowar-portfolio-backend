import { Router } from "express";
import multer from "multer";
import { verifyAdmin } from "../../middleware/checkAuth";
import { ProjectController } from "./project.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // Limit file size to 3MB
});

const router = Router();

router.post(
  "/",
  //   verifyAdmin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 5 },
  ]),
  ProjectController.addProject
);
router.get("/", ProjectController.getAllProjects);
router.get("/:id", ProjectController.getSingleProject);
router.patch("/:id", verifyAdmin, ProjectController.updateProject);
router.delete("/:id", verifyAdmin, ProjectController.deleteProject);

export const ProjectRoutes = router;
