import { z } from "zod";

// add new project validation schema
const createProjectValidationSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(200, "Title must be less than 200 characters"),
  image: z.url("Main image must be a valid URL"),
  projectType: z
    .string({ message: "Project type is required" })
    .min(1, "Project type cannot be empty")
    .max(50, "Project type must be less than 50 characters"),
  projectSummary: z
    .string({ message: "Project summary is required" })
    .min(10, "Project summary must be at least 10 characters")
    .max(500, "Project summary must be less than 500 characters"),
  gitHubLink: z.url("GitHub link must be a valid URL"),
  liveSiteLink: z
    .string({ message: "Live site link is required" })
    .url("Live site link must be a valid URL"),
  technologies: z
    .array(z.string().min(1, "Technology name cannot be empty"))
    .min(1, "At least one technology is required")
    .max(20, "Cannot have more than 20 technologies"),
  details: z
    .array(z.string().min(1, "Detail cannot be empty"))
    .min(1, "At least one detail is required")
    .max(10, "Cannot have more than 10 details"),
  images: z
    .array(z.url("Each image must be a valid URL"))
    .optional()
    .default([])
    .refine((images) => images.length <= 5, {
      message: "Cannot have more than 5 images",
    }),
});

// update project validation schema
const updateProjectValidationSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  image: z.url("Main image must be a valid URL").optional(),
  projectType: z
    .string()
    .min(1, "Project type cannot be empty")
    .max(50, "Project type must be less than 50 characters")
    .optional(),
  projectSummary: z
    .string()
    .min(10, "Project summary must be at least 10 characters")
    .max(500, "Project summary must be less than 500 characters")
    .optional(),
  gitHubLink: z.string().url("GitHub link must be a valid URL").optional(),
  liveSiteLink: z.string().url("Live site link must be a valid URL").optional(),
  technologies: z
    .array(z.string().min(1, "Technology name cannot be empty"))
    .min(1, "At least one technology is required")
    .max(20, "Cannot have more than 20 technologies")
    .optional(),
  details: z
    .array(z.string().min(1, "Detail cannot be empty"))
    .min(1, "At least one detail is required")
    .max(10, "Cannot have more than 10 details")
    .optional(),
  images: z
    .array(z.url("Each image must be a valid URL"))
    .optional()
    .refine((images) => !images || images.length <= 5, {
      message: "Cannot have more than 5 images",
    }),
});

export const ProjectValidations = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};
