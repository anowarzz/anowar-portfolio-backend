import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { BlogController } from "./blog.controller";
import { BlogValidations } from "./blog.validation";

const router = Router();

// Create blog post
router.post(
  "/",
  validateRequest(BlogValidations.createBlogValidationSchema),
  BlogController.createBlog
);

export const BlogRoutes = router;
