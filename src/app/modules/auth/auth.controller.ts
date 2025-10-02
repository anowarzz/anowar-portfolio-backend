import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { envVars } from "./../../config/env";
import { AuthServices } from "./auth.service";

// admin login
const adminLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: loginInfo,
    });
  }
);

// admin logout
const adminLogout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Clear both tokens from cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Logged Out Successfully",
      data: null,
    });
  }
);

export const AuthController = {
  adminLogin,
  adminLogout,
};
