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
  featuredImage: z.string().optional(), // Allow string for file handling
  isFeatured: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      return val === "true";
    })
    .optional()
    .default(false),
  tags: z
    .union([z.array(z.string()), z.string()])
    .transform((val) => {
      if (Array.isArray(val)) return val;
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    })
    .optional()
    .default([]),
  category: z.string().optional(),
  authorUsername: z.string({ message: "Author username is required" }),
});

// blog update validation
const updateBlogValidationSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  slug: z.string().min(1, "Slug cannot be empty").optional(),
  content: z.string().min(1, "Content cannot be empty").optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  isFeatured: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") return val === "true";
      return val;
    })
    .optional(),
  tags: z
    .union([z.array(z.string()), z.string()])
    .transform((val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    })
    .optional(),
  category: z.string().optional(),
  authorUsername: z.string().optional(),
});

export const BlogValidations = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};
