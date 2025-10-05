import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

// admin statistics
const getAdminStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await adminServices.getAdminStats();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin statistics retrieved successfully",
      data: stats,
    });
  }
);

export const AdminController = {
  getAdminStats,
};
