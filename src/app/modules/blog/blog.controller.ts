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

export const BlogController = {
  createBlog,
};
