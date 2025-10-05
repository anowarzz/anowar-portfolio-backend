import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import cloudinary from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/appError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { blogServices } from "./blog.service";

// Create a blog post
const createBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogData = req.body;

    const featuredImage = req.file;

    const isFeatured = blogData.isFeatured === "true";
    const tags = blogData.tags ? JSON.parse(blogData.tags) : [];

    console.log("Uploaded file:", featuredImage);
    console.log("Blog data:", blogData);

    let featuredImageUrl = "";
    if (featuredImage) {
      featuredImageUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "anowarzz-portfolio/blogs/feature-images",
            },
            (error, result) => {
              if (error)
                reject(new AppError(500, "feature image upload failed"));
              else resolve(result?.secure_url || "");
            }
          )
          .end(featuredImage.buffer);
      });
    }

    const { isFeatured: _, tags: __, ...restBlogData } = blogData;

    const blog = await blogServices.createBlog({
      ...(featuredImageUrl && { featuredImage: featuredImageUrl }),
      isFeatured,
      tags,
      ...restBlogData,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  }
);

// get all blog posts
const getAllBlogs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
      : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const blogs = await blogServices.getAllBlogs({
      page,
      limit,
      search,
      isFeatured,
      tags,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Blogs retrieved successfully",
      data: blogs.data,
      meta: {
        page: blogs.pagination.page,
        limit: blogs.pagination.limit,
        total: blogs.pagination.total,
        totalPages: blogs.pagination.totalPages,
      },
    });
  }
);

// get single blog post by slug
const getBlogBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const blog = await blogServices.getBlogBySlug(slug);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  }
);

// get single blog post by id
const getBlogById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const blog = await blogServices.getBlogById(Number(id));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  }
);

// update blog post by id
const updateBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const blogData = req.body;
    const featuredImage = req.file;

    console.log("Update - Uploaded file:", featuredImage);
    console.log("Update - Blog data:", blogData);

    // Handle featured image upload if provided
    let featuredImageUrl = "";
    if (featuredImage) {
      featuredImageUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "anowarzz-portfolio/blogs/feature-images",
            },
            (error, result) => {
              if (error)
                reject(new AppError(500, "feature image upload failed"));
              else resolve(result?.secure_url || "");
            }
          )
          .end(featuredImage.buffer);
      });
    }

    //isFeatured and tags  parse
    const isFeatured =
      blogData.isFeatured === "true" || blogData.isFeatured === true;
    const tags = blogData.tags
      ? typeof blogData.tags === "string"
        ? JSON.parse(blogData.tags)
        : blogData.tags
      : [];

    const updateData = {
      ...blogData,
      isFeatured,
      tags,
      ...(featuredImageUrl && { featuredImage: featuredImageUrl }),
    };

    const blog = await blogServices.updateBlog(Number(id), updateData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  }
);

// delete blog post by id
const deleteBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await blogServices.deleteBlog(Number(id));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog deleted successfully",
      data: null,
    });
  }
);

// get blog stats
const getBlogStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await blogServices.getBlogStats();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog stats retrieved successfully",
      data: stats,
    });
  }
);

export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  getBlogStats,
  updateBlog,
  deleteBlog,
};
