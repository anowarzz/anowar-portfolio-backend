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
    where: {
      isDeleted: false,
    },
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
  const blog = await prisma.blogPost.findFirst({
    where: {
      slug: slug,
      isDeleted: false,
    },
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

// Update blog post by Id
const updateBlog = async (id: number, blogData: Prisma.BlogPostUpdateInput) => {
  // Check if blog exists
  const existingBlog = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!existingBlog) {
    throw new Error("Blog post not found");
  }

  // regenerate slug for title update
  if (blogData.title && typeof blogData.title === "string") {
    blogData.slug = generateSlug(blogData.title);

    // Check if new slug exists already
    const slugExists = await prisma.blogPost.findFirst({
      where: {
        slug: blogData.slug,
        NOT: { id },
      },
    });

    if (slugExists) {
      blogData.slug = `${blogData.slug}-${Date.now()}`;
    }
  }

  const result = await prisma.blogPost.update({
    where: { id },
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

// Soft delete blog post by Id
const deleteBlog = async (id: number) => {
  // Check if blog exists and is not already deleted
  const existingBlog = await prisma.blogPost.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!existingBlog) {
    throw new Error("Blog post not found or already deleted");
  }

  // Soft delete by setting isDeleted to true
  const result = await prisma.blogPost.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

export const blogServices = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
