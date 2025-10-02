import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { BlogController } from "./blog.controller";
import { BlogValidations } from "./blog.validation";

const router = Router();

// Get all blog posts
router.get("/", BlogController.getAllBlogs);

// Get single blog post by slug
router.get("/:slug", BlogController.getBlogBySlug);

// Create blog post
router.post(
  "/",
  validateRequest(BlogValidations.createBlogValidationSchema),
  BlogController.createBlog
);

// Update blog post by id
router.patch(
  "/:id",
  validateRequest(BlogValidations.updateBlogValidationSchema),
  BlogController.updateBlog
);

// Delete blog post by id
router.delete("/:id", BlogController.deleteBlog);

export const BlogRoutes = router;
