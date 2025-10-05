import { Router } from "express";
import { verifyAdmin } from "../../middleware/checkAuth";
import { upload } from "../project/project.route";
import { BlogController } from "./blog.controller";

const router = Router();

// get all blog posts
router.get("/all", BlogController.getAllBlogs);

// get blog stats
router.get("/stats", BlogController.getBlogStats);

// get single blog post by id
router.get("/id/:id", BlogController.getBlogById);

// get single blog post by slug
router.get("/:slug", BlogController.getBlogBySlug);

// create blog post
router.post(
  "/",
  upload.single("featuredImage"),
  verifyAdmin,
  BlogController.createBlog
);

// update blog post by id
router.patch(
  "/id/:id",
  upload.single("featuredImage"),

  verifyAdmin,
  BlogController.updateBlog
);

// delete blog post by id
router.delete("/id/:id", verifyAdmin, BlogController.deleteBlog);

export const BlogRoutes = router;
