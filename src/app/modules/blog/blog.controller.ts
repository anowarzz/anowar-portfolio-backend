import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { blogServices } from "./blog.service";

// Create a blog post
const createBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogData = req.body;
    const blog = await blogServices.createBlog(blogData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  }
);

// Get all blog posts
const getAllBlogs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogs = await blogServices.getAllBlogs();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Blogs retrieved successfully",
      data: blogs,
    });
  }
);

// Get single blog post by slug
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

// Update blog post by id
const updateBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const blogData = req.body;
    const blog = await blogServices.updateBlog(Number(id), blogData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  }
);

// Delete blog post by id
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

export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
