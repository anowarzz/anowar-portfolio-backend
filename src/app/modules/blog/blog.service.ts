import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Create a blog post
const createBlog = async (blogData: Prisma.BlogPostCreateInput) => {
  // Generate slug if not provided
  if (!blogData.slug) {
    blogData.slug = generateSlug(blogData.title);
  }

  // Ensure slug is unique by appending timestamp if needed
  const existingBlog = await prisma.blogPost.findUnique({
    where: { slug: blogData.slug },
  });

  if (existingBlog) {
    blogData.slug = `${blogData.slug}-${Date.now()}`;
  }

  const result = await prisma.blogPost.create({
    data: blogData,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return result;
};

export const blogServices = {
  createBlog,
};
