import { z } from "zod";


// blog creation validation
const createBlogValidationSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, "Title cannot be empty"),
  slug: z.string().min(1, "Slug cannot be empty").optional(),
  content: z
    .string({ message: "Content is required" })
    .min(1, "Content cannot be empty"),
  excerpt: z.string().optional(),
  featuredImage: z
    .url("Featured image must be a valid URL")
    .optional(),
  isFeatured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  category: z.string().optional(),
  authorUsername: z.string({ message: "Author username is required" }),
});


// blog update validation
const updateBlogValidationSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  slug: z.string().min(1, "Slug cannot be empty").optional(),
  content: z.string().min(1, "Content cannot be empty").optional(),
  excerpt: z.string().optional(),
  featuredImage: z
    .url("Featured image must be a valid URL")
    .optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  authorUsername: z.string().optional(),
});

export const BlogValidations = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};
