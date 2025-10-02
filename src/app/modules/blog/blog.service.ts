import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import { generateSlug } from "../../utils/generateSlug";

// Create a blog post
const createBlog = async (blogData: Prisma.BlogPostCreateInput) => {
  // Generate slug
  if (!blogData.slug) {
    blogData.slug = generateSlug(blogData.title);
  }

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
          username: true,
          email: true,
        },
      },
    },
  });
  return result;
};

// Get all blog posts
const getAllBlogs = async () => {
  const blogs = await prisma.blogPost.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return blogs;
};

// Get single blog post by slug
const getBlogBySlug = async (slug: string) => {
  const blog = await prisma.blogPost.findUnique({
    where: { slug: slug },
    include: {
      author: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  if (!blog) {
    throw new Error("Blog post not found");
  }

  // increase views count
  await prisma.blogPost.update({
    where: { slug: slug },
    data: { views: { increment: 1 } },
  });

  return blog;
};

export const blogServices = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
};
