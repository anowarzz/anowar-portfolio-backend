import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import { generateSlug } from "../../utils/generateSlug";

// Create a blog post //
const createBlog = async (blogData: Prisma.BlogPostCreateInput) => {
  // generate slug
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

// get all blog posts
const getAllBlogs = async ({
  page = 1,
  limit = 10,
  search,
  isFeatured,
  tags,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  tags?: string[];
}) => {
  const skip = (page - 1) * limit;

  const whereConditions: Prisma.BlogPostWhereInput[] = [{ isDeleted: false }];

  // add search condition
  if (search) {
    whereConditions.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  // add isFeatured filter
  if (typeof isFeatured === "boolean") {
    whereConditions.push({ isFeatured });
  }

  // add tags filter
  if (tags && tags.length > 0) {
    whereConditions.push({ tags: { hasEvery: tags } });
  }

  const where: Prisma.BlogPostWhereInput = {
    AND: whereConditions,
  };

  const result = await prisma.blogPost.findMany({
    skip,
    take: limit,
    where,
    include: {
      author: {
        select: {
          username: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.blogPost.count({ where });

  return {
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// get single blog post by slug
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

// get single blog post by id
const getBlogById = async (id: number) => {
  const blog = await prisma.blogPost.findFirst({
    where: {
      id: id,
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
    where: { id: id },
    data: { views: { increment: 1 } },
  });

  return blog;
};

// update blog post by Id
const updateBlog = async (id: number, blogData: Prisma.BlogPostUpdateInput) => {
  const existingBlog = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!existingBlog) {
    throw new Error("Blog post not found");
  }

  // regenerate slug for title update
  if (blogData.title && typeof blogData.title === "string") {
    blogData.slug = generateSlug(blogData.title);

    // check if new slug exists already
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

// soft delete blog post by id
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

  const result = await prisma.blogPost.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

// Get blog stats
const getBlogStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const aggregates = await tx.blogPost.aggregate({
      where: {
        isDeleted: false,
      },
      _count: true,
      _sum: { views: true },
      _avg: { views: true },
      _max: { views: true },
      _min: { views: true },
    });

    const featuredCount = await tx.blogPost.count({
      where: {
        isFeatured: true,
        isDeleted: false,
      },
    });

    const topFeatured = await tx.blogPost.findFirst({
      where: {
        isFeatured: true,
        isDeleted: false,
      },
      orderBy: { views: "desc" },
    });

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastWeekPostCount = await tx.blogPost.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
        isDeleted: false,
      },
    });

    return {
      stats: {
        totalPosts: aggregates._count ?? 0,
        totalViews: aggregates._sum.views ?? 0,
        avgViews: aggregates._avg.views ?? 0,
        minViews: aggregates._min.views ?? 0,
        maxViews: aggregates._max.views ?? 0,
      },
      featured: {
        count: featuredCount,
        topPost: topFeatured,
      },
      lastWeekPostCount,
    };
  });
};

export const blogServices = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  getBlogStats,
  deleteBlog,
};
