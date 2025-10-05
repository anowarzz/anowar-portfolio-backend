import { prisma } from "../../config/db";

// admin statistics
const getAdminStats = async () => {
  return await prisma.$transaction(async (tx) => {
    // blog stats
    const blogAggregates = await tx.blogPost.aggregate({
      where: {
        isDeleted: false,
      },
      _count: true,
      _sum: { views: true },
    });

    const featuredBlogsCount = await tx.blogPost.count({
      where: {
        isFeatured: true,
        isDeleted: false,
      },
    });

    const topViewedBlog = await tx.blogPost.findFirst({
      where: {
        isDeleted: false,
      },
      orderBy: { views: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
      },
    });

    // recent blogs - last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentBlogsCount = await tx.blogPost.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
        isDeleted: false,
      },
    });

    //* Project stats *//
    const projectsCount = await tx.project.count();

    const recentProjectsCount = await tx.project.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
      },
    });

    return {
      overview: {
        totalBlogs: blogAggregates._count,
        totalProjects: projectsCount,
        totalViews: blogAggregates._sum.views || 0,
      },
      blogs: {
        total: blogAggregates._count,
        featured: featuredBlogsCount,
        totalViews: blogAggregates._sum.views || 0,
        recentCount: recentBlogsCount,
        topViewed: topViewedBlog,
      },
      projects: {
        total: projectsCount,
        recentCount: recentProjectsCount,
      },
    };
  });
};

export const adminServices = {
  getAdminStats,
};
