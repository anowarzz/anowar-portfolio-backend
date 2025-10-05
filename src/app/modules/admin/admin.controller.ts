import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
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

// verify admin token
const verifyAdminToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("hit to verify");

    const token = req.cookies.accessToken;
    if (!token) {
      throw new AppError(401, "No Token Provided");
    }
    const isValid = await adminServices.verifyAdminToken(token);

    console.log(isValid);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Token Verification Successful",
      data: { isValid },
    });
  }
);

export const AdminController = {
  getAdminStats,
  verifyAdminToken,
};
