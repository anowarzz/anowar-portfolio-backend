import { prisma } from "../../config/db";

// admin statistics
const getAdminStats = async () => {
  // last week date
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  // all queries run
  const [
    blogAggregates,
    featuredBlogsCount,
    topViewedBlog,
    recentBlogsCount,
    projectsCount,
    recentProjectsCount,
  ] = await Promise.all([
    // Blog stats
    prisma.blogPost.aggregate({
      where: {
        isDeleted: false,
      },
      _count: true,
      _sum: { views: true },
    }),

    prisma.blogPost.count({
      where: {
        isFeatured: true,
        isDeleted: false,
      },
    }),

    prisma.blogPost.findFirst({
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
    }),

    // Recent blogs - last 7 days
    prisma.blogPost.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
        isDeleted: false,
      },
    }),

    // Project stats
    prisma.project.count(),

    prisma.project.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
      },
    }),
  ]);

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
};

export const adminServices = {
  getAdminStats,
};
